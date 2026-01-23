import { StatusBar, Platform } from "react-native";
import { findByStoreNameLazy } from "@metro/wrappers";
import { _colorRef } from "./updater";

const ThemeStore = findByStoreNameLazy("ThemeStore");

function getBarStyle() {
    // Check for custom theme
    const custom = _colorRef.current;
    if (custom?.reference) {
        return custom.reference === "light" ? "dark-content" : "light-content";
    }

    // Fallback to Discord theme string
    const theme = ThemeStore?.theme;
    if (typeof theme === "string") {
        const lowerTheme = theme.toLowerCase();
        return (lowerTheme.includes("dark") || lowerTheme.includes("midnight")) ? "light-content" : "dark-content";
    }

    return "light-content";
}

export default function fixStatusBar() {
    function applyStatusBar() {
        const style = getBarStyle();
        StatusBar.setBarStyle(style, true);

        if (Platform.OS === "android") {
            StatusBar.setTranslucent?.(true);
            StatusBar.setBackgroundColor?.("#00000000", true);
        }
    }

    if (Platform.OS === "android") {
        const origSetBarStyle = StatusBar.setBarStyle;
        StatusBar.setBarStyle = function (_style: any, ...args: any[]) {
            return origSetBarStyle.call(this, getBarStyle(), ...args);
        };
    }

    const unsubscribe = ThemeStore?.addChangeListener?.(applyStatusBar);

    applyStatusBar();

    let delay = 200;
    for (let i = 0; i < 5; i++, delay *= 2) {
        setTimeout(applyStatusBar, delay);
    }

    return unsubscribe;
}
