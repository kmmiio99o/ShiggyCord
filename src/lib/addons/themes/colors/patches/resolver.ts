import { _colorRef } from "@lib/addons/themes/colors/updater";
import { NativeThemeModule } from "@lib/api/native/modules";
import { before, instead } from "@lib/api/patcher";
import { findByProps } from "@metro";
import { byMutableProp } from "@metro/filters";
import { createLazyModule } from "@metro/lazy";
import chroma from "chroma-js";

const tokenReference = findByProps("SemanticColor");
const isThemeModule = createLazyModule(byMutableProp("isThemeDark"));

const SEMANTIC_FALLBACK_MAP: Record<string, string> = {
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

export default function patchDefinitionAndResolver() {
  const callback = ([theme]: any[]) =>
    theme === _colorRef.key ? [_colorRef.current!.reference] : void 0;

  Object.keys(tokenReference.RawColor).forEach((key) => {
    Object.defineProperty(tokenReference.RawColor, key, {
      configurable: true,
      enumerable: true,
      get: () => {
        const ret = _colorRef.current?.raw[key];
        return ret || _colorRef.origRaw[key];
      },
    });
  });

  const unpatches = [
    before("isThemeDark", isThemeModule, callback),
    before("isThemeLight", isThemeModule, callback),
    before("updateTheme", NativeThemeModule, callback),
    // Prefer the active bn-theme for all resolveSemanticColor calls.
    // Add debug logs to help trace resolution.
    instead(
      "resolveSemanticColor",
      tokenReference.default.meta ?? tokenReference.default.internal,
      (args: any[], orig: any) => {
        // If we don't have an active bunny theme, fall back to original resolver
        if (!_colorRef.current) {
          try {
            console.debug(
              "[themesystem] no active _colorRef, delegating to original resolver",
            );
          } catch {}
          return orig(...args);
        }

        // Capture original theme arg for debugging / fallback usage
        const originalThemeArg = args[0];

        // Force the resolver to use the active bn-theme key so all semantic requests
        // are resolved against our active theme.
        args[0] = _colorRef.key;

        try {
          console.debug(
            `[themesystem] resolveSemanticColor called. originalTheme=${String(originalThemeArg)}, forcedTheme=${_colorRef.key}`,
          );
        } catch {}

        // Use the internal reference (darker/light) to extract color defs
        const themeReference = _colorRef.current!.reference;
        const [name, colorDef] = extractInfo(themeReference, args[1]);

        // Try to resolve semantic from the active theme, with fallback mapping for spec 2
        let semanticDef = _colorRef.current.semantic[name];
        if (
          !semanticDef &&
          _colorRef.current.spec === 2 &&
          name in SEMANTIC_FALLBACK_MAP
        ) {
          semanticDef = _colorRef.current.semantic[SEMANTIC_FALLBACK_MAP[name]];
        }

        if (semanticDef?.value) {
          try {
            const out =
              semanticDef.opacity === 1
                ? semanticDef.value
                : chroma(semanticDef.value).alpha(semanticDef.opacity).hex();
            try {
              console.debug(
                `[themesystem] resolved semantic ${name} => ${out}`,
              );
            } catch {}
            return out;
          } catch (e) {
            // fallthrough to try raw or original
            try {
              console.warn(
                "[themesystem] semantic resolution chroma failed",
                e,
              );
            } catch {}
          }
        }

        // Try raw value from theme
        const rawValue = _colorRef.current.raw[colorDef.raw];
        if (rawValue) {
          try {
            const out =
              colorDef.opacity === 1
                ? rawValue
                : chroma(rawValue).alpha(colorDef.opacity).hex();
            try {
              console.debug(
                `[themesystem] resolved raw ${colorDef.raw} => ${out}`,
              );
            } catch {}
            return out;
          } catch (e) {
            try {
              console.warn("[themesystem] raw resolution chroma failed", e);
            } catch {}
          }
        }

        // If all fails, delegate back to original resolver.
        // Attempt to call original resolver with the original theme argument to preserve expected behavior.
        try {
          try {
            console.debug("[themesystem] falling back to original resolver");
          } catch {}
          return orig(originalThemeArg, args[1]);
        } catch (origErr) {
          // As a last resort, call with the mutated args
          try {
            console.warn(
              "[themesystem] original resolver call with original arg failed, calling orig with mutated args",
              origErr,
            );
          } catch {}
          return orig(...args);
        }
      },
    ),
    () => {
      // Not the actual module but.. yeah.
      Object.defineProperty(tokenReference, "RawColor", {
        configurable: true,
        writable: true,
        value: _colorRef.origRaw,
      });
    },
  ];

  return () => unpatches.forEach((p) => p());
}

function extractInfo(
  themeName: string,
  colorObj: any,
): [name: string, colorDef: any] {
  // @ts-ignore - assigning to extractInfo._sym
  const propName =
    colorObj[(extractInfo._sym ??= Object.getOwnPropertySymbols(colorObj)[0])];
  const colorDef = tokenReference.SemanticColor[propName];

  return [propName, colorDef[themeName]];
}
