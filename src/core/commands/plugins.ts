import { Strings } from "@core/i18n";
import {
  ApplicationCommand,
  ApplicationCommandOptionType,
} from "@lib/api/commands/types";
import { messageUtil } from "@metro/common";
import { VdPluginManager, VendettaPlugin } from "@core/vendetta/plugins";
import {
  registeredPlugins,
  corePluginInstances,
  pluginSettings,
} from "@lib/addons/plugins";

/**
 * /plugins
 *
 * Aggregates:
 *  - Core plugins (built-in) from corePluginInstances
 *  - External plugins:
 *     - Vendetta-managed plugins (VdPluginManager.plugins)
 *     - Bunny repository plugins (registeredPlugins + pluginSettings)
 *
 * Dedupes by plugin id and shows Enabled / Disabled groups.
 * For external plugins each entry will show its source(s) (vendetta / bunny).
 */
export default () =>
  <ApplicationCommand>{
    name: "plugins",
    description: Strings.COMMAND_PLUGINS_DESC,
    options: [
      {
        name: "ephemeral",
        displayName: "ephemeral",
        type: ApplicationCommandOptionType.BOOLEAN,
        description: Strings.COMMAND_DEBUG_OPT_EPHEMERALLY,
      },
    ],
    execute([ephemeral], ctx) {
      // --- Core plugins ---
      const coreIds = [...corePluginInstances.keys()];

      const coreManifests = coreIds
        .map((id) => registeredPlugins.get(id))
        .filter(Boolean) as any[];

      const coreEnabled = coreManifests
        .filter((m) => Boolean(pluginSettings[m.id]?.enabled))
        .map((m) => m.display?.name ?? m.name ?? m.id)
        .sort((a, b) => a.localeCompare(b));
      const coreDisabled = coreManifests
        .filter((m) => !Boolean(pluginSettings[m.id]?.enabled))
        .map((m) => m.display?.name ?? m.name ?? m.id)
        .sort((a, b) => a.localeCompare(b));

      // --- External plugins aggregation (Vendetta + Bunny) ---
      type ExtEntry = {
        id: string;
        name: string;
        sources: Set<string>;
        enabled: boolean; // overall enabled if any source reports enabled (Vendetta) or pluginSettings for Bunny
      };

      const aggregated = new Map<string, ExtEntry>();

      // Vendetta plugins (if available)
      try {
        const vdRaw =
          (VdPluginManager && (VdPluginManager as any).plugins) || {};
        const vdPlugins = Object.values(vdRaw).filter(
          Boolean,
        ) as VendettaPlugin[];

        for (const p of vdPlugins) {
          const id =
            p.manifest?.id ?? p.id ?? String(p.manifest?.name ?? Math.random());
          const name = p.manifest?.name ?? id;
          const enabled = Boolean(p.enabled);
          const existing = aggregated.get(id);
          if (existing) {
            existing.sources.add("vendetta");
            existing.enabled = existing.enabled || enabled;
          } else {
            aggregated.set(id, {
              id,
              name,
              sources: new Set(["vendetta"]),
              enabled,
            });
          }
        }
      } catch (e) {
        // Defensive: if Vendetta manager isn't ready, skip vendetta aggregation
      }

      // Bunny external plugins: use registeredPlugins + pluginSettings (installed)
      for (const [id, manifest] of registeredPlugins) {
        if (!manifest) continue;
        // External bunny plugins have parentRepository property
        // Only consider those that are actual external plugins (have parentRepository)
        const isExternal = (manifest as any).parentRepository != null;
        if (!isExternal) continue;

        // Skip core plugin ids (safety)
        if (corePluginInstances.has(id)) continue;

        const name = manifest.display?.name ?? manifest.name ?? id;
        const installed = pluginSettings[id] != null;
        const enabled = Boolean(pluginSettings[id]?.enabled);

        // If not installed and not present in aggregated (vendetta), still include as available but mark enabled=false
        const existing = aggregated.get(id);
        if (existing) {
          existing.sources.add("bunny");
          existing.enabled = existing.enabled || enabled;
        } else {
          // Only add bunny entry if installed OR if it's registered and not installed we will handle as available later
          if (installed) {
            aggregated.set(id, {
              id,
              name,
              sources: new Set(["bunny"]),
              enabled,
            });
          }
        }
      }

      // Also collect available-but-not-installed Bunny externals for the "available" list
      const available = [...registeredPlugins.values()]
        .filter(
          (m: any) =>
            Boolean(m) &&
            (m as any).parentRepository &&
            !corePluginInstances.has((m as any).id),
        )
        .map((m: any) => ({
          id: m.id,
          name: m.display?.name ?? m.name ?? m.id,
          installed: pluginSettings[m.id] != null,
        }))
        .filter((x) => !x.installed)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((x) => x.name);

      // Build external lists (deduped)
      const externalList = Array.from(aggregated.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      const externalEnabled = externalList
        .filter((e) => e.enabled)
        .map((e) => e.name);
      const externalDisabled = externalList
        .filter((e) => !e.enabled)
        .map((e) => e.name);

      // Build message
      const lines: string[] = [];

      // Core plugins
      lines.push(`**Plugins (${coreManifests.length}):**`);
      if (coreEnabled.length > 0) {
        lines.push(`Enabled (${coreEnabled.length}):`);
        lines.push("> " + coreEnabled.join(", "));
      }
      if (coreDisabled.length > 0) {
        lines.push(`Disabled (${coreDisabled.length}):`);
        lines.push("> " + coreDisabled.join(", "));
      }
      if (coreManifests.length === 0) {
        lines.push("_No core plugins registered._");
      }

      // External plugins
      lines.push(`**External Plugins (${externalList.length}):**`);
      if (externalEnabled.length > 0) {
        lines.push(`Installed & Enabled (${externalEnabled.length}):`);
        lines.push("> " + externalEnabled.join(", "));
      }
      if (externalDisabled.length > 0) {
        lines.push(`Installed & Disabled (${externalDisabled.length}):`);
        lines.push("> " + externalDisabled.join(", "));
      }
      if (externalList.length === 0) {
        lines.push("_No external plugins found._");
      }

      const content = lines.join("\n");

      if (ephemeral?.value) {
        messageUtil.sendBotMessage(ctx.channel.id, content);
      } else {
        const fixNonce = (BigInt(Date.now() - 1420070400000) << 22n).toString();
        messageUtil.sendMessage(ctx.channel.id, { content }, void 0, {
          nonce: fixNonce,
        });
      }
    },
  };
