import patchErrorBoundary from "@core/debug/patches/patchErrorBoundary";
import initFixes from "@core/fixes";
import { initFetchI18nStrings } from "@core/i18n";
import initSettings from "@core/ui/settings";
import { initVendettaObject } from "@core/vendetta/api";
import { updateFonts } from "@lib/addons/fonts";
import { initThemes } from "@lib/addons/themes";
import { patchCommands } from "@lib/api/commands";
import { patchLogHook } from "@lib/api/debug";
import { injectFluxInterceptor } from "@lib/api/flux";
import { patchJsx } from "@lib/api/react/jsx";
import { logger } from "@lib/utils/logger";
import { patchSettings } from "@ui/settings";
import { InteractionManager } from "react-native";
import { getDebugInfo, initDebugger } from "@lib/api/debug";
import * as lib from "./lib";
import { timings } from "@lib/utils/timings";

/**
 * Start sequence split into critical (UI) and deferred (network/plugin) work.
 * The goal is to get the UI ready quickly and run heavy tasks after interactions.
 */
export default async () => {
  // Wrap critical initializers as named functions so we can instrument each.
  const criticalInitFns: Array<[string, () => Promise<any>]> = [
    ["initThemes", () => initThemes()],
    ["injectFluxInterceptor", () => injectFluxInterceptor()],
    ["patchSettings", () => patchSettings()],
    ["patchLogHook", () => patchLogHook()],
    ["patchCommands", () => patchCommands()],
    ["patchJsx", () => patchJsx()],
    ["patchErrorBoundary", () => patchErrorBoundary()],
    ["initVendettaObject", () => initVendettaObject()],
    ["initFetchI18nStrings", () => initFetchI18nStrings()],
    ["initSettings", () => initSettings()],
    ["initFixes", () => initFixes()],
    ["initDebugger", () => initDebugger()],
  ];

  // Run critical inits with timing instrumentation and collect unpatchers/cleanup handlers.
  await Promise.all(
    criticalInitFns.map(([name, fn]) =>
      timings.measureAsync(`critical:${name}`, async () => fn()),
    ),
  )
    .then((u) => u.forEach((f) => f && lib.unload.push(f)))
    .catch((e) => {
      // Log but don't abort — critical inits failing should be visible in logs.
      console.warn("Critical initialization error:", e);
    });

  // Expose the library object early so UI and other code can access window.bunny.
  window.bunny = lib;

  logger.log(
    "ShiggyCord: UI-critical initialization complete — deferring plugin & network work",
  );

  // Deferred work: run after interactions to avoid blocking initial paint and navigation.
  const runDeferred = async () => {
    const { VdPluginManager } = await import("@core/vendetta/plugins");
    const { initPlugins, updatePlugins } = await import("@lib/addons/plugins");

    await Promise.all([
      VdPluginManager.initPlugins()
        .then((u) => u && lib.unload.push(u))
        .catch((e) => logger.log("Vendetta init failed:", e)),
      initPlugins()
        .catch((e) => logger.log("initPlugins failed:", e)),
    ]);

    updatePlugins()
      .catch((e) => logger.log("updatePlugins failed:", e));

    // Update fonts in background
    updateFonts().catch((e) => logger.log("updateFonts failed:", e));
  };

  // Preferred: wait until interactions finish (animations / navigation).
  try {
    InteractionManager.runAfterInteractions(() => {
      // small delay to ensure native lifecycle settled
      setTimeout(runDeferred, 50);
    });
  } catch (e) {
    // Fallback if InteractionManager isn't available for any reason.
    setTimeout(runDeferred, 200);
  }

  // Final ready log for basic UI availability.
  logger.log("ShiggyCord is ready.");
};
