import fixStatusBar from "./statusbar";
import fixKeyboard from "./keyboard";
import patchChatBackground from "./patches/background";
import patchDefinitionAndResolver from "./patches/resolver";
import patchStorage from "./patches/storage";
import { ColorManifest } from "./types";
import { updateBunnyColor } from "./updater";

/** @internal */
export default function initColors(manifest: ColorManifest | null) {
  const patches = [
    patchStorage(),
    patchDefinitionAndResolver(),
    patchChatBackground(),
  ];

  fixStatusBar();
  fixKeyboard();

  if (manifest) updateBunnyColor(manifest, { update: false });

  return () => patches.forEach((p) => p());
}
