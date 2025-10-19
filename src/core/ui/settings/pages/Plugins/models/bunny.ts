import {
  disablePlugin,
  enablePlugin,
  getPluginSettingsComponent,
  isPluginEnabled,
  pluginSettings,
} from "@lib/addons/plugins";
import { BunnyPluginManifest } from "@lib/addons/plugins/types";
import { useObservable } from "@lib/api/storage";

import { UnifiedPluginModel } from ".";

export default function unifyBunnyPlugin(
  manifest: BunnyPluginManifest,
): UnifiedPluginModel {
  return {
    id: manifest.id,
    name: manifest.display.name,
    description: manifest.display.description,
    authors: manifest.display.authors,

    getBadges() {
      return [];
    },
    isEnabled: () => isPluginEnabled(manifest.id),
    isInstalled: () => manifest.id in pluginSettings,
    usePluginState() {
      useObservable([pluginSettings]);
    },
    toggle(start: boolean) {
      try {
        start ? enablePlugin(manifest.id, true) : disablePlugin(manifest.id);
      } catch (e) {
        console.error(e);
        // showToast("Failed to toggle plugin " + e, findAssetId("Small"));
      }
    },
    resolveSheetComponent() {
      return import("../sheets/PluginInfoActionSheet");
    },
    getPluginSettingsComponent() {
      return getPluginSettingsComponent(manifest.id);
    },
  };
}
