import { StatusBar, TextInput, Platform } from "react-native";
import { findByStoreNameLazy } from "@metro/wrappers";
import { _colorRef } from "./updater";

const ThemeStore = findByStoreNameLazy("ThemeStore");

function getBarStyle() {
    // Check for custom theme
    const custom = _colorRef.current;
    if (custom) {
        // Bunny theme (spec 3)
        if (custom.spec === 3 && custom.reference) {
            return custom.reference === "light" ? "dark-content" : "light-content";
        }
        // Vendetta theme (spec 2)
        if (custom.spec === 2 && custom.reference) {
            return custom.reference === "light" ? "dark-content" : "light-content";
        }
    }

    // Fallback to Discord theme string
    const theme = ThemeStore?.theme;
    if (typeof theme === "string") {
        const lowerTheme = theme.toLowerCase();
        return (lowerTheme.includes("dark") || lowerTheme.includes("midnight")) ? "light-content" : "dark-content";
    }

    return "dark-content";
}


export default function fixStatusBar() {
    function applyStatusBar() {
        const style = getBarStyle();
        StatusBar.setBarStyle(style, true);
    }

    const unsubscribe = ThemeStore?.addChangeListener?.(applyStatusBar);

    const origSetBarStyle = StatusBar.setBarStyle;
    StatusBar.setBarStyle = function (_style: any, animated?: boolean) {
        return origSetBarStyle.call(this, getBarStyle(), animated ?? true);
    };

    if( Platform.OS === "ios" ){
        const origSetNativeProps = (TextInput.prototype as any).setNativeProps;
        (TextInput.prototype as any).setNativeProps = function (props: any) {
            const style = getBarStyle();
            const keyboardAppearance = style === "light-content" ? "dark" : "light";
            return origSetNativeProps?.call(this, {
                ...props,
                keyboardAppearance: props?.keyboardAppearance ?? keyboardAppearance
            });
        };

        let delay = 200;
        for (let i = 0; i < 5; i++, delay *= 2) {
            setTimeout(applyStatusBar, delay);
        }
    }

    return unsubscribe;
}