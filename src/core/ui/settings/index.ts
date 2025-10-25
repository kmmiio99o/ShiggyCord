import shiggycordIcon from "@assets/icons/shiggy.png";
import { Strings } from "@core/i18n";
import { useProxy } from "@core/vendetta/storage";
import { findAssetId } from "@lib/api/assets";
import { isFontSupported, isThemeSupported } from "@lib/api/native/loader";
import { settings } from "@lib/api/settings";
import { registerSection } from "@ui/settings";
import { version } from "bunny-build-info";

export { shiggycordIcon };

export default function initSettings() {
  registerSection({
    name: "ShiggyCord",
    items: [
      {
        key: "SHIGGYCORD",
        title: () => Strings.SHIGGYCORD,
        icon: { uri: shiggycordIcon },
        render: () => import("@core/ui/settings/pages/General"),
        useTrailing: () => `(${version})`,
      },
      {
        key: "SHIGGYCORD_UPDATER",
        title: () => "Updater",
        icon: findAssetId("BellIcon"),
        render: () => import("@core/ui/settings/pages/Updater"),
      },

      {
        key: "CORE_PLUGINS",
        title: () => Strings.PLUGINS,
        icon: findAssetId("ActivitiesIcon"),
        render: () => import("@core/ui/settings/pages/Plugins/CorePlugins"),
      },
      {
        key: "BUNNY_PLUGINS",
        title: () => "External Plugins",
        icon:
          findAssetId("DownloadIcon") ??
          findAssetId("LinkIcon") ??
          findAssetId("ActivitiesIcon"),
        render: () => import("@core/ui/settings/pages/Plugins"),
      },
      {
        key: "BUNNY_THEMES",
        title: () => Strings.THEMES,
        icon: findAssetId("PaintPaletteIcon"),
        render: () => import("@core/ui/settings/pages/Themes"),
        usePredicate: () => isThemeSupported(),
      },
      {
        key: "BUNNY_FONTS",
        title: () => Strings.FONTS,
        icon: findAssetId("ic_add_text"),
        render: () => import("@core/ui/settings/pages/Fonts"),
        usePredicate: () => isFontSupported(),
      },

      {
        key: "BUNNY_DEVELOPER",
        title: () => Strings.DEVELOPER,
        icon: findAssetId("WrenchIcon"),
        render: () => import("@core/ui/settings/pages/Developer"),
        usePredicate: () => useProxy(settings).developerSettings ?? false,
      },
    ],
  });

  // Compat with Bunny Plugins that use configs in settings
  registerSection({
    name: "Bunny",
    items: [],
  });

  // Compat with Revenge Plugins that use configs in settings
  registerSection({
    name: "Revenge",
    items: [],
  });

  // Compat with Vendetta Plugins that use configs in settings
  registerSection({
    name: "Vendetta",
    items: [],
  });
}
