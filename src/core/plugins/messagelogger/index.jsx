import { defineCorePlugin } from "..";
import fluxDispatchPatch from "./patches/flux_dispatch";
import selfEditPatch from "./patches/self_edit";
import actionsheet from "./patches/actionsheet";

export const regexEscaper = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export let isEnabled = false;

const deletedMessageArray = new Map();
let patches = [];

export default defineCorePlugin({
  manifest: {
    id: "bunny.messagelogger",
    version: "1.0.0",
    type: "plugin",
    spec: 3,
    main: "",
    display: {
      name: "Message Logger",
      description: "Port of the popular Revenge/Kettu plugin called Antied.",
      authors: [{ name: "ShiggyCord Team, Angelw0lf" }],
    },
  },

  start() {
    isEnabled = true;

    // Each patch function is expected to return an unpatch function.
    patches = [
      fluxDispatchPatch(deletedMessageArray),
      actionsheet(),
      selfEditPatch(),
    ].filter(Boolean);
  },

  stop() {
    isEnabled = false;

    patches.forEach((p) => p && p());
    patches = [];
  },
});
