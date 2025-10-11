import { Strings } from "@core/i18n";
import { PupuIcon } from "@core/ui/settings";
import Version from "@core/ui/settings/pages/General/Version";
import { useProxy } from "@core/vendetta/storage";
import { getDebugInfo } from "@lib/api/debug";
import { settings, loaderConfig } from "@lib/api/settings";
import { Stack, TableRowGroup, TableRow, Text } from "@metro/common/components";
import { Platform, ScrollView, View } from "react-native";
import { findAssetId } from "@lib/api/assets";

export default function About() {
  const debugInfo = getDebugInfo();
  useProxy(settings);
  useProxy(loaderConfig);

  function getBuildType() {
    // If running in React Native dev mode, treat as development
    if (__DEV__) return "Development";

    try {
      // If a custom URL is enabled, inspect it
      if (loaderConfig?.customLoadUrl?.enabled) {
        const url = loaderConfig.customLoadUrl.url ?? "";
        const u = new URL(url);
        const host = u.hostname;

        // Localhost / local IP -> dev server (bun run serve)
        if (
          host === "localhost" ||
          host === "127.0.0.1" ||
          host === "0.0.0.0" ||
          host.startsWith("192.") ||
          host.startsWith("10.") ||
          host.startsWith("172.")
        )
          return "Development";

        // If the URL points to GitHub releases/raw, treat as Release
        if (
          url.includes("github.com") ||
          url.includes("raw.githubusercontent.com") ||
          url.includes("/releases/")
        )
          return "Release";

        // Custom remote URL (not recognized as local or GitHub)
        return "Custom";
      }
    } catch (e) {
      // If URL parsing fails, fall back below
    }

    // Default: when not using a custom URL the loader fetches from GitHub releases
    return "Release";
  }

  const coreVersions = [
    {
      label: Strings.PUPU,
      version: debugInfo.bunny.version,
      icon: { uri: PupuIcon },
    },
    {
      label: "Discord",
      version: `${debugInfo.discord.version} (${debugInfo.discord.build})`,
      icon: "Discord",
    },
    {
      label: Strings.LOADER,
      version: `${debugInfo.bunny.loader.name} ${debugInfo.bunny.loader.version}`,
      icon: "DownloadIcon",
    },
  ];

  const runtimeVersions = [
    {
      label: "React",
      version: debugInfo.react.version,
      icon: "ScienceIcon",
    },
    {
      label: "React Native",
      version: debugInfo.react.nativeVersion,
      icon: "MobilePhoneIcon",
    },
    {
      label: Strings.BYTECODE,
      version: debugInfo.hermes.bytecodeVersion,
      icon: "TopicsIcon",
    },
  ];

  const deviceInfo = [
    {
      label: Strings.OPERATING_SYSTEM,
      version: `${debugInfo.os.name} ${debugInfo.os.version}`,
      icon: "ScreenIcon",
    },
    ...(debugInfo.os.sdk
      ? [
          {
            label: "SDK Version",
            version: debugInfo.os.sdk,
            icon: "StaffBadgeIcon",
          },
        ]
      : []),
    {
      label: "Device",
      version: `${debugInfo.device.brand} ${debugInfo.device.model}`,
      icon: "MobilePhoneIcon",
    },
    {
      label: Strings.MANUFACTURER,
      version: debugInfo.device.manufacturer,
      icon: "WrenchIcon",
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 38 }}
    >
      <Stack
        style={{ paddingVertical: 24, paddingHorizontal: 12 }}
        spacing={24}
      >
        <View style={{ alignItems: "center", paddingVertical: 16 }}>
          <Text variant="heading-xl/bold" style={{ textAlign: "center" }}>
            {Strings.PUPU}
          </Text>
          <Text
            variant="text-md/medium"
            style={{ textAlign: "center", marginTop: 4 }}
          >
            Shiggy your discord client!
          </Text>
        </View>

        <TableRowGroup title="Core Components">
          {coreVersions.map((v, i) => (
            <Version
              key={i}
              label={v.label}
              version={v.version}
              icon={v.icon}
            />
          ))}
        </TableRowGroup>

        <TableRowGroup title="Runtime Environment">
          {runtimeVersions.map((v, i) => (
            <Version
              key={i}
              label={v.label}
              version={v.version}
              icon={v.icon}
            />
          ))}
        </TableRowGroup>

        <TableRowGroup title="Device Information">
          {deviceInfo.map((p, i) => (
            <Version
              key={i}
              label={p.label}
              version={p.version}
              icon={p.icon}
            />
          ))}
        </TableRowGroup>

        <TableRowGroup title="Additional Details">
          <TableRow
            label="Architecture"
            trailing={
              <TableRow.TrailingText
                text={Platform.OS === "android" ? "Android ARM64" : "iOS ARM64"}
              />
            }
            icon={<TableRow.Icon source={findAssetId("ScreenIcon")} />}
          />
          <TableRow
            label="Build Type"
            trailing={<TableRow.TrailingText text={getBuildType()} />}
            icon={<TableRow.Icon source={findAssetId("HammerIcon")} />}
          />
        </TableRowGroup>
      </Stack>
    </ScrollView>
  );
}
