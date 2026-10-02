import { _colorRef } from "@lib/addons/themes/colors/updater";
import { NativeThemeModule } from "@lib/api/native/modules";
import { before, instead } from "@lib/api/patcher";
import { findByProps } from "@metro";
import chroma from "chroma-js";

const tokenReference = findByProps("SemanticColor");
const themeTypes = findByProps("ThemeTypes")?.ThemeTypes;

const origRawColor = { ...tokenReference.RawColor };
const origDarker = themeTypes.DARKER as string;
const origLight = themeTypes.LIGHT as string;

const SEMANTIC_FALLBACK_MAP: Record<string, string> = {
    "BG_BACKDROP": "BACKGROUND_FLOATING",
    "BG_BASE_PRIMARY": "BACKGROUND_PRIMARY",
    "BG_BASE_SECONDARY": "BACKGROUND_SECONDARY",
    "BG_BASE_TERTIARY": "BACKGROUND_SECONDARY_ALT",
    "BG_MOD_FAINT": "BACKGROUND_MODIFIER_ACCENT",
    "BG_MOD_STRONG": "BACKGROUND_MODIFIER_ACCENT",
    "BG_MOD_SUBTLE": "BACKGROUND_MODIFIER_ACCENT",
    "BG_SURFACE_OVERLAY": "BACKGROUND_FLOATING",
    "BG_SURFACE_OVERLAY_TMP": "BACKGROUND_FLOATING",
    "BG_SURFACE_RAISED": "BACKGROUND_MOBILE_PRIMARY"
};

/**
 * Whether Discord is resolving colors for an appearance the current theme should color.
 *
 * Normally Discord's appearance is switched to the theme's key, but on newer Discord versions
 * (e.g. 349) it can stay on a built-in appearance such as "darker". Then only raw colors were
 * themed and semantic colors (backgrounds, text) kept Discord's defaults, so also accept any
 * built-in appearance of the theme's type: "light" for light themes, any other for dark ones.
 */
function isThemedAppearance(theme: unknown): boolean {
    if (!_colorRef.current) return false;
    if (typeof theme !== "string") return false;
    // The current key, or one left over from an earlier session: both are ShiggyCord's.
    if (theme === _colorRef.key || theme.startsWith("bn-theme-")) return true;

    return _colorRef.current.reference === "light" ? theme === "light" : theme !== "light";
}

export default function patchDefinitionAndResolver() {
    const callback = ([theme]: any[]) => theme === _colorRef.key ? [_colorRef.current!.reference] : void 0;

    Object.defineProperty(themeTypes, "DARKER", {
        configurable: true,
        enumerable: true,
        get: () => _colorRef.current?.reference === "darker" ? _colorRef.key : origDarker,
    });
    Object.defineProperty(themeTypes, "LIGHT", {
        configurable: true,
        enumerable: true,
        get: () => _colorRef.current?.reference === "light" ? _colorRef.key : origLight,
    });

    Object.keys(tokenReference.RawColor).forEach(key => {
        Object.defineProperty(tokenReference.RawColor, key, {
            configurable: true,
            enumerable: true,
            get: () => {
                const ret = _colorRef.current?.raw[key];
                if (ret) return ret;
                return origRawColor[key];
            }
        });
    });

    const unpatches = [
        before("updateTheme", NativeThemeModule, callback),
        instead("resolveSemanticColor", tokenReference.default.meta ?? tokenReference.default.internal, (args: any[], orig: any) => {
            if (!isThemedAppearance(args[0])) return orig(...args);

            args[0] = _colorRef.current!.reference;

            const [name, colorDef] = extractInfo(_colorRef.current!.reference, args[1]);

            let semanticDef = _colorRef.current.semantic[name];
            if (!semanticDef && _colorRef.current.spec === 2 && name in SEMANTIC_FALLBACK_MAP) {
                semanticDef = _colorRef.current.semantic[SEMANTIC_FALLBACK_MAP[name]];
            }

            if (semanticDef?.value) {
                return semanticDef.opacity === 1
                    ? semanticDef.value
                    : chroma(semanticDef.value).alpha(semanticDef.opacity).hex();
            }

            const rawValue = _colorRef.current.raw[colorDef.raw];
            if (rawValue) {
                // Set opacity if needed
                return colorDef.opacity === 1 ? rawValue : chroma(rawValue).alpha(colorDef.opacity).hex();
            }

            // Fallback to default
            return orig(...args);
        }),
        () => {
            Object.defineProperty(themeTypes, "DARKER", {
                configurable: true, writable: true, value: origDarker
            });
            Object.defineProperty(themeTypes, "LIGHT", {
                configurable: true, writable: true, value: origLight
            });
            Object.defineProperty(tokenReference, "RawColor", {
                configurable: true,
                writable: true,
                value: origRawColor
            });
        }
    ];

    return () => unpatches.forEach(p => p());
}

function extractInfo(themeName: string, colorObj: any): [name: string, colorDef: any] {
    // @ts-ignore - assigning to extractInfo._sym
    const propName = colorObj[extractInfo._sym ??= Object.getOwnPropertySymbols(colorObj)[0]];
    const colorDef = tokenReference.SemanticColor[propName];

    return [propName, colorDef[themeName]];
}
