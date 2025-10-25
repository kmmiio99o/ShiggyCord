import { getCorePlugins } from "@core/plugins";
import { readFile, removeFile, writeFile } from "@lib/api/native/fs";
import {
  awaitStorage,
  createStorage,
  getPreloadedStorage,
  preloadStorageIfExists,
  purgeStorage,
  updateStorage,
} from "@lib/api/storage";
import { safeFetch } from "@lib/utils";
import { OFFICIAL_PLUGINS_REPO_URL } from "@lib/utils/constants";
import { semver } from "@metro/common";
import { updaterSettings } from "@lib/api/settings";

import { createBunnyPluginApi } from "./api";
import * as t from "./types";

type PluginInstantiator = (
  bunny: t.BunnyPluginObject,
  definePlugin?: (p: t.PluginInstance) => t.PluginInstanceInternal,
) => t.PluginInstanceInternal;

// Core plugins instances are stored both in this and pluginInstance
// This exists because pluginInstances only stores running plugins while this one
// stores the always existing core plugins instances (which can't be destroyed)
export const corePluginInstances = new Map<string, t.PluginInstanceInternal>();

export const registeredPlugins = new Map<string, t.BunnyPluginManifest>();
export const pluginInstances = new Map<string, t.PluginInstanceInternal>();
export const apiObjects = new Map<
  string,
  ReturnType<typeof createBunnyPluginApi>
>();

/**
 * Register core plugins into the runtime registries so they appear in the UI
 * as soon as this module is imported. This function is intentionally synchronous
 * and idempotent so it is safe to call at module-load time or from initialization
 * code.
 */
export function registerCorePlugins() {
  try {
    const core = getCorePlugins();
    for (const id in core) {
      try {
        const { default: instance, preenabled } = core[id];

        // Ensure manifest is registered for UI listing
        registeredPlugins.set(id, instance.manifest);

        // Keep a reference to the core plugin instance so isCorePlugin checks work
        corePluginInstances.set(id, instance);

        // Ensure pluginSettings has an entry for the core plugin so the UI can
        // reflect enabled/disabled state. Do not overwrite existing user settings.
        try {
          // `pluginSettings` is a storage wrapper; ensure we only set a default if absent.
          if (pluginSettings[id] == null) {
            pluginSettings[id] = { enabled: preenabled ?? true };
          }
        } catch (e) {
          // Best-effort: if storage isn't available yet, ignore and continue.
          console.error(
            "Failed to set default pluginSettings for core plugin",
            id,
            e,
          );
        }
      } catch (e) {
        console.error("Failed to register core plugin", id, e);
      }
    }
  } catch (e) {
    console.error("registerCorePlugins: unexpected error", e);
  }
}

// Eager core plugin registration removed to avoid circular require / timing issues.
// Call `registerCorePlugins()` explicitly from initialization code when appropriate,
// for example during a safe deferred startup step.

export const pluginRepositories = createStorage<t.PluginRepoStorage>(
  "plugins/repositories.json",
);
export const pluginSettings = createStorage<t.PluginSettingsStorage>(
  "plugins/settings.json",
);

const _fetch = (repoUrl: string, path: string) =>
  safeFetch(new URL(path, repoUrl), { cache: "no-store" });
const fetchJS = (repoUrl: string, path: string) =>
  _fetch(repoUrl, path).then((r) => r.text());
const fetchJSON = (repoUrl: string, path: string) =>
  _fetch(repoUrl, path).then((r) => r.json());

function assert<T>(
  condition: T,
  id: string,
  attempt: string,
): asserts condition {
  if (!condition) throw new Error(`[${id}] Attempted to ${attempt}`);
}

/**
 * Checks if a version is newer than the other. However, this comes with an additional logic,
 * where if the version are equal, one with prerelease "tag" will be considered "newer"
 * @internal
 * @returns Whether the version is newer
 */
export function isGreaterVersion(v1: string, v2: string) {
  if (semver.gt(v1, v2)) return true;
  const coerced = semver.coerce(v1);
  if (coerced == null) return false;
  return semver.prerelease(v1)?.includes("dev") && semver.eq(coerced, v2);
}

function isExternalPlugin(
  manifest: t.BunnyPluginManifest,
): manifest is t.BunnyPluginManifestInternal {
  return "parentRepository" in manifest;
}

export function isCorePlugin(id: string) {
  return corePluginInstances.has(id);
}

export function getPluginSettingsComponent(
  id: string,
): React.ComponentType<any> | null {
  const instance = pluginInstances.get(id);
  if (!instance) return null;

  if (instance.SettingsComponent) return instance.SettingsComponent;
  return null;
}

export function isPluginInstalled(id: string) {
  return pluginSettings[id] != null;
}

export function isPluginEnabled(id: string) {
  return Boolean(pluginSettings[id]?.enabled);
}

/**
 * Fetch and write the plugin to thier respective storage. This does not compare the version nor execute the plugin
 * @param repoUrl URL to the plugin repository
 * @param id The ID of the plugin
 * @returns The newly fetched plugin manifest
 */
export async function updateAndWritePlugin(
  repoUrl: string,
  id: string,
  fetchScript: boolean,
) {
  const manifest: t.BunnyPluginManifestInternal = await fetchJSON(
    repoUrl,
    `builds/${id}/manifest.json`,
  );

  // @ts-expect-error - Setting a readonly property
  manifest.parentRepository = repoUrl;

  if (fetchScript) {
    // @ts-expect-error - Setting a readonly property
    manifest.jsPath = `plugins/scripts/${id}.js`;

    const js: string = await fetchJS(repoUrl, `builds/${id}/index.js`);
    await writeFile(manifest.jsPath, js);
  }

  await updateStorage(`plugins/manifests/${id}.json`, manifest);

  if (registeredPlugins.has(id)) {
    const existingManifest = registeredPlugins.get(id)!;
    return Object.assign(existingManifest, manifest);
  }

  return manifest;
}

/**
 * Stops the plugin, fetches the update and restart the updated plugin
 * @param id The registered plugin's ID
 * @param repoUrl URL to the plugin repository. If unprovided, the repository url from the registered plugin will be used.
 */
export async function refreshPlugin(id: string, repoUrl?: string) {
  let manifest = registeredPlugins.get(id);

  assert(manifest, id, "refresh a non-registered plugin");
  assert(pluginInstances.get(id), id, "refresh a non-started plugin");

  stopPlugin(id);

  if (isExternalPlugin(manifest)) {
    manifest = await updateAndWritePlugin(
      repoUrl ?? manifest.parentRepository,
      id,
      true,
    );
  }

  registeredPlugins.delete(id);
  registeredPlugins.set(id, manifest);

  await startPlugin(id);
}

/**
 * Check for any updates from the repository given, or add it.
 * Then, register all plugins within the repository.
 * @param repoUrl Registered plugin repository url
 * @returns Whether there was any changes made from the update
 */
export async function updateRepository(repoUrl: string) {
  const repo: t.PluginRepo = await fetchJSON(repoUrl, "repo.json");
  const storedRepo = pluginRepositories[repoUrl];

  let updated = false;

  // This repository never existed, update it!
  if (!storedRepo) {
    for (const id in repo) {
      if (corePluginInstances.has(id)) {
        throw new Error(
          `Plugins can't have the same ID as any of Bunny core plugin '${id}'`,
        );
      }
    }

    updated = true;
    pluginRepositories[repoUrl] = repo;
  } else {
    // Remove plugins which no longer exists on the fetched repository
    for (const plugin in storedRepo)
      if (!repo[plugin]) {
        delete storedRepo[plugin];
      }
  }

  const pluginIds = Object.keys(repo).filter((id) => !id.startsWith("$"));
  await Promise.all(
    pluginIds.map(async (pluginId) => {
      if (
        !storedRepo ||
        !storedRepo[pluginId] ||
        repo[pluginId].alwaysFetch ||
        isGreaterVersion(repo[pluginId].version, storedRepo[pluginId].version)
      ) {
        updated = true;
        pluginRepositories[repoUrl][pluginId] = repo[pluginId];
        await updateAndWritePlugin(
          repoUrl,
          pluginId,
          Boolean(storedRepo && pluginSettings[pluginId]),
        );
      } else {
        const manifest = await preloadStorageIfExists(
          `plugins/manifests/${pluginId}.json`,
        );
        if (!manifest) {
          // File does not exist, so do refetch and stuff
          await updateAndWritePlugin(
            repoUrl,
            pluginId,
            Boolean(storedRepo && pluginSettings[pluginId]),
          );
        }
      }
    }),
  );

  // Register plugins in this repository
  for (const id of pluginIds) {
    const manifest = getPreloadedStorage<t.BunnyPluginManifest>(
      `plugins/manifests/${id}.json`,
    );
    if (manifest === undefined) continue; // shouldn't happen, but just incase if it does

    const existing = registeredPlugins.get(id);

    // Skip if this version isn't any higher
    if (existing && !isGreaterVersion(manifest.version, existing.version)) {
      continue;
    }

    registeredPlugins.set(id, manifest);
  }

  return updated;
}

/**
 * Deletes a repository from registrations and uninstalls ALL plugins under this repository
 */
export async function deleteRepository(repoUrl: string) {
  assert(
    repoUrl !== OFFICIAL_PLUGINS_REPO_URL,
    repoUrl,
    "delete the official repository",
  );
  assert(
    pluginRepositories[repoUrl],
    repoUrl,
    "delete a non-registered repository",
  );

  const promQueues = [] as Promise<unknown>[];

  for (const [id, manifest] of registeredPlugins) {
    if (!isExternalPlugin(manifest) || manifest.parentRepository !== repoUrl)
      continue;

    // Uninstall
    if (isPluginInstalled(id)) {
      promQueues.push(uninstallPlugin(id));
    }

    // Deregister all plugins under this repository
    promQueues.push(purgeStorage(`plugins/manifests/${id}.json`));
    registeredPlugins.delete(id);
  }

  delete pluginRepositories[repoUrl];
  await Promise.all(promQueues);
  updateAllRepository();
}

/**
 * Enablea a plugin. The plugin must have been declared as installed.
 * @param id The installed plugin ID
 * @param start Whether to start the plugin
 */
export async function enablePlugin(id: string, start: boolean) {
  assert(isPluginInstalled(id), id, "enable a non-installed plugin");

  if (start) await startPlugin(id);
  pluginSettings[id]!.enabled = true;
}

/**
 * Disables and stop the plugin. The plugin must have been declared as installed
 * @param id The installed plugin ID
 */
export function disablePlugin(id: string) {
  assert(isPluginInstalled(id), id, "disable a non-installed plugin");

  pluginInstances.has(id) && stopPlugin(id);
  pluginSettings[id]!.enabled = false;
}

/**
 * Installs a registered plugin, will throw when plugin was already installed
 * @param id The registered plugin ID
 * @param start Whether to start the plugin or not
 */
export async function installPlugin(id: string, start: boolean) {
  const manifest = registeredPlugins.get(id);

  assert(manifest, id, "install an non-registered plugin");
  assert(!isPluginInstalled(id), id, "install an already installed plugin");
  assert(isExternalPlugin(manifest), id, "install a core plugin");

  // We only need to fetch the JS, but this is fine
  await updateAndWritePlugin(manifest.parentRepository, id, true);

  pluginSettings[id] = { enabled: true };
  if (start) startPlugin(id);
}

/**
 * Uninstalls a plugin and remove it from the storage
 * @param id The installed plugin ID
 */
export async function uninstallPlugin(id: string) {
  const manifest = registeredPlugins.get(id);

  assert(manifest, id, "uninstall an unregistered plugin");
  assert(isPluginInstalled(id), id, "uninstall a non-installed plugin");
  assert(isExternalPlugin(manifest), id, "uninstall a core plugin");

  pluginInstances.has(id) && stopPlugin(id);
  delete pluginSettings[id];

  await purgeStorage(`plugins/storage/${id}.json`);
  await removeFile(`plugins/scripts/${id}.js`);
}

/**
 * Starts a registered, installed, enabled and unstarted plugin. Otherwise, would throw.
 * @param id The enabled plugin ID
 */
export async function startPlugin(
  id: string,
  { throwIfDisabled = false, disableWhenThrown = true } = {},
) {
  const manifest = registeredPlugins.get(id);

  assert(manifest, id, "start a non-registered plugin");
  assert(isPluginInstalled(id), id, "start a non-installed plugin");
  assert(
    !throwIfDisabled || pluginSettings[id]?.enabled,
    id,
    "start a disabled plugin",
  );
  assert(!pluginInstances.has(id), id, "start an already started plugin");

  await preloadStorageIfExists(`plugins/storage/${id}.json`);

  let pluginInstance: t.PluginInstanceInternal;

  if (isExternalPlugin(manifest)) {
    // Stage one, "compile" the plugin
    try {
      // jsPath should always exists when the plugin is installed, unless the storage is corrupted
      const iife = await readFile(manifest.jsPath!!);

      // Set a global marker so runtime/async errors can be attributed to the plugin
      // This is a minimal, best-effort context marker. It will be cleared immediately
      // after the synchronous evaluation step below.
      try {
        (window as any).__SHIGGY_CURRENT_PLUGIN = id;
      } catch {
        // ignore if environment prevents writing to window
      }

      var instantiator = globalEvalWithSourceUrl(
        `(bunny,definePlugin)=>{${iife};return plugin?.default ?? plugin;}`,
        `bunny-plugin/${id}-${manifest.version}`,
      ) as PluginInstantiator;
    } catch (error) {
      // Annotate parsing errors with plugin id to aid attribution in ErrorBoundary
      const e = new Error(
        "An error occured while parsing plugin's code, possibly a syntax error?",
        { cause: error },
      ) as any;
      e.pluginId = id;
      throw e;
    } finally {
      // Clear the immediate evaluation marker - instantiation happens next.
      try {
        (window as any).__SHIGGY_CURRENT_PLUGIN = null;
      } catch {}
    }

    // Stage two, load the plugin
    try {
      // During instantiation we again mark the current plugin so synchronous
      // work performed by the plugin's top-level code is attributable.
      try {
        (window as any).__SHIGGY_CURRENT_PLUGIN = id;
      } catch {}

      const api = createBunnyPluginApi(id);

      // Wrap instantiator call to annotate errors with plugin id if they escape here.
      try {
        pluginInstance = instantiator(api.object, (p) => {
          return Object.assign(p, {
            manifest,
          }) as t.PluginInstanceInternal;
        });
      } catch (innerError) {
        const e = new Error(
          "An error occured while instantiating plugin's code",
        ) as any;
        e.cause = innerError;
        e.pluginId = id;
        throw e;
      }

      if (!pluginInstance) {
        const e = new Error(
          `Plugin '${id}' does not export a valid plugin instance`,
        ) as any;
        e.pluginId = id;
        throw e;
      }

      apiObjects.set(id, api);
      pluginInstances.set(id, pluginInstance);
    } catch (error) {
      // propagate already-annotated error or annotate as fallback
      if (!(error as any).pluginId) (error as any).pluginId = id;
      throw error;
    } finally {
      // Always clear the global plugin marker after instantiation attempt.
      try {
        (window as any).__SHIGGY_CURRENT_PLUGIN = null;
      } catch {}
    }
  } else {
    pluginInstance = corePluginInstances.get(id)!;
    assert(pluginInstance, id, "start a non-existent core plugin");
    pluginInstances.set(id, pluginInstance);
  }

  // Stage three (of external plugins), start the plugin
  try {
    pluginInstance.start?.();

    pluginSettings[id]!.enabled = true;
  } catch (error) {
    disableWhenThrown && disablePlugin(id);
    throw new Error("An error occured while starting the plugin", {
      cause: error,
    });
  }
}

/**
 * Stops the plugin and disposes all usages of scoped plugin API
 * @param id The currently-running plugin's ID
 */
export function stopPlugin(id: string) {
  const instance = pluginInstances.get(id);
  assert(instance, id, "stop a non-started plugin");

  instance.stop?.();
  const obj = apiObjects.get(id);
  obj?.disposers.forEach((d: Function) => d());
  pluginInstances.delete(id);
}

/**
 * Utility: produce a sequence of bisect batches for enabled external plugins.
 * This returns an array of arrays where each returned array is the set of plugin
 * ids you should disable in that bisect step (simple binary-halving strategy).
 *
 * The UI can use these batches to guide a manual binary-search disabling flow:
 * - Disable all plugin ids in batches[0], reproduce crash
 * - If crash persists, disable batches[1], otherwise re-enable batches[0] and disable complementary half, etc.
 *
 * This function is intentionally read-only; it only computes batches. The UI
 * should call `disablePlugin(id)` / `enablePlugin(id, ...)` itself to toggle plugins.
 */
export function getBisectBatches(maxPerStep = 50): string[][] {
  // Collect external enabled plugin ids
  const enabled: string[] = [];
  for (const [id, manifest] of registeredPlugins) {
    try {
      const isExternal = (manifest as any).parentRepository != null;
      const enabledFlag = Boolean(pluginSettings[id]?.enabled);
      if (!isExternal) continue;
      if (!enabledFlag) continue;
      enabled.push(id);
    } catch {
      // ignore corrupt manifests
    }
  }

  // Limit to a reasonable number to avoid overwhelming the user
  const ids = enabled.slice(0, maxPerStep);

  if (ids.length <= 1) return ids.length === 1 ? [[ids[0]]] : [];

  // Binary-halving batches:
  // On step n, disable the first half of the current candidate set.
  const batches: string[][] = [];
  let candidates = ids.slice();
  while (candidates.length > 1) {
    const half = Math.ceil(candidates.length / 2);
    const toDisable = candidates.slice(0, half);
    batches.push(toDisable);
    // For the next iteration assume we will test the complement; compute complement
    candidates = candidates.slice(half);
    // If complement has only one left, add it as final step
    if (candidates.length === 1) {
      batches.push([candidates[0]]);
      break;
    }
  }

  return batches;
}

export async function updateAllRepository() {
  // Always attempt to update the official repository first
  try {
    await updateRepository(OFFICIAL_PLUGINS_REPO_URL);
  } catch (error) {
    console.error("Failed to update official plugins repository", error);
  }

  // Determine global fetch-on-start behavior and per-repo overrides
  const fetchOnStart = !!(updaterSettings.fetchPluginsOnStart ?? true);
  const overrides = updaterSettings.repoAutoFetchOverrides ?? {};

  const repos = Object.keys(pluginRepositories);

  await Promise.allSettled(
    repos.map(async (repo) => {
      // Skip official (already handled)
      if (repo === OFFICIAL_PLUGINS_REPO_URL) return;

      // If global fetching is disabled, only process repos explicitly overridden to true
      const repoOverride = overrides[repo];
      if (!fetchOnStart && repoOverride !== true) return;

      try {
        await updateRepository(repo);
      } catch (e) {
        console.error(`Failed to update repository ${repo}`, e);
      }
    }),
  );
}

export async function updatePlugins() {
  await awaitStorage(pluginRepositories, pluginSettings);

  // Register core plugins
  const corePlugins = getCorePlugins();
  for (const id in corePlugins) {
    const { default: instance, preenabled } = corePlugins[id];

    // Core plugins are always installed
    pluginSettings[id] ??= {
      enabled: preenabled ?? true,
    };

    registeredPlugins.set(id, instance.manifest);
    corePluginInstances.set(id, instance);
  }

  // Always ensure official repository metadata is at least attempted to be fetched,
  // because core plugin registration / system behavior may depend on it.
  try {
    await updateRepository(OFFICIAL_PLUGINS_REPO_URL);
  } catch (error) {
    console.error("Failed to update official plugins repository", error);
  }

  // If fetch-on-start is enabled, update all repositories following configured policy.
  // Otherwise, only update repositories which have per-repo overrides explicitly set to true.
  const fetchOnStart = !!(updaterSettings.fetchPluginsOnStart ?? true);
  const overrides = updaterSettings.repoAutoFetchOverrides ?? {};

  if (fetchOnStart) {
    await updateAllRepository();
  } else {
    // Only fetch explicitly opted-in repositories to avoid startup slowdowns.
    const repos = Object.keys(pluginRepositories).filter(
      (r) => r !== OFFICIAL_PLUGINS_REPO_URL && overrides[r] === true,
    );
    await Promise.allSettled(
      repos.map(async (repo) => {
        try {
          await updateRepository(repo);
        } catch (e) {
          console.error(`Failed to update repository ${repo}`, e);
        }
      }),
    );
  }
}

/**
 * Initialize plugins but stagger startup to avoid CPU spikes during app start.
 *
 * This replaces the original "start all enabled plugins in parallel" approach
 * with a configurable staggered startup: plugins are started in small batches and
 * we await a small interval between batches. This reduces short-lived CPU and I/O contention
 * that causes jank on low-end devices.
 *
 * Backwards-compatible: callers can still call initPlugins() with no arguments.
 *
 * Options:
 * - staggerInterval (ms) - wait time between batches (default: 100)
 * - batchSize - how many plugins to start concurrently in a single batch (default: 3)
 */
export async function initPlugins(
  options: { staggerInterval?: number; batchSize?: number } = {},
) {
  const { staggerInterval = 100, batchSize = 3 } = options;

  // Ensure core plugins are registered prior to any plugin startup logic so
  // settings pages and UI that read registered/core plugins show them.
  // registerCorePlugins is synchronous and idempotent, but call it here as a
  // safety-net in case module-load registration didn't run earlier.
  try {
    registerCorePlugins();
  } catch {
    // ignore
  }

  await awaitStorage(pluginRepositories, pluginSettings);

  // Collect enabled plugin ids
  const enabledIds = [...registeredPlugins.keys()].filter((id) =>
    isPluginEnabled(id),
  );

  if (enabledIds.length === 0) return;

  // Helper sleep
  const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

  // Start plugins in batches to avoid starting all at once.
  for (let i = 0; i < enabledIds.length; i += batchSize) {
    const batch = enabledIds.slice(i, i + batchSize);

    // Start the batch in parallel but don't let exceptions bubble to halt everything.
    await Promise.allSettled(
      batch.map(async (id) => {
        try {
          // Only attempt to start if still enabled and not already started
          if (!isPluginEnabled(id) || pluginInstances.has(id)) return;
          await startPlugin(id).catch((e) => {
            // startPlugin may throw; ensure it doesn't crash the whole batch
            console.error(`Failed to start plugin ${id}:`, e);
          });
        } catch (error) {
          console.error(`Unexpected error while starting plugin ${id}:`, error);
        }
      }),
    );

    // If there are more plugins to start, wait before starting the next batch.
    if (i + batchSize < enabledIds.length) {
      await sleep(staggerInterval);
    }
  }
}
