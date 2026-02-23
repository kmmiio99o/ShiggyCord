import { _colorRef } from "@lib/addons/themes/colors/updater";
import { NativeThemeModule } from "@lib/api/native/modules";
import { before, instead } from "@lib/api/patcher";
import { findByProps } from "@metro";
import { byMutableProp } from "@metro/filters";
import { createLazyModule } from "@metro/lazy";
const getChroma = () => require("chroma-js") as typeof import("chroma-js").default;

const tokenReference = findByProps("SemanticColor");
const isThemeModule = createLazyModule(byMutableProp("isThemeDark"));

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

const origRawColor = { ...tokenReference.RawColor };

export default function patchDefinitionAndResolver() {
    const callback = ([theme]: any[]) => {
        if (!_colorRef.current) return void 0;
        return theme === _colorRef.key ? [_colorRef.current.reference] : void 0;
    };

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
        before("isThemeDark", isThemeModule, callback),
        before("isThemeLight", isThemeModule, callback),
        before("updateTheme", NativeThemeModule, callback),
        instead("resolveSemanticColor", tokenReference.default.meta ?? tokenReference.default.internal, (args: any[], orig: any) => {
            if (!_colorRef.current) return orig(...args);
            const currentRef = _colorRef.current;
            if (args[0] !== _colorRef.key) return orig(...args);

            // Use the captured reference value
            args[0] = currentRef.reference;

            const [name, colorDef] = extractInfo(currentRef.reference, args[1]);

            // If extractInfo couldn't resolve a color definition, fall back to the original resolver
            if (!name || !colorDef) return orig(...args);

            let semanticDef = currentRef.semantic[name];
            if (!semanticDef && currentRef.spec === 2 && name in SEMANTIC_FALLBACK_MAP) {
                semanticDef = currentRef.semantic[SEMANTIC_FALLBACK_MAP[name]];
            }

            if (semanticDef?.value) {
                if (semanticDef.opacity === 1) return semanticDef.value;
                return getChroma()(semanticDef.value).alpha(semanticDef.opacity).hex();
            }

            const rawKey = colorDef.raw;
            const rawValue = rawKey ? currentRef.raw[rawKey] : undefined;
            if (rawValue) {
                // Set opacity if needed
                return (colorDef.opacity === 1) ? rawValue : getChroma()(rawValue).alpha(colorDef.opacity).hex();
            }

            // Fallback to default
            return orig(...args);
        }),
        () => {
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
    const entry = tokenReference.SemanticColor[propName];

    if (!entry || typeof entry !== "object") {
        return [propName, undefined];
    }

    const colorDef = Object.prototype.hasOwnProperty.call(entry, themeName) ? entry[themeName] : undefined;

    return [propName, colorDef];
}
