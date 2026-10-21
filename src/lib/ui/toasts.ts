import { Strings } from "@core/i18n";
import { findAssetId } from "@lib/api/assets";
import { lazyDestructure } from "@lib/utils/lazy";
import { toasts } from "@metro/common";
import { findByProps } from "@metro/wrappers";

const { uuid4 } = lazyDestructure(() => findByProps("uuid4"));

/**
 * Discord 350.8 ("mana" design system) changed the sign ToastActionCreators.open:
 *
 *   old  open({ key, content, source, icon })
 *   new  (>= 350.8): open(type, { text, ... })      <-- two args
 *
 * The type (p. ej. "TOAST_MESSAGE_COPIED")  Is what is selected by config of the
 * toast, and there is the "position*. if u call "open(payload)" with only one arg
 * " type" becomes undefined, the config doesnt exist and "useToastContainer"
 * dies with "Cannot read property 'position' of undefined".
 */
let _toastType: string | null | undefined;

function findToastType(): string | null {
    if (_toastType !== undefined) return _toastType;
    _toastType = null;

    try {
        const modules = (globalThis as any).modules;
        const requireModule = (globalThis as any).__r;
        if (!modules || typeof requireModule !== "function") return null;

        const types: string[] = [];

        for (const id in modules) {
            const filePath = modules[id]?.__filePath;
            if (typeof filePath !== "string" || !/toast/i.test(filePath)) continue;

            let exports: any;
            try {
                exports = requireModule(+id);
            } catch {
                continue;
            }
            if (!exports || typeof exports !== "object") continue;

            for (const key of Object.keys(exports)) {
                const value = exports[key];
                if (!value || typeof value !== "object" || Array.isArray(value)) continue;

                for (const name of Object.keys(value)) {
                    if (!/^TOAST_[A-Z0-9_]+$/.test(name)) continue;

                    const type = value[name];
                    if (typeof type === "string" && !types.includes(type)) types.push(type);
                }
            }
        }

        _toastType =
            types.find((t) => /(^|_)GENERIC($|_)/.test(t)) ??
            types.find((t) => /(^|_)(DEFAULT|INFO|BASIC|PLAIN|TEXT)($|_)/.test(t)) ??
            types.find((t) => /MESSAGE_COPIED/.test(t)) ??
            null;
    } catch (e) {
        console.warn("[ShiggyCord] Can't exec toast type", e);
    }

    return _toastType;
}

/** "open(type, payload)" in 350.8, "open(payload)" before. */
function isModernToastApi(open: Function) {
    try {
        if (open.length >= 2) return true;
        return /^function\s*[\w$]*\s*\([^)]*,/.test(String(open));
    } catch {
        return false;
    }
}

export const showToast = (content: string, asset?: number) => {
    const open = (toasts as any)?.open;
    if (typeof open !== "function") {
        console.warn("[ShiggyCord] showToast: Discord doesn't expose toasts.open");
        return;
    }

    const key = `vd-toast-${uuid4()}`;

    try {
        if (isModernToastApi(open)) {
            const type =
                (globalThis as any).__SHIGGY_TOAST_TYPE ??
                findToastType() ??
                // valid type on 350.8 Discord uses it to copy text now (idk if was used before but ut was complaining about this)
                "TOAST_MESSAGE_COPIED";

            // Not longer an assetID?
            // Try to render ("Element type is invalid ...
            // but got: number"). icon thingy is giv by da config
            return open.call(toasts, type, {
                key,
                text: String(content),
            });
        }

        return open.call(toasts, {
            // ? In build 182205/44707, Discord changed their toasts, source is no longer used, rather icon, and a key is needed.
            key,
            content: content,
            source: asset,
            icon: asset,
        });
    } catch (e) {
        // Un toast nunca debe tumbar la app.
        console.warn("[ShiggyCord] showToast failed", e);
    }
};

showToast.showCopyToClipboard = (message = Strings.COPIED_TO_CLIPBOARD) => {
    showToast(message, findAssetId("toast_copy_link"));
};
