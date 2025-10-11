import { defineCorePlugin } from "..";
import { showToast } from "@ui/toasts";
import { findAssetId } from "@lib/api/assets";
import { logger } from "@lib/utils/logger";
import { clipboard } from "@metro/common";
import { createFileBackend } from "@core/vendetta/storage";
import {
  semanticColors,
  rawColors,
  resolveSemanticColor,
  isSemanticColor,
} from "@ui/color";

function safeStringify(obj: any, maxDepth = 5, maxLen = 200): string {
  const seen = new WeakSet();
  function _stringify(value: any, depth: number): string {
    if (value === null) return "null";
    if (typeof value === "undefined") return "undefined";
    if (typeof value === "string") {
      if (value.length > maxLen) return value.slice(0, maxLen) + "...";
      return value;
    }
    if (typeof value === "number" || typeof value === "boolean")
      return String(value);
    if (typeof value === "function") return "[Function]";
    if (depth <= 0) return "[MaxDepth]";
    if (typeof value === "object") {
      if (seen.has(value)) return "[Circular]";
      seen.add(value);
      try {
        if (Array.isArray(value)) {
          return (
            "[" + value.map((v) => _stringify(v, depth - 1)).join(", ") + "]"
          );
        }
        const keys = Object.keys(value).slice(0, 100);
        return (
          "{" +
          keys
            .map((k) => `${k}: ${_stringify(value[k], depth - 1)}`)
            .join(", ") +
          "}"
        );
      } catch (e) {
        return "[UnserializableObject]";
      }
    }
    try {
      return String(value);
    } catch (e) {
      return "[Unserializable]";
    }
  }
  return _stringify(obj, maxDepth);
}

function formatRawColors(rc: Record<string, string>): string {
  return Object.entries(rc)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => `${k}: ${typeof v === "string" ? v : safeStringify(v)}`)
    .join("\n");
}

function formatSemanticColors(sc: Record<string, any>): string {
  return Object.entries(sc)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => {
      const def = typeof v === "object" ? safeStringify(v) : String(v);
      let resolved = "N/A";
      try {
        if (typeof resolveSemanticColor === "function") {
          // Attempt to resolve using the semantic token name. This may return a color string.
          // Some clients expect the token symbol itself; in those cases, resolveSemanticColor may still handle it.
          resolved = resolveSemanticColor(k) ?? "N/A";
        }
      } catch (e) {
        // ignore resolution errors
      }
      // Mark if token is considered a semantic color by helper (if available)
      let semanticFlag = "";
      try {
        if (typeof isSemanticColor === "function" && isSemanticColor(k))
          semanticFlag = " (semantic)";
      } catch (e) {
        // ignore
      }
      return `${k}: ${def} => ${resolved}${semanticFlag}`;
    })
    .join("\n");
}

export default defineCorePlugin({
  manifest: {
    id: "bunny.themelister",
    version: "1.0.0",
    type: "plugin",
    spec: 3,
    main: "",
    display: {
      name: "Theme Mining",
      description:
        "Mine all semantic and raw colors directly from Discord's app.",
      authors: [{ name: "kmmiio99o.dev" }],
    },
  },

  async start() {
    // Wait for Discord's color data to become available by polling for a short time.
    // This helps when the module isn't ready immediately on plugin start.
    const timeoutMs = 10000;
    const intervalMs = 200;
    const maxAttempts = Math.ceil(timeoutMs / intervalMs);
    let attempts = 0;

    let raw = rawColors || {};
    let semantic = semanticColors || {};

    while (
      (Object.keys(raw).length === 0 || Object.keys(semantic).length === 0) &&
      attempts < maxAttempts
    ) {
      await new Promise((res) => setTimeout(res, intervalMs));
      raw = rawColors || {};
      semantic = semanticColors || {};
      attempts++;
    }

    if (Object.keys(raw).length === 0 && Object.keys(semantic).length === 0) {
      // If both are empty after waiting, notify and bail out
      showToast(
        "Failed to retrieve Discord color definitions (timed out).",
        findAssetId("CircleXIcon-primary"),
      );
      logger.log(
        `ThemeLister: Failed to retrieve color data after ${attempts} attempts (${timeoutMs}ms).`,
      );
      return;
    }

    const rawText = "Raw Colors:\n" + formatRawColors(raw);
    const semanticText = "Semantic Colors:\n" + formatSemanticColors(semantic);

    const output = [rawText, "", semanticText].join("\n");

    // Copy info to clipboard and notify user
    clipboard.setString(output);
    showToast(
      "Discord colors & semantics copied to clipboard!",
      findAssetId("PaintPaletteIcon"),
    );

    // Log the exported data
    logger.log(
      "ThemeLister: Exported Discord colors and semantics:\n" + output,
    );

    // Build a serializable dump to write to a file in Documents/ShiggyCord/semantics.json
    const dump: any = {
      generatedAt: new Date().toISOString(),
      rawCount: Object.keys(raw).length,
      semanticCount: Object.keys(semantic).length,
      raw: {},
      semantic: {},
      resolved: {},
      semanticTokenChecks: {},
    };

    // Serialize raw and semantic maps safely
    for (const k of Object.keys(raw).sort()) {
      const v = raw[k];
      dump.raw[k] = typeof v === "string" ? v : safeStringify(v);
    }

    for (const k of Object.keys(semantic).sort()) {
      const v = semantic[k];
      dump.semantic[k] = typeof v === "string" ? v : safeStringify(v);

      try {
        dump.resolved[k] =
          typeof resolveSemanticColor === "function"
            ? resolveSemanticColor(k)
            : null;
      } catch (e) {
        dump.resolved[k] = null;
      }

      try {
        dump.semanticTokenChecks[k] =
          typeof isSemanticColor === "function" ? !!isSemanticColor(k) : null;
      } catch (e) {
        dump.semanticTokenChecks[k] = null;
      }
    }

    try {
      const filename = "ShiggyCord/semantics.json";
      await createFileBackend(filename).set(dump);

      // Try to resolve an absolute path to show the user
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { NativeFileModule } = require("@lib/api/native/modules");
        const documents = NativeFileModule.getConstants().DocumentsDirPath;
        const abs = `${documents}/${filename}`;
        showToast(
          `Semantic dump written to ${abs}`,
          findAssetId("PaintPaletteIcon"),
        );
        logger.log("ThemeLister: Wrote semantics.json to", abs);
      } catch (e) {
        // Fallback when NativeFileModule is not available at build-time
        showToast(
          "Semantic dump written to Documents/ShiggyCord/semantics.json",
          findAssetId("PaintPaletteIcon"),
        );
        logger.log(
          "ThemeLister: Wrote semantics.json to Documents/ShiggyCord/semantics.json (absolute path unavailable)",
        );
      }
    } catch (e) {
      showToast(
        "Failed to write semantics.json",
        findAssetId("CircleXIcon-primary"),
      );
      logger.log("ThemeLister: Failed to write semantics.json", e);
    }
  },

  stop() {
    logger.log("ThemeLister: Disabled");
  },
});
