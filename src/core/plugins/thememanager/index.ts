import { defineCorePlugin } from "..";
import { before } from "@lib/api/patcher";
import { settings } from "@lib/api/settings";
import { createLazyModule } from "@metro/lazy";
import { byMutableProp } from "@metro/filters";
import { writeThemeToNative, getThemeFromLoader } from "@lib/addons/themes";
import { logger } from "@lib/utils/logger";

declare module "@lib/api/settings" {
  interface Settings {
    themesManager?: {
      forceMode?: "auto" | "dark" | "light";
    };
  }
}

/**
 * Theme Manager (core plugin)
 *
 * Responsibilities:
 * - Provide a global, central place to "force" appearance mode for parts of the app
 *   that do not correctly follow the selected theme (dark/light/auto).
 * - Keep the native-side theme file in sync (best-effort) when the plugin starts
 *   and when force mode changes.
 *
 * Settings shape (stored in `settings.themesManager`):
 * {
 *   forceMode?: 'auto' | 'dark' | 'light'
 * }
 *
 * Behaviour:
 * - When `forceMode === 'dark'`, patched `isThemeDark()` will return `true` and
 *   `isThemeLight()` false.
 * - When `forceMode === 'light'`, the inverse occurs.
 * - When `forceMode === 'auto'` (default), native/original behaviour is preserved.
 *
 * Notes:
 * - This plugin is intentionally conservative: patches return `undefined` to
 *   fall through to original behaviour when not forcing.
 * - Writing the native theme file is best-effort; failures are logged but do not
 *   prevent the plugin from functioning.
 */

type ForceMode = "auto" | "dark" | "light";

export default defineCorePlugin({
  manifest: {
    id: "bunny.thememanager",
    version: "1.0.0",
    type: "plugin",
    spec: 3,
    main: "",
    display: {
      name: "Theme Manager",
      description:
        "Fixes components that don't respect dark/light mode and keeps native theme in sync.",
      authors: [{ name: "ShiggyCord Team" }],
    },
  },

  async start() {
    // Ensure settings container exists with a sensible default.
    (settings as any).themesManager ??= {
      forceMode:
        ((settings as any).themesManager?.forceMode as ForceMode) ?? "dark",
    };

    // Resolve the module that exposes theme helpers like isThemeDark/isThemeLight.
    // We use a lazy module so we don't crash if it's not available immediately.
    const themeModule = createLazyModule(byMutableProp("isThemeDark"));

    // Helper to read the configured mode
    const getMode = (): ForceMode => {
      try {
        return (
          ((settings as any).themesManager?.forceMode as ForceMode) ?? "auto"
        );
      } catch {
        return "auto";
      }
    };

    // Patch isThemeDark: when forced to dark, return true; when forced to light return false.
    const unpatchIsDark = before("isThemeDark", themeModule, (args: any[]) => {
      const mode = getMode();
      if (mode === "dark") return true;
      if (mode === "light") return false;
      return;
    });

    // Patch isThemeLight: when forced to light, return true; when forced to dark return false.
    const unpatchIsLight = before(
      "isThemeLight",
      themeModule,
      (args: any[]) => {
        const mode = getMode();
        if (mode === "light") return true;
        if (mode === "dark") return false;
        return;
      },
    );

    // When plugin starts and whenever force mode is changed by other parts of the app,
    // we attempt to write the current theme (or empty object) to the native theme file.
    // This helps native components match the chosen theme.
    const tryWriteNativeTheme = async () => {
      try {
        const cur = getThemeFromLoader();
        // If in `auto` mode, still write the current theme (best-effort).
        await writeThemeToNative(cur?.data ?? {});
      } catch (e) {
        // Non-fatal: log for diagnostics.
        try {
          logger.error("ThemeManager: Failed to write native theme", e);
        } catch {
          // fallback console if logger isn't available in some contexts
          // eslint-disable-next-line no-console
          console.error("ThemeManager: Failed to write native theme", e);
        }
      }
    };

    // Write native theme once at start (best-effort).
    void tryWriteNativeTheme();

    // Track unpatch functions so we can clean them up at stop()
    (this as any)._unpatches = [unpatchIsDark, unpatchIsLight];

    // Also expose a simple watcher that will react when settings.themesManager.forceMode changes.
    // We don't have a dedicated reactive API here, so we poll the setting at a low frequency.
    // This is intentionally lightweight and only runs while plugin is enabled.
    let lastMode = getMode();
    let stopPoll = false;

    // Poll interval in ms. This is a compromise to avoid adding new dependencies.
    const POLL_MS = 500;

    (async () => {
      while (!stopPoll) {
        await new Promise((res) => setTimeout(res, POLL_MS));
        const current = getMode();
        if (current !== lastMode) {
          lastMode = current;
          // Try to write native theme whenever mode changes.
          void tryWriteNativeTheme();
        }
      }
    })();

    // Save stop function so we can terminate loop on stop()
    (this as any)._stopPoll = () => {
      stopPoll = true;
    };
  },

  stop() {
    // Stop polling loop if present
    try {
      (this as any)._stopPoll?.();
    } catch {
      // ignore
    }

    // Unpatch everything that we registered
    try {
      const unpatches: Function[] = (this as any)._unpatches ?? [];
      for (const u of unpatches) {
        try {
          u();
        } catch (e) {
          // best-effort unpatch
          // eslint-disable-next-line no-console
          console.error("ThemeManager: failed to unpatch", e);
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("ThemeManager: cleanup failure", e);
    }
  },
});
