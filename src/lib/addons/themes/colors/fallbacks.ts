/**
 * Fallback lists and maps for the theme updater.
 *
 * These are the centralized, exported constants and small helpers used to
 * decide which semantic/raw keys to ensure exist at runtime so components
 * that read legacy or nonstandard token names receive sensible values.
 *
 * The goal is to keep all "magic" name lists in one place to make maintenance
 * easier and to support the idea of pulling a single file into the updater.
 *
 * This file intentionally contains only data and tiny pure helpers (regexes).
 * Any logic that requires runtime tables (e.g. reading tokenRef.RawColor)
 * should remain in the updater and consume these lists.
 */

/* eslint-disable @typescript-eslint/ban-types */

export const ensureRawKeys: string[] = [
  // Autocomplete / quickswitcher legacy/raw keys
  "AUTOCOMPLETE_BACKGROUND",
  "AUTOCOMPLETE_BG",
  "AUTOCOMPLETE_TEXT",
  "DEPRECATED_QUICKSWITCHER_INPUT_BACKGROUND",
  "QUICKSWITCHER_INPUT_BACKGROUND",
  "deprecated-quickswitcher-input-background",
  "autocomplete-bg",
  // Emoji picker / popover keys (various clients use different names)
  "EMOJI_PICKER_BACKGROUND",
  "EMOJI_POPOVER_BACKGROUND",
  "EMOJI_POPUP_BACKGROUND",
  "EMOJI_PANEL_BG",
  "EMOJI_PICKER_PANEL_BG",
  "EMOJI_PICKER_FOOTER_BG",
  "EMOJI_PICKER_FOOTER_BACKGROUND",
];

export const ensureSemanticKeys: string[] = [
  "AUTOCOMPLETE_BACKGROUND",
  "AUTOCOMPLETE_TEXT",
  "EMOJI_PICKER_BACKGROUND",
  "EMOJI_POPOVER_BACKGROUND",
  "EMOJI_PANEL_BG",
  "EMOJI_PICKER_PANEL_BG",
];

/**
 * Mirror groups - these group related aliases together so the updater can
 * pick the best available candidate among them and mirror the value across
 * all aliases (both raw and semantic tables).
 */
export const mirrorGroups: Record<string, string[]> = {
  // Autocomplete aliases (cover many legacy and client variants)
  AUTOCOMPLETE: [
    "AUTOCOMPLETE_BACKGROUND",
    "AUTOCOMPLETE_BG",
    "autocomplete-bg",
    "AUTOCOMPLETE-BG",
    "QUICKSWITCHER_INPUT_BACKGROUND",
    "DEPRECATED_QUICKSWITCHER_INPUT_BACKGROUND",
    "deprecated-quickswitcher-input-background",
    "QUICKSWITCHER_INPUT_BG",
    "DEPRECATED_QUICKSWITCHER_INPUT_BG",
    "deprecated-quickswitcher-input-bg",
    "DEPRECATED_QUICKSWITCHER_INPUT_BACKGROUND",
  ],
  // Emoji / expression picker aliases, include footer variants explicitly
  EMOJI_PICKER: [
    "EMOJI_PICKER_BACKGROUND",
    "EMOJI_POPOVER_BACKGROUND",
    "EMOJI_POPUP_BACKGROUND",
    "EMOJI_PANEL_BG",
    "EMOJI_PICKER_PANEL_BG",
    "EMOJI_PICKER_FOOTER_BG",
    "EMOJI_PICKER_FOOTER_BACKGROUND",
    "EXPRESSION_PICKER_BG",
    "EXPRESSION_PICKER_BACKGROUND",
    "expression-picker-bg",
  ],
  // Emoji text / label color aliases
  EMOJI_TEXT: [
    "EMOJI_TEXT",
    "EMOJI_PICKER_TEXT",
    "EMOJI_POPOVER_TEXT",
    "EMOJI_TOOLTIP_TEXT",
  ],
};

/**
 * A small explicit list of additional semantics that often are missing from themes
 * and frequently cause visible light fallbacks (embeds, command/autocomplete bars, replies).
 */
export const extraSemanticNames: string[] = [
  "TEXT_EMBED_TITLE",
  "TEXT_EMBED_AUTHOR",
  "TEXT_EMBED_CONTENT",
  "TEXT_EMBED_FOOTER",
  "TEXT_REPLY",
  "TEXT_REPLY_BYLINE",
  "INPUT_PRIMARY",
  "INPUT_SECONDARY",
  "AUTOCOMPLETE_BACKGROUND",
  "AUTOCOMPLETE_TEXT",
];

/**
 * Common semantic fallback mapping for names that have different canonical forms
 * across various theme manifests or engine versions.
 *
 * When a semantic key is missing, the updater will try the mapped key as a fallback.
 */
export const SEMANTIC_FALLBACK_MAP: Record<string, string> = {
  BG_BACKDROP: "BACKGROUND_FLOATING",
  BG_BASE_PRIMARY: "BACKGROUND_PRIMARY",
  BG_BASE_SECONDARY: "BACKGROUND_SECONDARY",
  BG_BASE_TERTIARY: "BACKGROUND_SECONDARY_ALT",
  BG_MOD_FAINT: "BACKGROUND_MODIFIER_ACCENT",
  BG_MOD_STRONG: "BACKGROUND_MODIFIER_ACCENT",
  BG_MOD_SUBTLE: "BACKGROUND_MODIFIER_ACCENT",
  BG_SURFACE_OVERLAY: "BACKGROUND_FLOATING",
  BG_SURFACE_OVERLAY_TMP: "BACKGROUND_FLOATING",
  BG_SURFACE_RAISED: "BACKGROUND_MOBILE_PRIMARY",
};

/**
 * Candidate lists used by the updater's specialized cases (autocomplete/text).
 * These lists are intentionally conservative and ordered by preference.
 */
export const AUTOCOMPLETE_FALLBACK_CANDIDATES: string[] = [
  // avatar/bot bar variants (mirrors "bot avatar bar" style)
  "AVATAR_BAR_BG",
  "BOT_AVATAR_BG",
  "AVATAR_BAR_BACKGROUND",
  // you-bar / personal bar variants
  "YOU_BAR_BG",
  "YOU_BAR_BACKGROUND",
  "YOU_BAR",
  // quickswitcher / autocomplete legacy variants
  "QUICKSWITCHER_INPUT_BACKGROUND",
  "DEPRECATED_QUICKSWITCHER_INPUT_BACKGROUND",
  "AUTOCOMPLETE_BG",
  // chat/input fallbacks
  "CHAT_INPUT_BACKGROUND",
  "CHANNELTEXTAREA_BACKGROUND",
  // general surface/background fallbacks
  "BACKGROUND_FLOATING",
  "BACKGROUND_PRIMARY",
  "CARD_PRIMARY_BG",
];

export const TEXT_CANDIDATES: string[] = [
  "TEXT_NORMAL",
  "TEXT_PRIMARY",
  "TEXT_SECONDARY",
  "TEXT_PRIMARY_ON_BACKGROUND",
  "TEXT_MUTED",
];

/**
 * Delays (in ms) that the updater will use when scheduling reapply attempts.
 * Exported so tests / orchestration can inspect or reuse these values.
 */
export const REAPPLY_DELAYS: number[] = [300, 700, 1500];

/**
 * Regex used to detect footer / popup / panel-like aliases where a lighter surface
 * fallback (e.g. BACKGROUND_FLOATING) is preferred instead of a pure raw candidate.
 */
export const FOOTER_KEY_REGEX = /FOOTER|footer|PANEL|panel|POPUP/i;

/**
 * Utility: choose a "softened" fallback color when no explicit mapping exists.
 * NOTE: This helper intentionally does not access runtime token tables - it only
 * performs very small, deterministic transformations. The updater should call
 * this with an already-determined candidate color string.
 *
 * Keep this simple to avoid importing heavy color libs here; the updater owns any
 * chroma/contrast logic that depends on runtime state.
 */
export function softenHardFallback(fallbackHex: string, preferHex = true): string {
  // If caller provides something falsy, return a safe default.
  if (!fallbackHex || typeof fallbackHex !== "string") return "#000000";

  // Basic normalization: ensure starts with '#', otherwise return as-is.
  if (!fallbackHex.startsWith("#")) return fallbackHex;

  // Very small, naive "soften" algorithm: when hex appears very dark (#000...),
  // nudge it to a slightly lighter shade. This is intentionally minimal to avoid
  // reintroducing heavy dependencies here.
  const normalized = fallbackHex.slice(1);
  if (normalized.length !== 3 && normalized.length !== 6) return fallbackHex;

  // Expand short hex (#abc -> #aabbcc)
  const expanded =
    normalized.length === 3
      ? normalized.split("").map((c) => c + c).join("")
      : normalized;

  try {
    const r = parseInt(expanded.slice(0, 2), 16);
    const g = parseInt(expanded.slice(2, 4), 16);
    const b = parseInt(expanded.slice(4, 6), 16);

    // If extremely dark, lighten by a fixed delta; otherwise return original.
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    if (lum < 0.05) {
      const delta = 30; // lighten by ~12%
      const nr = Math.min(255, r + delta);
      const ng = Math.min(255, g + delta);
      const nb = Math.min(255, b + delta);
      const hex = `#${nr.toString(16).padStart(2, "0")}${ng
        .toString(16)
        .padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
      return preferHex ? hex : hex;
    }

    return `#${expanded}`;
  } catch {
    return fallbackHex;
  }
}
