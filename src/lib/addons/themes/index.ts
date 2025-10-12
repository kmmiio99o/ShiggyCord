import {
  awaitStorage,
  createFileBackend,
  createMMKVBackend,
  createStorage,
  wrapSync,
} from "@core/vendetta/storage";
import { writeFile } from "@lib/api/native/fs";
import {
  getStoredTheme,
  getThemeFilePath,
  isPyonLoader,
  isThemeSupported,
} from "@lib/api/native/loader";
import { awaitStorage as newAwaitStorage } from "@lib/api/storage";
import { safeFetch } from "@lib/utils";
import { Platform } from "react-native";

import initColors from "./colors";
import { colorsPref } from "./colors/preferences";
import { updateBunnyColor } from "./colors/updater";
import { applyAndroidAlphaKeys, normalizeToHex } from "./colors/parser";
import {
  VendettaThemeManifest,
  BunnyColorManifest,
  InternalColorDefinition,
  ColorManifest,
} from "./colors/types";

import { findByProps } from "@metro";
import chroma from "chroma-js";

/**
 * Theme v2 - canonical theme manager (full replacement)
 *
 * Goals:
 * - Provide a canonical internal representation for both spec v2 (Vendetta) and spec v3
 * - Always fill missing semantic tokens deterministically (augment) and persist augmented themes
 * - Replace the resolver/updater behavior so components always receive sensible tokens
 * - Keep public API backward-compatible with previous `@lib/addons/themes` exports
 *
 * This file implements the manager, parser/normalizer, augmentation and high-level API
 * as a single, self-contained replacement.
 */

/* Types */
export interface VdThemeInfo {
  id: string;
  selected: boolean;
  // Store the original ColorManifest (spec 3 / vendetta-compatible manifest).
  // This ensures the rest of the codebase that expects a ColorManifest
  // (for example `initColors`) receives the correct shape.
  data: ColorManifest;
}

/* Storage wrapper for installed themes */
export const themes = wrapSync(
  createStorage<Record<string, VdThemeInfo>>(
    // Keep the original storage key so existing installations migrate in-place.
    createMMKVBackend("VENDETTA_THEMES"),
  ),
);

/* Helpers */

/**
 * Normalize and canonicalize an incoming theme manifest (v2 or v3) into InternalColorDefinition.
 * This function also normalizes color strings to hex and applies android-specific keys when necessary.
 */
function canonicalizeManifest(
  manifest: ColorManifest,
): InternalColorDefinition {
  // Helper to normalize color values
  function normColor(v: any) {
    if (typeof v !== "string") return undefined;
    return normalizeToHex(v);
  }

  // For v3-like BunnyColorManifest
  if ((manifest as BunnyColorManifest).main) {
    const b = manifest as BunnyColorManifest;
    const main = b.main;

    // Gather raw map
    const raw: Record<string, string> = {};
    for (const k of Object.keys(main.raw ?? {})) {
      const n = normColor(main.raw?.[k]);
      if (n) raw[k] = n;
    }

    if (Platform.OS === "android") applyAndroidAlphaKeys(raw);

    // Parse semantic
    const semantic: Record<string, { value: string; opacity: number }> = {};
    for (const k of Object.keys(main.semantic ?? {})) {
      const v = main.semantic![k];
      if (typeof v === "string") {
        semantic[k] = { value: normColor(v) ?? v, opacity: 1 };
      } else if (typeof v === "object" && v !== null) {
        if (v.type === "raw")
          semantic[k] = {
            value: normColor(v.value) ?? v.value,
            opacity: v.opacity ?? 1,
          };
        else
          semantic[k] = {
            value: normColor(tokenRaw(v.value)) ?? tokenRaw(v.value),
            opacity: v.opacity ?? 1,
          };
      }
    }

    return {
      spec: 3,
      reference:
        (colorsPref.type ?? b.main.type) === "dark" ? "darker" : "light",
      semantic,
      raw,
      background: main.background,
    } as InternalColorDefinition;
  }

  // For v2 VendettaThemeManifest
  const v = manifest as VendettaThemeManifest;
  const raw: Record<string, string> = {};
  for (const k of Object.keys(v.rawColors ?? {})) {
    const n = normColor(v.rawColors![k]);
    if (n) raw[k] = n;
  }

  if (Platform.OS === "android") applyAndroidAlphaKeys(raw);

  const semantic: Record<string, { value: string; opacity: number }> = {};
  if (v.semanticColors) {
    // Vendetta gives arrays of color choices [dark, light]
    const type = (colorsPref.type ?? "dark") === "dark" ? 0 : 1;
    for (const k of Object.keys(v.semanticColors)) {
      const arr = v.semanticColors[k] as (string | false)[];
      const chosen = arr[type] || arr[0] || undefined;
      if (chosen)
        semantic[k] = {
          value: normalizeToHex(chosen) ?? (chosen as any),
          opacity: 1,
        };
    }
  }

  return {
    spec: 2,
    reference: (colorsPref.type ?? "dark") === "dark" ? "darker" : "light",
    semantic,
    raw,
    background: v.background
      ? {
          url: v.background.url,
          opacity: v.background.alpha ?? 1,
          blur: v.background.blur,
        }
      : undefined,
  } as InternalColorDefinition;
}

/* tokenRaw: helper to get runtime token raw color if available */
function tokenRaw(key: string): string | undefined {
  try {
    const tokenRef: any = findByProps("SemanticColor");
    return tokenRef?.RawColor?.[key];
  } catch {
    return undefined;
  }
}

/**
 * Augment a canonical theme's semantic map by filling any missing semantic entries.
 * Augmentation is deterministic: for each missing semantic token we select a raw fallback
 * and bias it towards dark mode if necessary.
 *
 * This function mutates the provided `data` object and returns it.
 */
function augmentMissingSemantics(data: InternalColorDefinition) {
  data.semantic = data.semantic ?? {};
  const rawMap = { ...(data.raw ?? {}) };

  // merge any native RawColor reference as fallback candidates
  try {
    const tokenRef: any = findByProps("SemanticColor") ?? {};
    const engineRaw = tokenRef?.RawColor ?? {};
    for (const k of Object.keys(engineRaw)) {
      if (!(k in rawMap)) rawMap[k] = engineRaw[k];
    }
  } catch {
    // ignore
  }

  const tokenRefAny: any = findByProps("SemanticColor") ?? {};
  const canonicalSemanticNames: string[] = tokenRefAny?.SemanticColor
    ? Object.keys(tokenRefAny.SemanticColor)
    : Object.keys(data.semantic).slice(0, 50);

  // Utility to choose fallback raw color for a semantic name
  const chooseFallbackRaw = (semanticName: string) => {
    // direct mapping
    if (rawMap[semanticName]) return rawMap[semanticName];

    // try simplified forms
    const simplified = semanticName.replace(/^BG_|^BACKGROUND_/, "");
    if (rawMap[simplified]) return rawMap[simplified];
    const lower = simplified.toLowerCase();
    if (rawMap[lower]) return rawMap[lower];
    if (rawMap[simplified.toUpperCase()])
      return rawMap[simplified.toUpperCase()];

    // pick a background-like key
    const bgKey = Object.keys(rawMap).find((k) =>
      /BG|BACKGROUND|SURFACE/i.test(k),
    );
    if (bgKey) return rawMap[bgKey];

    // fallback to any raw color
    const any = Object.values(rawMap)[0];
    if (any) return any;

    // last resort hardcoded
    return "#0f0f0f";
  };

  // Chromatic adjustment function for safety in dark mode (ensure not too light)
  const adjustForDark = (hex: string) => {
    try {
      const c = chroma(hex);
      const lum = c.luminance();
      if (lum > 0.6) return c.darken(1.4).hex();
      return c.hex();
    } catch {
      return hex;
    }
  };

  for (const sem of canonicalSemanticNames) {
    const existing = data.semantic?.[sem];
    if (existing && existing.value) continue; // don't overwrite existing semantics

    const rawCandidate = chooseFallbackRaw(sem);
    const final = adjustForDark(rawCandidate);
    data.semantic[sem] = { value: final, opacity: 1 };
  }

  return data;
}

/**
 * Persist an internal theme object to storage (overwrites existing stored manifest).
 * This function converts InternalColorDefinition back to a safe, serializable manifest.
 */
async function persistAugmentedTheme(
  id: string,
  data: InternalColorDefinition,
) {
  // We store the canonical internal structure as-is under the same id so callers read consistent data
  themes[id] = { id, selected: themes[id]?.selected ?? false, data };
  await awaitStorage(themes);
}

/**
 * Write the current theme to native loader path (best-effort).
 *
 * NOTE: This function now writes the canonical ColorManifest (spec-3-like)
 * structure so native side receives the manifest format expected by initColors.
 */
export async function writeThemeToNative(theme: ColorManifest | {}) {
  if (typeof theme !== "object") throw new Error("Theme must be an object");
  await createFileBackend(getThemeFilePath() || "theme.json").set(theme);
}

/* Public API functions (compatible names and behavior) */

/**
 * Fetch a theme manifest from a URL and install it (canonicalize + persist).
 */
export async function fetchTheme(url: string, selected = false) {
  let themeJSON: any;
  try {
    themeJSON = await (await safeFetch(url, { cache: "no-store" })).json();
  } catch (err) {
    throw new Error(`Failed to fetch theme at ${url}`);
  }

  // Accept vendetta spec v2 or bunny spec v3; validate loosely
  if (
    !themeJSON ||
    typeof themeJSON !== "object" ||
    (themeJSON.spec !== 2 && themeJSON.spec !== 3)
  ) {
    throw new Error(`Invalid theme at ${url}`);
  }

  // Canonicalize and augment semantics (always run augmentation per your request)
  const canonical = canonicalizeManifest(themeJSON as ColorManifest);
  augmentMissingSemantics(canonical);

  // Persist augmented canonical theme into storage
  themes[url] = { id: url, selected, data: canonical };
  await persistAugmentedTheme(url, canonical);

  // If selected, apply immediately
  if (selected) {
    updateBunnyColor(canonical, { update: true });
    await writeThemeToNative(canonical);
  }
}

/**
 * Install theme (safe guard)
 */
export async function installTheme(url: string) {
  if (typeof url !== "string" || url in themes)
    throw new Error("Theme already installed");
  await fetchTheme(url);
}

/**
 * Select a theme to be active.
 * This will ensure augmentation exists, persist it, update updater and write native theme.
 */
export function selectTheme(theme: VdThemeInfo | null, write = true) {
  if (theme) theme.selected = true;
  Object.keys(themes).forEach(
    (k) => (themes[k].selected = themes[k].id === theme?.id),
  );

  if (theme == null) {
    // Clear active theme
    updateBunnyColor(null, { update: true });
    if (write) return writeThemeToNative({});
    return;
  }

  // Ensure canonical augmentation exists for this theme and persist
  const info = themes[theme.id];
  try {
    const data = info.data;
    augmentMissingSemantics(data); // idempotent
    // persist augmented data
    void persistAugmentedTheme(theme.id, data);
    // Apply to runtime
    updateBunnyColor(data, { update: true });
    if (write) return writeThemeToNative(data);
  } catch (e) {
    // On any error, fallback to applying raw theme data if available
    try {
      const fallback = theme.data;
      updateBunnyColor(fallback, { update: true });
      if (write) return writeThemeToNative(fallback);
    } catch {
      // swallow
    }
  }
}

/**
 * Remove a theme (and clear selection if it was active).
 */
export async function removeTheme(id: string) {
  const theme = themes[id];
  if (theme?.selected) await selectTheme(null);
  delete themes[id];
  await awaitStorage(themes);
  return theme?.selected ?? false;
}

/**
 * Update (re-fetch) all installed themes in-place, re-canonicalizing and re-augmenting.
 */
export async function updateThemes() {
  await awaitStorage(themes);
  const current = getThemeFromLoader();
  await Promise.allSettled(
    Object.keys(themes).map(async (id) => {
      try {
        // re-fetch original location (if it's a URL) to get fresh manifest; otherwise skip
        if (id.startsWith("http")) {
          await fetchTheme(id, current?.id === id);
        } else {
          // re-augment stored data in-place
          const entry = themes[id];
          if (entry && entry.data) {
            augmentMissingSemantics(entry.data);
            await persistAugmentedTheme(id, entry.data);
            if (current?.id === id) {
              updateBunnyColor(entry.data, { update: true });
              await writeThemeToNative(entry.data);
            }
          }
        }
      } catch (e) {
        // log and continue
        // eslint-disable-next-line no-console
        console.error("themes_v2: update failed for", id, e);
      }
    }),
  );
}

/**
 * Returns currently selected theme or null
 */
export function getCurrentTheme() {
  return Object.values(themes).find((t) => t.selected) ?? null;
}

/**
 * Read theme directly from loader (native-side stored theme)
 */
export function getThemeFromLoader(): VdThemeInfo | null {
  const stored = getStoredTheme();
  if (!stored) return null;
  // stored may be a raw manifest - attempt to canonicalize
  try {
    const canonical = canonicalizeManifest(stored as ColorManifest);
    return { id: "loader-theme", selected: false, data: canonical };
  } catch {
    return null;
  }
}

/**
 * Initialize themes at startup: canonicalize existing, init color patches and write native.
 */
export async function initThemes() {
  if (!isThemeSupported()) return;

  // Try to perform the minimal, fast startup steps first so the app isn't blocked.
  try {
    if (isPyonLoader()) {
      try {
        writeFile("../vendetta_theme.json", "null");
      } catch (e) {
        // non-fatal
        console.error("themes_v2: pyon write failed", e);
      }
    }
  } catch (e) {
    console.error("themes_v2: early init error", e);
  }

  // Ensure colors preference backend is available (fast)
  try {
    await newAwaitStorage(colorsPref);
  } catch (e) {
    console.error("themes_v2: failed to await colorsPref storage", e);
  }

  // Immediately apply whatever theme the user last selected (if any).
  // This makes the app show the correct theme on first load without waiting for background migration.
  try {
    const curEntry = getCurrentTheme();
    if (curEntry && curEntry.data) {
      try {
        // Ensure missing semantics are present (idempotent)
        augmentMissingSemantics(curEntry.data as any);
      } catch (e) {
        console.warn("themes_v2: augment on startup failed", e);
      }

      try {
        // Apply to runtime token tables (fast) so UI reflects the theme immediately.
        updateBunnyColor(curEntry.data as any, { update: true });
      } catch (e) {
        console.error("themes_v2: updateBunnyColor on startup failed", e);
      }

      // Try to write native theme but do not block startup on its completion.
      writeThemeToNative(curEntry.data as any).catch((e) => {
        console.error("themes_v2: writeThemeToNative (startup) failed", e);
      });
    } else {
      // If no selected entry, try to initialize colors from loader theme quickly.
      try {
        const loader = getThemeFromLoader();
        // initColors expects a ColorManifest | null - pass loader data if available.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        initColors(loader?.data ?? null);
      } catch (e) {
        console.error("themes_v2: initColors failed on startup", e);
      }
    }
  } catch (e) {
    console.error("themes_v2: apply selected theme failed", e);
  }

  // Perform heavier work (migrations, full updates) in the background so startup isn't blocked.
  (async () => {
    try {
      // Canonicalize and persist all installed themes safely in background.
      const ids = Object.keys(themes);
      for (const id of ids) {
        try {
          const entry = themes[id];
          if (!entry || !entry.data) continue;
          augmentMissingSemantics(entry.data as any);
          await persistAugmentedTheme(id, entry.data as any);
        } catch (e) {
          console.error("themes_v2: background canonicalize failed for", id, e);
        }
      }

      // Re-fetch remote manifests and re-apply if current changed or needs refresh.
      try {
        await updateThemes();
      } catch (e) {
        console.error("themes_v2: background updateThemes failed", e);
      }

      // Ensure the currently selected theme is fully applied after migrations finish.
      try {
        const finalCur = getCurrentTheme();
        if (finalCur && finalCur.data) {
          augmentMissingSemantics(finalCur.data as any);
          updateBunnyColor(finalCur.data as any, { update: true });
          try {
            await writeThemeToNative(finalCur.data as any);
          } catch (e) {
            console.error(
              "themes_v2: writeThemeToNative (background) failed",
              e,
            );
          }
        }
      } catch (e) {
        console.error("themes_v2: final apply after background work failed", e);
      }
    } catch (e) {
      console.error("themes_v2: background migration task failed", e);
    }
  })();
}
