import { settings } from "@lib/api/settings";
import { findByProps, findByPropsLazy, findByStoreNameLazy } from "@metro";

import { parseColorManifest } from "./parser";
import { ColorManifest, InternalColorDefinition } from "./types";

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
    lastSetDiscordTheme: "dark"
};

export function updateBunnyColor(colorManifest: ColorManifest | null, { update = true } ) {
    if (settings.safeMode?.enabled) return;

    const internalDef = colorManifest ? parseColorManifest(colorManifest) : null;

        const keyName = internalDef && internalDef.reference === "light" ? `bn-theme-${++_inc}` : `dark`;

        const tsTheme = typeof ThemeStore.theme === "string" ? ThemeStore.theme : undefined;
        const currentDiscordTheme = tsTheme === "darker" ? "dark" : (tsTheme ?? "");

        const lastSet = (currentDiscordTheme && !currentDiscordTheme.startsWith("bn-theme-") && currentDiscordTheme !== keyName)
            ? currentDiscordTheme
            : _colorRef.lastSetDiscordTheme;

        var ref = Object.assign(_colorRef, {
            current: internalDef,
            key: keyName,
            lastSetDiscordTheme: lastSet
        });

        if (internalDef != null) {
            tokenRef.Theme[ref.key.toUpperCase()] = ref.key;
            FormDivider.DIVIDER_COLORS[ref.key] = FormDivider.DIVIDER_COLORS[ref.current!.reference];

            Object.keys(tokenRef.Shadow).forEach(k => tokenRef.Shadow[k][ref.key] = tokenRef.Shadow[k][ref.current!.reference]);
            Object.keys(tokenRef.SemanticColor).forEach(k => {
                tokenRef.SemanticColor[k][ref.key] = {
                    ...tokenRef.SemanticColor[k][ref.current!.reference]
                };
            });
        }

    if (update) {
        AppearanceManager.setShouldSyncAppearanceSettings(false);
        const fallback = (_colorRef.lastSetDiscordTheme && !_colorRef.lastSetDiscordTheme.startsWith("bn-theme-"))
            ? _colorRef.lastSetDiscordTheme
            : "dark";
        AppearanceManager.updateTheme(internalDef != null ? ref.key : fallback);
    }
}
