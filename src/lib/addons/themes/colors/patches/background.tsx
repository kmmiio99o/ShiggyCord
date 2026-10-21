import { colorsPref } from "@lib/addons/themes/colors/preferences";
import { _colorRef } from "@lib/addons/themes/colors/updater";
import { after } from "@lib/api/patcher";
import { deleteJsxCreate, onJsxCreate } from "@lib/api/react/jsx";
import { useObservable } from "@lib/api/storage";
import { findInReactTree } from "@lib/utils";
import { findByFilePathLazy } from "@metro";
import { getLazyContext } from "@metro/lazy";
const getChroma = () => require("chroma-js") as typeof import("chroma-js").default;
import { ImageBackground, StyleSheet } from "react-native";
import { logger } from "@lib/utils/logger";

const Messages = findByFilePathLazy("modules/messages/native/Messages.tsx", true);

function ThemeBackground({ children }: { children: React.ReactNode; }) {
    useObservable([colorsPref]);

    const background = _colorRef.current?.background;
    const url = background?.url;
    const blur = background?.blur;

    if (
        !_colorRef.current ||
        colorsPref.customBackground === "hidden" ||
        !url
    ) {
        return children;
    }

    if (blur !== undefined && typeof blur !== "number") {
        return children;
    }

    return (
        <ImageBackground
            style={{ flex: 1, height: "100%" }}
            source={{ uri: url }}
            blurRadius={typeof blur === "number" ? blur : 0}
        >
            {children}
        </ImageBackground>
    );
}

function decorate(ret: any) {
  if (!ret) return ret;

  try {
    if (!_colorRef.current || !_colorRef.current.background?.url) return ret;

    const messagesComponent = findInReactTree(
      ret,
      x => x && "HACK_fixModalInteraction" in (x.props ?? {}) && x?.props?.style
    );

    if (messagesComponent) {
      try {
        const flattened = StyleSheet.flatten(messagesComponent.props.style);
        const backgroundColor = getChroma()(
          flattened.backgroundColor || "black"
        ).alpha(
          1 - (_colorRef.current.background?.opacity ?? 1)
        ).hex();

        messagesComponent.props.style = StyleSheet.flatten([
          messagesComponent.props.style,
          { backgroundColor }
        ]);
      } catch (e) {
        logger.warn("Background patch: failed to modify style", e);
      }
    }
  } catch (e) {
    logger.warn("Background patch: render error", e);
    return ret;
  }

  return <ThemeBackground>{ret}</ThemeBackground>;
}

/**
 * Chat background / opacity patch.
 *
 * Discord 350.x changed "modules/messages/native/Messages.tsx" from a class-ish export
 * (with an own render) to a plain function component, so after("render", Messages, …)
 * made spitroast throw "render is not a function in Function" *inside* ChatView's render
 * (the lazy patch is applied while the module initializes, which happens mid-render).
 * That throw became a React component error and killed the whole chat screen.
 *
 * This version:
 *  - resolves the module through its lazy context instead of letting the patcher throw,
 *  - only hooks ".render" when it actually exists,
 *  - otherwise wraps the function component's JSX output,
 *  - never throws from the deferred callback.
 */
export default function patchChatBackground() {
  const unpatchers: Array<() => void> = [];

  try {
    const ctx = getLazyContext(Messages as any);
    if (!ctx) return;

    const unsubscribe = ctx.getExports((exports: any) => {
      try {
        // Legacy layout (<= ~349): object/instance with its own "render"
        if (typeof exports?.render === "function") {
          unpatchers.push(
            after("render", exports, (_args: any, ret: any) => decorate(ret)),
          );
          return;
        }

        // 350.x+: plain function component, there is no ".render" to hook.
        if (typeof exports === "function") {
          const name = exports.displayName || exports.name;
          if (name && name !== "anonymous") {
            const cb = (_Component: any, ret: any) => decorate(ret);
            onJsxCreate(name, cb);
            unpatchers.push(() => deleteJsxCreate(name, cb));
          }
        }
      } catch (e) {
        // Never let this bubble up: we are running inside a React render.
        logger.warn("Background patch: failed to apply", e);
      }
    });

    if (typeof unsubscribe === "function") unpatchers.push(unsubscribe as any);
  } catch (e) {
    logger.error("Background patch: failed to initialize", e);
  }

  return () => {
    for (const unpatch of unpatchers) {
      try {
        unpatch?.();
      } catch {}
    }
  };
}
