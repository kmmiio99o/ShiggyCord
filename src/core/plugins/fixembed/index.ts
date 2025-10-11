import { defineCorePlugin } from "..";
import { findByProps } from "@metro";
import { after } from "@lib/api/patcher";
import { logger } from "@lib/utils/logger";
import { settings } from "@lib/api/settings";
import { React } from "@metro/common";

const { FormSection, FormRow, FormSwitch, FormText } = findByProps(
  "FormSection",
  "FormRow",
  "FormSwitch",
  "FormText",
);
const { ScrollView } = require("react-native");

type FixEmbedSettings = {
  enabled: boolean;
  twitter: boolean;
  instagram: boolean;
  tiktok: boolean;
  reddit: boolean;
};

declare module "@lib/api/settings" {
  interface Settings {
    fixembed?: FixEmbedSettings;
  }
}

const MessageActions = findByProps("sendMessage");
let unpatch: (() => void) | null = null;

function transformLinks(content: string, config: FixEmbedSettings): string {
  let result = content;
  // Twitter/X: Replace domain, keep path
  if (config.twitter) {
    result = result.replace(
      /https?:\/\/(?:www\.)?(twitter\.com|x\.com)(\/[^\s]+)/gi,
      "https://fxtwitter.com$2",
    );
  }
  // Instagram: Replace domain, keep path
  if (config.instagram) {
    result = result.replace(
      /https?:\/\/(?:www\.)?instagram\.com(\/[^\s]+)/gi,
      "https://ddinstagram.com$1",
    );
  }
  // TikTok: Replace domain, keep path
  if (config.tiktok) {
    result = result.replace(
      /https?:\/\/(?:www\.)?tiktok\.com(\/[^\s]+)/gi,
      "https://tnktok.com$1",
    );
    // TikTok short links (vm.tiktok.com)
    result = result.replace(
      /https?:\/\/vm\.tiktok\.com\/([A-Za-z0-9]+)\/?/gi,
      "https://vm.tnktok.com/$1",
    );
  }
  // Reddit: Replace domain, keep path
  if (config.reddit) {
    result = result.replace(
      /https?:\/\/(?:www\.)?reddit\.com(\/[^\s]+)/gi,
      "https://rxddit.com$1",
    );
  }
  return result;
}

export default defineCorePlugin({
  manifest: {
    id: "bunny.fixembed",
    version: "1.0.0",
    type: "plugin",
    spec: 3,
    main: "",
    display: {
      name: "FixEmbed",
      description:
        "Improves social media embeds by using privacy-friendly alternative frontends.",
      authors: [{ name: "ShiggyCord Team" }],
    },
  },

  SettingsComponent() {
    const { useState, useEffect } = React;
    const [config, setConfig] = useState<FixEmbedSettings>({
      enabled: settings.fixembed?.enabled ?? true,
      twitter: settings.fixembed?.twitter ?? true,
      instagram: settings.fixembed?.instagram ?? true,
      tiktok: settings.fixembed?.tiktok ?? true,
      reddit: settings.fixembed?.reddit ?? true,
    });

    useEffect(() => {
      settings.fixembed = config;
    }, [config]);

    const updateConfig = (key: keyof FixEmbedSettings, value: boolean) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    };

    return React.createElement(ScrollView, { style: { flex: 1 } }, [
      React.createElement(
        FormSection,
        { title: "General Settings" },
        React.createElement(FormRow, {
          label: "Enable FixEmbed",
          subLabel: "Master switch for all link conversions",
          trailing: React.createElement(FormSwitch, {
            value: config.enabled,
            onValueChange: (v: boolean) => updateConfig("enabled", v),
          }),
        }),
      ),
      React.createElement(FormSection, { title: "Platforms" }, [
        React.createElement(FormRow, {
          label: "Twitter/X",
          trailing: React.createElement(FormSwitch, {
            value: config.twitter,
            disabled: !config.enabled,
            onValueChange: (v: boolean) => updateConfig("twitter", v),
          }),
        }),
        React.createElement(FormRow, {
          label: "Instagram",
          trailing: React.createElement(FormSwitch, {
            value: config.instagram,
            disabled: !config.enabled,
            onValueChange: (v: boolean) => updateConfig("instagram", v),
          }),
        }),
        React.createElement(FormRow, {
          label: "TikTok",
          trailing: React.createElement(FormSwitch, {
            value: config.tiktok,
            disabled: !config.enabled,
            onValueChange: (v: boolean) => updateConfig("tiktok", v),
          }),
        }),
        React.createElement(FormRow, {
          label: "Reddit",
          trailing: React.createElement(FormSwitch, {
            value: config.reddit,
            disabled: !config.enabled,
            onValueChange: (v: boolean) => updateConfig("reddit", v),
          }),
        }),
      ]),
      React.createElement(
        FormSection,
        { title: "About" },
        React.createElement(
          FormText,
          { style: { padding: 12 } },
          "This plugin automatically converts social media links to privacy-friendly alternative frontends for better embeds.",
        ),
      ),
    ]);
  },

  start() {
    logger.log("FixEmbed: Starting plugin");
    settings.fixembed = settings.fixembed || {
      enabled: true,
      twitter: true,
      instagram: true,
      tiktok: true,
      reddit: true,
    };

    if (!unpatch) {
      unpatch = after("sendMessage", MessageActions, (args) => {
        const config = settings.fixembed!;
        if (!config.enabled) return;
        if (args[1]?.content) {
          args[1].content = transformLinks(args[1].content, config);
          args[1].nonce = args[1].nonce || Math.random().toString(36).slice(2);
        }
      });
    }
    logger.log("FixEmbed: Patched outgoing messages");
  },

  stop() {
    logger.log("FixEmbed: Stopping plugin");
    if (unpatch) {
      unpatch();
      unpatch = null;
    }
    logger.log("FixEmbed: Unpatched outgoing messages");
  },
});
