import { colorsPref } from "@lib/addons/themes/colors/preferences";
import { _colorRef } from "@lib/addons/themes/colors/updater";
import { after } from "@lib/api/patcher";
import { useObservable } from "@lib/api/storage";
import { findInReactTree } from "@lib/utils";
import { findByFilePathLazy } from "@metro";
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

export default function patchChatBackground() {
  try {
    if (!Messages) return;

    const patches = [
      after("render", Messages, (_, ret) => {
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
      })
    ];

    return () => patches.forEach(x => x?.());
  } catch (e) {
    logger.error("Background patch: failed to initialize", e);
  }
}
