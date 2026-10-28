import { Strings } from "@core/i18n";
import { findAssetId } from "@lib/api/assets";
import { lazyDestructure } from "@lib/utils/lazy";
import { toasts } from "@metro/common";
import { findByProps } from "@metro/wrappers";

const { uuid4 } = lazyDestructure(() => findByProps("uuid4"));

function safeUuid4(): string {
    try {
        const fn = (uuid4 as any)();
        return typeof fn === "string" ? fn : "vd-toast-fallback-" + Math.random().toString(36).slice(2, 8);
    } catch (_) {
        return "vd-toast-fallback-" + Math.random().toString(36).slice(2, 8);
    }
}

export const showToast = (content: string, asset?: number) => {
    try {
        const toastModule = toasts as any;
        if (!toastModule || typeof toastModule.open !== "function") {
            console.warn("[Shiggy] Toast module not resolved; skipping toast:", content);
            return;
        }
        toastModule.open({
            key: `vd-toast-${safeUuid4()}`,
            content: content,
            source: asset,
            icon: asset,
        });
    } catch (e) {
        console.warn("[Shiggy] Toast failed:", content, e);
    }
};

showToast.showCopyToClipboard = (message = Strings.COPIED_TO_CLIPBOARD) => {
    try {
        showToast(message, findAssetId("toast_copy_link"));
    } catch (e) {
        console.warn("[Shiggy] Toast (clipboard) failed:", message, e);
    }
};
