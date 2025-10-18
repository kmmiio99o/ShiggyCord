import patchErrorBoundary from "@core/debug/patches/patchErrorBoundary";
import initFixes from "@core/fixes";
import { initFetchI18nStrings } from "@core/i18n";
import initSettings from "@core/ui/settings";
import { initVendettaObject } from "@core/vendetta/api";
import { VdPluginManager } from "@core/vendetta/plugins";
import { updateFonts } from "@lib/addons/fonts";
import { initPlugins, updatePlugins } from "@lib/addons/plugins";
import { initThemes } from "@lib/addons/themes";
import { patchCommands } from "@lib/api/commands";
import { patchLogHook } from "@lib/api/debug";
import { injectFluxInterceptor } from "@lib/api/flux";
import { patchJsx } from "@lib/api/react/jsx";
import { logger } from "@lib/utils/logger";
import { patchSettings } from "@ui/settings";
import { InteractionManager } from "react-native";

// Debug toggle helper (temporary runtime fallback). The helper is dynamically
// imported when needed (to avoid bundling it permanently) and removed after use.

import * as lib from "./lib";

/**
 * Start sequence split into critical (UI) and deferred (network/plugin) work.
 * The goal is to get the UI ready quickly and run heavy tasks after interactions.
 */
export default async () => {
  // Critical initializers that are required for the app's UI and basic features.
  const criticalInits = [
    initThemes(),
    injectFluxInterceptor(),
    patchSettings(),
    patchLogHook(),
    patchCommands(),
    patchJsx(),
    patchErrorBoundary(),
    initVendettaObject(),
    initFetchI18nStrings(),
    initSettings(),
    initFixes(),
    // Do NOT run updatePlugins here — that is deferred.
  ];

  // Run critical inits and collect unpatchers/cleanup handlers.
  await Promise.all(criticalInits)
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
  const runDeferred = () => {
    // Initialize Vendetta plugins (may start many plugins) — do not block UI.
    VdPluginManager.initPlugins()
      .then((u) => lib.unload.push(u))
      .catch((e) => logger.log("Vendetta init failed:", e));

    // Ensure core plugins and repository metadata are registered/updated BEFORE
    // attempting to start ShiggyCord (Bunny) plugins. This makes corePluginInstances
    // available to `initPlugins()` so built-in core plugins are handled correctly.
    updatePlugins()
      .catch((e) => logger.log("updatePlugins failed (deferred):", e))
      .finally(async () => {
        // Start ShiggyCord (Bunny) plugins (reads storage and may compile/instantiate plugins).
        initPlugins();

        // Attempt a lightweight recovery toggle if some core plugins failed to start.
        try {
          // Dynamically import the helper (if present) but suppress verbose errors.
          const mod = await import("@core/debug/toggleCorePlugins").catch(
            () => null,
          );
          if (mod?.default) {
            // Run helper with minimal noise; ignore failures.
            mod.default({ offDuration: 1500 }).catch(() => {});
          }

          // Try to remove the helper source file (best-effort, ignore failures).
          await import("@lib/api/native/fs")
            .then((fs) => fs.removeFile("src/core/debug/toggleCorePlugins.ts"))
            .catch(() => {});
        } catch {
          // suppressed
        }

        // Update fonts in background
        updateFonts().catch((e) => logger.log("updateFonts failed:", e));
      });

    // Note: we intentionally moved the call to `updatePlugins()` above so core
    // plugins are registered prior to calling `initPlugins()`.
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

  // Additionally schedule a periodic attempt to update plugins ~3 minutes after start.
  // This ensures plugin repositories get refreshed even if deferred tasks were delayed.
  setTimeout(
    () => {
      updatePlugins().catch((e) =>
        logger.log("Scheduled updatePlugins (3min) failed:", e),
      );
    },
    3 * 60 * 1000,
  );

  // Final ready log for basic UI availability.
  logger.log("ShiggyCord is ready (UI available).");
};
