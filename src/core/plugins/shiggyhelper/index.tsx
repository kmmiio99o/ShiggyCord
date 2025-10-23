import { defineCorePlugin } from "..";
import { findByProps } from "@metro";
import { logger } from "@lib/utils/logger";
import { settings } from "@lib/api/settings";
import { React } from "@metro/common";
import { showToast } from "@lib/ui/toasts";
import { ScrollView, Text } from "react-native";

// Button imported from components above

declare module "@lib/api/settings" {
  interface Settings {
    shiggyhelper?: {
      verboseLogging?: boolean;
    };
  }
}

let originalConsoleLog: typeof console.log | null = null;
let originalConsoleError: typeof console.error | null = null;
let isPatched = false;
const capturedLogs: string[] = [];

function applyVerbosePatch(enabled: boolean) {
  if (enabled && !isPatched) {
    originalConsoleLog = console.log;
    originalConsoleError = console.error;

    console.log = (...args: any[]) => {
      try {
        const msg = args
          .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
          .join(" ");
        capturedLogs.push(`[LOG ${new Date().toISOString()}] ${msg}`);
      } catch {
        // ignore stringify errors
        capturedLogs.push(`[LOG ${new Date().toISOString()}] (unserializable)`);
      }
      originalConsoleLog?.apply(console, args);
    };

    console.error = (...args: any[]) => {
      try {
        const msg = args
          .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
          .join(" ");
        capturedLogs.push(`[ERROR ${new Date().toISOString()}] ${msg}`);
      } catch {
        capturedLogs.push(
          `[ERROR ${new Date().toISOString()}] (unserializable)`,
        );
      }
      originalConsoleError?.apply(console, args);
    };

    isPatched = true;
    logger.log("ShiggyHelper: Verbose logging enabled");
  } else if (!enabled && isPatched) {
    if (originalConsoleLog) console.log = originalConsoleLog;
    if (originalConsoleError) console.error = originalConsoleError;
    originalConsoleLog = null;
    originalConsoleError = null;
    isPatched = false;
    logger.log("ShiggyHelper: Verbose logging disabled");
  }
}

export default defineCorePlugin({
  manifest: {
    id: "bunny.shiggyhelper",
    version: "1.0.0",
    type: "plugin",
    spec: 3,
    main: "",
    display: {
      name: "ShiggyHelper",
      description:
        "Just a ShiggyHelper, because why not if you can have good logging?",
      authors: [{ name: "ShiggyCord Team" }],
    },
  },

  /**
   * Simple settings UI exposing a toggle and some buttons for helper actions.
   * Uses the project's Forms components via findByProps.
   */
  SettingsComponent() {
    const { useState, useEffect } = React;

    // Ensure hooks are always called at the top-level so hook order is stable.
    // Move state/effect before any early returns or conditional logic.
    const [verbose, setVerbose] = useState<boolean>(
      settings.shiggyhelper?.verboseLogging ?? false,
    );

    useEffect(() => {
      // persist and apply
      settings.shiggyhelper = settings.shiggyhelper || {};
      settings.shiggyhelper.verboseLogging = verbose;
      applyVerbosePatch(Boolean(verbose));
    }, [verbose]);

    // Resolve UI row components; prefer table-style rows and Stack for consistent layout.
    const { TableRow, TableRowGroup, TableSwitchRow, Stack } = findByProps(
      "TableRow",
      "TableRowGroup",
      "TableSwitchRow",
      "Stack",
    );

    if (!TableRow || !TableRowGroup || !TableSwitchRow || !Stack) {
      return React.createElement(
        ScrollView,
        { style: { flex: 1, padding: 12 } },
        React.createElement(
          Text,
          null,
          "ShiggyHelper UI unavailable (missing TableRow / Stack components).",
        ),
      );
    }

    const dumpLogs = () => {
      if (!capturedLogs.length) {
        showToast("No logs captured");
        return;
      }
      const toShow = capturedLogs.slice(-10).join("\n");
      logger.log("ShiggyHelper: Log dump (last 10):\n" + toShow);
      showToast("Dumped last 10 logs to debug log");
    };

    const clearLogs = () => {
      capturedLogs.length = 0;
      showToast("Captured logs cleared");
    };

    const triggerTestLog = () => {
      console.log("ShiggyHelper test log at", new Date().toISOString());
      console.error("ShiggyHelper test error at", new Date().toISOString());
      showToast("Test logs emitted");
    };

    // Actions should be disabled while verbose logging is off
    const actionsDisabled = !verbose;

    return React.createElement(ScrollView, { style: { flex: 1 } }, [
      React.createElement(
        Stack,
        { spacing: 8, style: { padding: 10 } },
        React.createElement(
          TableRowGroup,
          { title: "ShiggyHelper" },
          React.createElement(TableSwitchRow, {
            label: "Verbose Logging",
            subLabel:
              "Capture console.log and console.error into internal buffer",
            value: verbose,
            onValueChange: (v: boolean) => setVerbose(v),
          }),
        ),

        React.createElement(
          TableRowGroup,
          { title: "Actions" },
          React.createElement(TableRow, {
            key: "dump",
            label: "Dump Logs",
            subLabel: "Write recent captured logs to the debug logger",
            trailing: React.createElement(TableRow.TrailingText, {
              text: "Dump",
            }),
            onPress: () => {
              if (actionsDisabled) {
                showToast("Enable verbose logging first");
                return;
              }
              dumpLogs();
            },
            disabled: actionsDisabled,
          }),
          React.createElement(TableRow, {
            key: "clear",
            label: "Clear Logs",
            subLabel: "Clear the internal captured log buffer",
            trailing: React.createElement(TableRow.TrailingText, {
              text: "Clear",
            }),
            onPress: () => {
              if (actionsDisabled) {
                showToast("Enable verbose logging first");
                return;
              }
              clearLogs();
            },
            disabled: actionsDisabled,
          }),
          React.createElement(TableRow, {
            key: "emit",
            label: "Emit Test Logs",
            subLabel: "Emit a test console.log / console.error entry",
            trailing: React.createElement(TableRow.TrailingText, {
              text: "Emit",
            }),
            onPress: () => {
              if (actionsDisabled) {
                showToast("Enable verbose logging first");
                return;
              }
              triggerTestLog();
            },
            disabled: actionsDisabled,
          }),
        ),
      ),
    ]);
  },

  start() {
    // Ensure settings object exists and apply patches according to stored config
    settings.shiggyhelper = settings.shiggyhelper || { verboseLogging: false };
    applyVerbosePatch(Boolean(settings.shiggyhelper.verboseLogging));
    logger.log("ShiggyHelper: started");
  },

  stop() {
    // Restore console if patched
    applyVerbosePatch(false);
    logger.log("ShiggyHelper: stopped");
  },
});
