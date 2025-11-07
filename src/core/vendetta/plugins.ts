import {
  awaitStorage,
  createMMKVBackend,
  createStorage,
  purgeStorage,
  wrapSync,
} from "@core/vendetta/storage";
import { Author } from "@lib/addons/types";
import { settings } from "@lib/api/settings";
import { safeFetch } from "@lib/utils";
import { VD_PROXY_PREFIX } from "@lib/utils/constants";
import { logger, LoggerClass } from "@lib/utils/logger";

type EvaledPlugin = {
  onLoad?(): void;
  onUnload(): void;
  settings: React.ComponentType<unknown>;
};

// See https://github.com/vendetta-mod/polymanifest
interface PluginManifest {
  name: string;
  description: string;
  authors: Author[];
  main: string;
  hash: string;
  // Vendor-specific field, contains our own data
  vendetta?: {
    icon?: string;
  };
}

export interface VendettaPlugin {
  id: string;
  manifest: PluginManifest;
  enabled: boolean;
  update: boolean;
  js: string;
}

const plugins = wrapSync(
  createStorage<Record<string, VendettaPlugin>>(
    createMMKVBackend("VENDETTA_PLUGINS"),
  ),
);
const pluginInstance: Record<string, EvaledPlugin> = {};

export const VdPluginManager = {
  plugins,
  async pluginFetch(url: string) {
    // was causing problems, dumb me with redirections
    // :3
    // No redirection: use VD_PROXY_PREFIX as intended
    // if (url.startsWith(VD_PROXY_PREFIX)) {
    //   url = url
    //     .replace(
    //       "https://bunny-mod.github.io/plugins-proxy",
    //       BUNNY_PROXY_PREFIX,
    //     )
    //     .replace(VD_PROXY_PREFIX, BUNNY_PROXY_PREFIX);
    // }
    // End of pluginFetch function block

    return await safeFetch(url, { cache: "no-store" });
  },

  async fetchPlugin(id: string) {
    if (!id.endsWith("/")) id += "/";
    const existingPlugin = plugins[id];

    let pluginManifest: PluginManifest;

    try {
      pluginManifest = await (
        await this.pluginFetch(id + "manifest.json")
      ).json();
    } catch {
      throw new Error(`Failed to fetch manifest for ${id}`);
    }

    let pluginJs: string | undefined;

    if (existingPlugin?.manifest.hash !== pluginManifest.hash) {
      try {
        // by polymanifest spec, plugins should always specify their main file, but just in case
        pluginJs = await (
          await this.pluginFetch(id + (pluginManifest.main || "index.js"))
        ).text();
      } catch {} // Empty catch, checked below
    }

    if (!pluginJs && !existingPlugin)
      throw new Error(`Failed to fetch JS for ${id}`);

    plugins[id] = {
      id: id,
      manifest: pluginManifest,
      enabled: existingPlugin?.enabled ?? false,
      update: existingPlugin?.update ?? true,
      js: pluginJs ?? existingPlugin.js,
    };
  },

  async installPlugin(id: string, enabled = true) {
    if (!id.endsWith("/")) id += "/";
    if (typeof id !== "string" || id in plugins)
      throw new Error("Plugin already installed");
    await this.fetchPlugin(id);
    if (enabled) await this.startPlugin(id);
  },

  /**
   * @internal
   */
  async evalPlugin(plugin: VendettaPlugin) {
    const vendettaForPlugins = {
      ...window.vendetta,
      plugin: {
        id: plugin.id,
        manifest: plugin.manifest,
        // Wrapping this with wrapSync is NOT an option.
        storage: await createStorage<Record<string, any>>(
          createMMKVBackend(plugin.id),
        ),
      },
      logger: new LoggerClass(`ShiggyCord » ${plugin.manifest.name}`),
    };
    const pluginString = `vendetta=>{return ${plugin.js}}\n//# sourceURL=${plugin.id}`;

    const raw = (0, eval)(pluginString)(vendettaForPlugins);
    const ret = typeof raw === "function" ? raw() : raw;
    return ret?.default ?? ret ?? {};
  },

  async startPlugin(id: string) {
    if (!id.endsWith("/")) id += "/";
    const plugin = plugins[id];
    if (!plugin) throw new Error("Attempted to start non-existent plugin");

    try {
      if (!settings.safeMode?.enabled) {
        const pluginRet: EvaledPlugin = await this.evalPlugin(plugin);
        pluginInstance[id] = pluginRet;
        pluginRet.onLoad?.();
      }
      plugin.enabled = true;
    } catch (e) {
      logger.error(
        `Plugin ${plugin.id} errored whilst loading, and will be unloaded`,
        e,
      );

      try {
        pluginInstance[plugin.id]?.onUnload?.();
      } catch (e2) {
        logger.error(`Plugin ${plugin.id} errored whilst unloading`, e2);
      }

      delete pluginInstance[id];
      plugin.enabled = false;
    }
  },

  stopPlugin(id: string, disable = true) {
    if (!id.endsWith("/")) id += "/";
    const plugin = plugins[id];
    const pluginRet = pluginInstance[id];
    if (!plugin) throw new Error("Attempted to stop non-existent plugin");

    if (!settings.safeMode?.enabled) {
      try {
        pluginRet?.onUnload?.();
      } catch (e) {
        logger.error(`Plugin ${plugin.id} errored whilst unloading`, e);
      }

      delete pluginInstance[id];
    }

    if (disable) plugin.enabled = false;
  },

  async removePlugin(id: string) {
    if (!id.endsWith("/")) id += "/";
    const plugin = plugins[id];
    if (plugin.enabled) this.stopPlugin(id);
    delete plugins[id];
    await purgeStorage(id);
  },

  /**
   * @internal
   */
  async initPlugins() {
    await awaitStorage(settings, plugins);
    const allIds = Object.keys(plugins);

    if (!settings.safeMode?.enabled) {
      // Staggered startup: start enabled plugins in small batches to avoid
      // CPU / I/O spikes during app launch. Network fetches (which may be slow)
      // are deferred to background so the UI can become interactive faster.
      const enabledIds = allIds.filter((pl) => plugins[pl].enabled);
      const batchSize = 2;
      const staggerInterval = 500;

      if (enabledIds.length > 0) {
        const sleep = (ms: number) =>
          new Promise<void>((res) => setTimeout(res, ms));

        for (let i = 0; i < enabledIds.length; i += batchSize) {
          const batch = enabledIds.slice(i, i + batchSize);

          // Start the batch in parallel but avoid letting a single failing plugin
          // abort the whole process.
          await Promise.allSettled(
            batch.map(async (id) => {
              try {
                if (!plugins[id]) return;
                await this.startPlugin(id).catch((e) =>
                  logger.error(`Vendetta plugin ${id} failed to start:`, e),
                );
              } catch (err) {
                logger.error(
                  `Unexpected error while starting vendetta plugin ${id}:`,
                  err,
                );
              }
            }),
          );

          if (i + batchSize < enabledIds.length) {
            await sleep(staggerInterval);
          }
        }
      }

      // Defer network fetches to the background so startup isn't delayed.
      // We fetch updates for plugins (both enabled and disabled) but do this
      // asynchronously and with a small delay between requests to reduce contention.
      (async () => {
        const toFetch = allIds.filter((pl) => plugins[pl]?.update);
        for (const pl of toFetch) {
          try {
            // Fire fetch; fetchPlugin may update plugin JS/manifest. Errors are logged.
            await this.fetchPlugin(pl).catch((e: Error) => {
              logger.error(e.message);
            });
          } catch (e) {
            logger.error(
              `Failed background fetch for vendetta plugin ${pl}:`,
              e,
            );
          }
          // Small pause between network requests to avoid spikes
          await new Promise((res) => setTimeout(res, 200));
        }
      })();
    }

    return () => this.stopAllPlugins();
  },

  stopAllPlugins() {
    return Object.keys(pluginInstance).forEach((p) =>
      this.stopPlugin(p, false),
    );
  },

  getSettings: (id: string) => pluginInstance[id]?.settings,
};
