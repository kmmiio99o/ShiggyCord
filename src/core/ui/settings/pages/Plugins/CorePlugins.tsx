import { React } from "@metro/common";
import AddonPage from "@core/ui/components/AddonPage";
import PluginCard from "@core/ui/settings/pages/Plugins/components/PluginCard";
import { corePluginInstances, registeredPlugins } from "@lib/addons/plugins";
import { UnifiedPluginModel } from "@core/ui/settings/pages/Plugins/models";
import unifyBunnyPlugin from "@core/ui/settings/pages/Plugins/models/bunny";
import { Strings } from "@core/i18n";

/**
 * Core plugins settings page
 *
 * This page shows only the built-in core plugins. Core plugins are always
 * installed (can't be uninstalled) and are registered in `corePluginInstances`.
 *
 * We reuse the existing `AddonPage` + `PluginCard` components and feed them
 * the normalized `UnifiedPluginModel` objects produced by `unifyBunnyPlugin`.
 */

export default function CorePlugins() {
  return (
    <AddonPage<UnifiedPluginModel>
      CardComponent={PluginCard}
      title={Strings.PLUGINS}
      searchKeywords={[
        "name",
        "description",
        (p) =>
          p.authors
            ?.map((a: any) => (typeof a === "string" ? a : a.name))
            .join() || "",
      ]}
      // Provide simple sort options so the Search input renders round and a sort menu appears
      sortOptions={{
        "Name (A-Z)": (a, b) => a.name.localeCompare(b.name),
        "Name (Z-A)": (a, b) => b.name.localeCompare(a.name),
      }}
      // Only core plugins: map corePluginInstances -> registeredPlugins -> unify
      items={[...corePluginInstances.keys()]
        .map((id) => registeredPlugins.get(id))
        .filter((m): m is any => m !== undefined)
        .map(unifyBunnyPlugin)}
      ListHeaderComponent={() => null}
    />
  );
}
