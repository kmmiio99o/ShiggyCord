import { settings } from "@lib/api/settings";
import { findByProps, findByPropsLazy, findByStoreNameLazy } from "@metro";

import { parseColorManifest } from "./parser";
import { ColorManifest, InternalColorDefinition } from "./types";
import chroma from "chroma-js";
import {
  ensureRawKeys as FB_ensureRawKeys,
  ensureSemanticKeys as FB_ensureSemanticKeys,
  mirrorGroups as FB_mirrorGroups,
  extraSemanticNames as FB_extraSemanticNames,
  SEMANTIC_FALLBACK_MAP as FB_SEMANTIC_FALLBACK_MAP,
  AUTOCOMPLETE_FALLBACK_CANDIDATES as FB_AUTOCOMPLETE_FALLBACK_CANDIDATES,
  TEXT_CANDIDATES as FB_TEXT_CANDIDATES,
  REAPPLY_DELAYS as FB_REAPPLY_DELAYS,
  FOOTER_KEY_REGEX,
  softenHardFallback,
} from "./fallbacks";

const tokenRef = findByProps("SemanticColor");
const origRawColor = { ...tokenRef.RawColor };
const AppearanceManager = findByPropsLazy("updateTheme");
const ThemeStore = findByStoreNameLazy("ThemeStore");
const FormDivider = findByPropsLazy("DIVIDER_COLORS");

let _inc = 1;

interface InternalColorRef {
  key: `bn-theme-${string}`;
  current: InternalColorDefinition | null;
  readonly origRaw: Record<string, string>;
  lastSetDiscordTheme: string;
}

/** @internal */
export const _colorRef: InternalColorRef = {
  current: null,
  key: `bn-theme-${_inc}`,
  origRaw: origRawColor,
  lastSetDiscordTheme: "darker",
};

export function updateBunnyColor(
  colorManifest: ColorManifest | null,
  { update = true },
) {
  if (settings.safeMode?.enabled) return;

  const internalDef = colorManifest ? parseColorManifest(colorManifest) : null;
  const ref = Object.assign(_colorRef, {
    current: internalDef,
    key: `bn-theme-${++_inc}`,
    lastSetDiscordTheme: !ThemeStore.theme.startsWith("bn-theme-")
      ? ThemeStore.theme
      : _colorRef.lastSetDiscordTheme,
  });

  if (internalDef != null) {
    // Establish maps and canonical fallback helper at the top of the `internalDef` block so
    // pickRawFallback / fallback logic is available consistently for all subsequent code.
    const rawMap = internalDef.raw ?? {};
    const engineRaw =
      _colorRef.origRaw && typeof _colorRef.origRaw === "object"
        ? _colorRef.origRaw
        : {};

    // Centralized helper used everywhere in this block to pick a sensible raw fallback.
    // This prefers explicit theme raw entries, then engine/raw tables, then a surface-like key,
    // and finally a softened fallback using chroma when possible.
    const pickRawFallback = (semKey: string): string => {
      if (rawMap[semKey]) return rawMap[semKey];
      const alt = semKey.replace(/^BG_|^BACKGROUND_/, "");
      if (rawMap[alt]) return rawMap[alt];
      if (rawMap[alt.toLowerCase()]) return rawMap[alt.toLowerCase()];
      if (engineRaw[semKey]) return engineRaw[semKey];
      const bg = Object.keys(rawMap).find((k) =>
        /BG|BACKGROUND|SURFACE/i.test(k),
      );
      if (bg) return rawMap[bg];
      const fallback =
        Object.values(rawMap)[0] ||
        Object.values(engineRaw)[0] ||
        tokenRef.RawColor["BACKGROUND_PRIMARY"] ||
        tokenRef.RawColor["BACKGROUND_FLOATING"] ||
        "#000000";
      try {
        const c = chroma(String(fallback));
        const lum = c.luminance();
        if (lum > 0.6) return c.darken(1.4).hex();
        return c.hex();
      } catch {
        return String(fallback);
      }
    };

    tokenRef.Theme[ref.key.toUpperCase()] = ref.key;
    FormDivider.DIVIDER_COLORS[ref.key] =
      FormDivider.DIVIDER_COLORS[ref.current!.reference];

    // Write raw colors directly into the runtime RawColor table for the active theme.
    // This ensures lookups that access RawColor receive our theme's values.
    try {
      const rawMap = internalDef.raw ?? {};
      Object.keys(rawMap).forEach((rawKey) => {
        try {
          // Prefer theme-provided raw color; fall back to original raw color if missing.
          const val =
            rawMap[rawKey] ??
            _colorRef.origRaw[rawKey] ??
            tokenRef.RawColor[rawKey];
          if (typeof val === "string") {
            tokenRef.RawColor[rawKey] = val;
          }
        } catch {
          // best-effort: ignore individual key failures
        }
      });

      // Ensure important quick-switcher / autocomplete and emoji picker raw/semantic keys exist in runtime tables.
      // Some components read RawColor directly and some resolve SemanticColor entries — ensure both are filled.
      try {
        const ensureRawKeys = FB_ensureRawKeys;

        // A set of semantic keys we also want to ensure exist for our theme key
        const ensureSemanticKeys = FB_ensureSemanticKeys;

        // Candidate lookup helper tries theme raw, original engine raw, tokenRef.RawColor, then a general fallback.
        const candidateFor = (k: string) => {
          return (
            rawMap[k] ??
            _colorRef.origRaw[k] ??
            tokenRef.RawColor[k] ??
            Object.values(rawMap)[0] ??
            Object.values(_colorRef.origRaw || {})[0] ??
            tokenRef.RawColor["BACKGROUND_PRIMARY"] ??
            "#000000"
          );
        };

        // pickRawFallback is defined at the start of the internalDef block (to ensure a single, canonical implementation).
        // See the internalDef block for the canonical implementation that prefers engine/raw values and uses `chroma`.

        // Write raw keys so modules that read RawColor directly get a sensible value.
        for (const k of ensureRawKeys) {
          try {
            const cand = candidateFor(k);
            if (typeof cand === "string") tokenRef.RawColor[k] = cand;
          } catch {}
        }

        // Also populate SemanticColor runtime table entries for our injected theme key for important aliases.
        for (const sem of ensureSemanticKeys) {
          try {
            // If the semantic entry object doesn't exist at all, create a minimal structure so consumers don't crash.
            if (!tokenRef.SemanticColor[sem]) {
              tokenRef.SemanticColor[sem] = {};
            }

            // If there's already a value for our key, skip.
            if (tokenRef.SemanticColor[sem][ref.key]?.value) continue;

            // Prefer an existing semantic value for the engine reference (darker/light) if available.
            const baseFromEngine =
              tokenRef.SemanticColor[sem]?.[ref.current!.reference];

            // fallback to a candidate raw color
            const cand = candidateFor(sem) ?? pickRawFallback(sem);

            tokenRef.SemanticColor[sem][ref.key] = {
              ...(baseFromEngine ?? {}),
              value: typeof cand === "string" ? cand : String(cand),
              opacity: 1,
            };
          } catch {}
        }

        // Aggressively also mirror some common emoji/quickbar aliases so components reading different names get consistent values.
        try {
          const mirrorGroups: Record<string, string[]> = FB_mirrorGroups;

          for (const groupName of Object.keys(mirrorGroups)) {
            const keys = mirrorGroups[groupName];
            // find the best candidate value (prefer semantic for current reference, then raw)
            let best: string | undefined;
            for (const k of keys) {
              try {
                const sem =
                  tokenRef.SemanticColor[k]?.[ref.current!.reference]?.value;
                if (sem) {
                  best = sem;
                  break;
                }
                if (rawMap[k]) {
                  best = rawMap[k];
                  break;
                }
                if (tokenRef.RawColor[k]) {
                  best = tokenRef.RawColor[k];
                  break;
                }
              } catch {}
            }
            if (!best)
              best =
                Object.values(rawMap)[0] ??
                Object.values(_colorRef.origRaw || {})[0];

            if (!best) continue;

            // Write best into RawColor and SemanticColor for each alias.
            // For footer-specific aliases (emoji picker footer), prefer a lighter surface fallback
            // (BACKGROUND_FLOATING or BACKGROUND_PRIMARY) when available to avoid an overly dark footer.
            for (const k of keys) {
              try {
                // Determine the final value to write for this alias.
                let chosen = best;
                try {
                  if (
                    /FOOTER|footer|PANEL|panel|POPUP/i.test(k) &&
                    (tokenRef.RawColor["BACKGROUND_FLOATING"] ||
                      tokenRef.RawColor["BACKGROUND_PRIMARY"])
                  ) {
                    chosen =
                      tokenRef.RawColor["BACKGROUND_FLOATING"] ||
                      tokenRef.RawColor["BACKGROUND_PRIMARY"] ||
                      best;
                  }
                } catch {}

                // Raw
                tokenRef.RawColor[k] = chosen;
              } catch {}
              try {
                if (!tokenRef.SemanticColor[k]) tokenRef.SemanticColor[k] = {};
                // preserve engine base when available, but override value/opactiy for our key
                tokenRef.SemanticColor[k][ref.key] = {
                  ...(tokenRef.SemanticColor[k]?.[ref.current!.reference] ??
                    {}),
                  value: tokenRef.SemanticColor[k]?.[ref.current!.reference]
                    ?.value
                    ? tokenRef.SemanticColor[k][ref.current!.reference].value
                    : (tokenRef.SemanticColor[k]?.[ref.key]?.value ?? best),
                  // if default engine opacity exists use it, else default to 1
                  opacity:
                    tokenRef.SemanticColor[k]?.[ref.current!.reference]
                      ?.opacity ??
                    tokenRef.SemanticColor[k]?.[ref.key]?.opacity ??
                    1,
                };

                // If semantic value for our injected key was just set to engine fallback or missing,
                // ensure it uses the chosen raw color so resolveSemanticColor reads a consistent value.
                try {
                  tokenRef.SemanticColor[k][ref.key].value =
                    tokenRef.SemanticColor[k][ref.key].value || best;
                } catch {}
              } catch {}
            }
          }
        } catch {}
      } catch {}
    } catch {
      // ignore failures while writing raw colors
    }

    // Populate semantic tokens for our injected theme key so resolveSemanticColor
    // and direct token table reads will get the correct values for each semantic token.
    try {
      const themeSemantic = internalDef.semantic ?? {};
      const rawMap = internalDef.raw ?? {};
      const engineRaw =
        _colorRef.origRaw && typeof _colorRef.origRaw === "object"
          ? _colorRef.origRaw
          : {};

      // Debug: announce start of semantic population for this theme key so we can trace issues
      try {
        // Use console.debug where available; fallback to console.log for environments that don't surface debug
        if (typeof console !== "undefined" && console.debug) {
          console.debug(
            `[themes_v2] populating semantics for key=${String(ref.key)} reference=${String(
              ref.current?.reference,
            )} semanticCount=${Object.keys(themeSemantic).length} rawCount=${
              Object.keys(rawMap).length
            }`,
          );
        } else if (typeof console !== "undefined" && console.log) {
          console.log(
            `[themes_v2] populating semantics for key=${String(ref.key)} reference=${String(
              ref.current?.reference,
            )}`,
          );
        }
      } catch {}

      // A small explicit list of additional semantics that often are missing from themes
      // and frequently cause visible light fallbacks (embeds, command/autocomplete bars, replies).
      const extraSemanticNames = FB_extraSemanticNames;

      // helper to set one semantic key into runtime token table
      const setSemanticKey = (semKey: string, value: string, opacity = 1) => {
        try {
          const base =
            tokenRef.SemanticColor[semKey]?.[ref.current!.reference] ?? {};
          tokenRef.SemanticColor[semKey][ref.key] = {
            ...base,
            value,
            opacity,
          };
        } catch {
          // best-effort per-key
        }
      };

      // populate all runtime semantic keys based on canonical token list
      const allSemanticKeys = Object.keys(tokenRef.SemanticColor || {});
      const canonicalKeys = new Set([
        ...allSemanticKeys,
        ...extraSemanticNames,
      ]);

      // pickRawFallback previously lived here but was moved earlier so it is available
      // before any callers. Keep a minimal comment so line offsets remain clear.
      // (Implementation moved above to avoid 'Cannot find name pickRawFallback' at use sites.)

      // fill semantics
      for (const semKey of Array.from(canonicalKeys)) {
        try {
          // 1) exact semantic from theme (value/opactiy)
          let semEntry = themeSemantic[semKey];
          if (semEntry && semEntry.value) {
            setSemanticKey(semKey, semEntry.value, semEntry.opacity ?? 1);
            continue;
          }

          // Special-case: ensure autocomplete uses the same background as common UI bars
          // (for example the You-bar / bot/avatar bar) and its text uses a readable text token
          // when the theme doesn't provide them. Try multiple likely candidates (semantic then raw)
          // so modules that expect different keys receive a sensible fallback instead of white.
          if (!semEntry || !semEntry.value) {
            if (semKey === "AUTOCOMPLETE_BACKGROUND") {
              try {
                const fallbackCandidates = FB_AUTOCOMPLETE_FALLBACK_CANDIDATES;

                let chosen: string | undefined;
                for (const cand of fallbackCandidates) {
                  // 1) semantic table value for the current reference
                  const semVal =
                    tokenRef.SemanticColor[cand]?.[ref.current!.reference]
                      ?.value;
                  if (semVal) {
                    chosen = semVal;
                    break;
                  }

                  // 2) theme-provided raw map
                  if (rawMap[cand]) {
                    chosen = rawMap[cand];
                    break;
                  }

                  // 3) runtime RawColor table
                  if (tokenRef.RawColor[cand]) {
                    chosen = tokenRef.RawColor[cand];
                    break;
                  }
                }

                if (!chosen) chosen = pickRawFallback(semKey);
                // Ensure we always provide a string to the semantic table; fall back to a safe color.
                setSemanticKey(
                  semKey,
                  String(chosen ?? pickRawFallback(semKey) ?? "#000000"),
                  1,
                );
              } catch {
                // fallback to generic raw candidate if anything goes wrong
                const candidate = pickRawFallback(semKey);
                setSemanticKey(semKey, candidate, 1);
              }
              continue;
            }

            if (semKey === "AUTOCOMPLETE_TEXT") {
              try {
                const textCandidates = FB_TEXT_CANDIDATES;

                let chosenText: string | undefined;
                for (const cand of textCandidates) {
                  const semVal =
                    tokenRef.SemanticColor[cand]?.[ref.current!.reference]
                      ?.value;
                  if (semVal) {
                    chosenText = semVal;
                    break;
                  }
                  if (rawMap[cand]) {
                    chosenText = rawMap[cand];
                    break;
                  }
                  if (tokenRef.RawColor[cand]) {
                    chosenText = tokenRef.RawColor[cand];
                    break;
                  }
                }

                if (!chosenText) chosenText = pickRawFallback("TEXT_NORMAL");
                const textOpacity = themeSemantic["TEXT_NORMAL"]?.opacity ?? 1;
                // Coerce to string and ensure a safe fallback if undefined.
                setSemanticKey(
                  semKey,
                  String(
                    chosenText ?? pickRawFallback("TEXT_NORMAL") ?? "#000000",
                  ),
                  textOpacity,
                );
              } catch {
                const candidate = pickRawFallback(semKey);
                setSemanticKey(semKey, candidate, 1);
              }
              continue;
            }
          }

          // 2) try some reasonable alternate names (strip common prefixes)
          const alternates = [
            semKey,
            semKey.replace(/^BACKGROUND_/, ""),
            semKey.replace(/^BG_/, ""),
            semKey.replace(/^TEXT_/, ""),
            semKey.replace(/_COLOR$/, ""),
          ];
          let foundAlt = false;
          for (const alt of alternates) {
            if (themeSemantic[alt] && themeSemantic[alt].value) {
              const altEntry = themeSemantic[alt];
              setSemanticKey(semKey, altEntry.value, altEntry.opacity ?? 1);
              foundAlt = true;
              break;
            }
          }
          if (foundAlt) continue;

          // 3) try fallback mapping (common name differences)
          const SEMANTIC_FALLBACK_MAP: Record<string, string> =
            FB_SEMANTIC_FALLBACK_MAP;
          if (semKey in SEMANTIC_FALLBACK_MAP) {
            const alt = SEMANTIC_FALLBACK_MAP[semKey];
            const altEntry = themeSemantic[alt];
            if (altEntry && altEntry.value) {
              setSemanticKey(semKey, altEntry.value, altEntry.opacity ?? 1);
              continue;
            }
          }

          // 4) derive fallback from raw colors and bias for dark-friendly appearance
          let candidate = pickRawFallback(semKey);
          try {
            const c = chroma(candidate);
            const lum = c.luminance();
            if (lum > 0.6) candidate = c.darken(1.4).hex();
            else candidate = c.hex();
          } catch {
            // keep candidate as-is
          }
          setSemanticKey(semKey, candidate, 1);
        } catch (e) {
          // per-key should not break everything
          // eslint-disable-next-line no-console
          console.warn("themes_v2: failed to populate semantic", semKey, e);
        }
      }

      // After initial population, schedule a reapply sequence to catch modules that initialize slightly later.
      // Use multiple attempts with backoff and debug logs so we can observe late-initializing modules.
      try {
        const reapplyDelays = FB_REAPPLY_DELAYS;
        let attempt = 0;

        const reapply = () => {
          attempt++;
          try {
            if (typeof console !== "undefined" && console.debug) {
              console.debug(
                `[themes_v2] semantic reapply attempt ${attempt}/${reapplyDelays.length} for key=${String(
                  ref.key,
                )}`,
              );
            }
          } catch {}

          try {
            // Reapply raw values (some modules read RawColor directly after init)
            const rawMap = internalDef.raw ?? {};
            Object.keys(rawMap).forEach((rawKey) => {
              try {
                const val =
                  rawMap[rawKey] ??
                  _colorRef.origRaw[rawKey] ??
                  tokenRef.RawColor[rawKey];
                if (typeof val === "string") tokenRef.RawColor[rawKey] = val;
              } catch {}
            });

            // Reapply semantic table values for our key (idempotent)
            let appliedCount = 0;
            for (const semKey of Array.from(canonicalKeys)) {
              try {
                // If our key already has a value, keep it; otherwise re-run pickRawFallback
                const existing = tokenRef.SemanticColor[semKey]?.[ref.key];
                if (!existing || !existing.value) {
                  let candidate = pickRawFallback(semKey);
                  try {
                    const c = chroma(candidate);
                    const lum = c.luminance();
                    if (lum > 0.6) candidate = c.darken(1.4).hex();
                    else candidate = c.hex();
                  } catch {}
                  tokenRef.SemanticColor[semKey][ref.key] = {
                    ...(tokenRef.SemanticColor[semKey]?.[
                      ref.current!.reference
                    ] ?? {}),
                    value: candidate,
                    opacity: 1,
                  };
                  appliedCount++;
                }
              } catch (e) {
                // per-key should not break everything; log debug if available
                try {
                  if (typeof console !== "undefined" && console.debug) {
                    console.debug(
                      `[themes_v2] failed per-key reapply for ${semKey} on attempt ${attempt}`,
                      e,
                    );
                  }
                } catch {}
              }
            }

            try {
              if (typeof console !== "undefined" && console.debug) {
                console.debug(
                  `[themes_v2] reapply attempt ${attempt} complete for key=${String(
                    ref.key,
                  )} applied=${appliedCount}`,
                );
              }
            } catch {}
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn("themes_v2: reapply semantics failed", e);
          }

          // Schedule next attempt (if any)
          if (attempt < reapplyDelays.length) {
            try {
              setTimeout(reapply, reapplyDelays[attempt]);
            } catch {}
          }
        };

        // Start first reapply after initial delay
        try {
          setTimeout(reapply, reapplyDelays[0]);
        } catch {
          // ignore setTimeout failures on weird runtimes
        }
      } catch {
        // ignore unexpected failures in reapply orchestration
      }
    } catch (e) {
      // overall failure shouldn't break
      // eslint-disable-next-line no-console
      console.error("themes_v2: semantic population failed", e);
    }

    // Also ensure Shadow tokens for our key are populated from the reference so shadow lookups don't fallback unexpectedly
    try {
      Object.keys(tokenRef.Shadow).forEach(
        (k) =>
          (tokenRef.Shadow[k][ref.key] =
            tokenRef.Shadow[k][ref.current!.reference]),
      );
    } catch {
      // ignore
    }
  }

  if (update) {
    AppearanceManager.setShouldSyncAppearanceSettings(false);
    AppearanceManager.updateTheme(
      internalDef != null ? ref.key : ref.lastSetDiscordTheme,
    );

    // Force additional reapply(s) shortly after token population completes so modules that
    // read theme values slightly later will pick up our injected theme key.
    // These are best-effort and wrapped in try/catch to avoid crashing in odd runtimes.
    try {
      setTimeout(() => {
        try {
          AppearanceManager.updateTheme(
            internalDef != null ? ref.key : ref.lastSetDiscordTheme,
          );
        } catch {}
      }, 350);

      // Second reapply with longer delay for very late initializers
      setTimeout(() => {
        try {
          AppearanceManager.updateTheme(
            internalDef != null ? ref.key : ref.lastSetDiscordTheme,
          );
        } catch {}
      }, 1200);
    } catch {}
  }
}
