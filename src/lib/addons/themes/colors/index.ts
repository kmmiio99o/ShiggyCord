import patchChatBackground from "./patches/background";
import patchDefinitionAndResolver from "./patches/resolver";
import patchStorage from "./patches/storage";
import { ColorManifest } from "./types";
import { updateBunnyColor } from "./updater";
import fixStatusBar from "./statusbar";

/** @internal */
export default function initColors(manifest: ColorManifest | null) {
    if (manifest) updateBunnyColor(manifest, { update: false });

    const patches = [
        patchStorage(),
        patchDefinitionAndResolver(),
        patchChatBackground(),
        fixStatusBar()
    ];

    return () => patches.forEach(p => p && (typeof p === "function" ? p() : null));
}
