import { isSafeMode, toggleSafeMode } from "@core/debug/safeMode";
import { Strings } from "@core/i18n";
import { PupuIcon } from "@core/ui/settings";
import About from "@core/ui/settings/pages/General/About";
import { useProxy } from "@core/vendetta/storage";
import { findAssetId } from "@lib/api/assets";
import { getDebugInfo } from "@lib/api/debug";
import { BundleUpdaterManager } from "@lib/api/native/modules";
import { settings } from "@lib/api/settings";
import { openAlert } from "@lib/ui/alerts";
import { DISCORD_SERVER, GITHUB } from "@lib/utils/constants";
import { NavigationNative } from "@metro/common";
import {
  AlertActionButton,
  AlertActions,
  AlertModal,
  Stack,
  TableRow,
  TableRowGroup,
  TableSwitchRow,
} from "@metro/common/components";
import { Linking, ScrollView } from "react-native";

export default function General() {
  useProxy(settings);

  const debugInfo = getDebugInfo();
  const navigation = NavigationNative.useNavigation();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 38 }}
    >
      <Stack
        style={{ paddingVertical: 24, paddingHorizontal: 12 }}
        spacing={24}
      >
        <TableRowGroup title="App Information">
          <TableRow
            label={Strings.PUPU}
            subLabel={`Build ${debugInfo.bunny.version.split("-")[0] || debugInfo.bunny.version}`}
            icon={<TableRow.Icon source={{ uri: PupuIcon }} />}
            trailing={
              <TableRow.TrailingText
                text={
                  debugInfo.bunny.version.includes("-")
                    ? `#${debugInfo.bunny.version.split("-").slice(1).join("-")}`
                    : "ShiggyCord"
                }
              />
            }
          />
          <TableRow
            label="Discord"
            subLabel={`Version ${debugInfo.discord.version}`}
            icon={<TableRow.Icon source={findAssetId("Discord")!} />}
            trailing={
              <TableRow.TrailingText
                text={`Build ${debugInfo.discord.build}`}
              />
            }
          />
          <TableRow
            label="Loader"
            subLabel="ShiggyCord loader information"
            icon={<TableRow.Icon source={findAssetId("DownloadIcon")!} />}
            trailing={
              <TableRow.TrailingText
                text={`${debugInfo.bunny.loader.name} ${debugInfo.bunny.loader.version}`}
              />
            }
          />
          <TableRow
            label="Platform"
            subLabel={`${debugInfo.device.brand} ${debugInfo.device.model}`}
            icon={<TableRow.Icon source={findAssetId("ScreenIcon")!} />}
            trailing={<TableRow.TrailingText text={debugInfo.os.name} />}
          />
        </TableRowGroup>
        <TableRowGroup title="Quick Actions">
          <TableRow
            label={Strings.RELOAD_DISCORD}
            subLabel="Restart the application"
            icon={<TableRow.Icon source={findAssetId("RetryIcon")!} />}
            onPress={() => BundleUpdaterManager.reload()}
          />
          <TableSwitchRow
            label="Safe Mode"
            subLabel="Temporarily disable all add-ons"
            icon={<TableRow.Icon source={findAssetId("ShieldIcon")!} />}
            value={isSafeMode()}
            onValueChange={(to: boolean) => {
              toggleSafeMode({ to, reload: false });
              openAlert(
                "bunny-reload-safe-mode",
                <AlertModal
                  title="Reload now?"
                  content={
                    !to
                      ? "All add-ons will load normally."
                      : "All add-ons will be temporarily disabled upon reload."
                  }
                  actions={
                    <AlertActions>
                      <AlertActionButton
                        text="Reload Now"
                        variant="destructive"
                        onPress={() => BundleUpdaterManager.reload()}
                      />
                      <AlertActionButton text="Later" variant="secondary" />
                    </AlertActions>
                  }
                />,
              );
            }}
          />
        </TableRowGroup>
        <TableRowGroup title="Developer">
          <TableSwitchRow
            label={Strings.DEVELOPER_SETTINGS}
            subLabel="Enable developer tools and settings"
            icon={<TableRow.Icon source={findAssetId("WrenchIcon")!} />}
            value={settings.developerSettings}
            onValueChange={(v: boolean) => {
              settings.developerSettings = v;
            }}
          />
          <TableSwitchRow
            label={Strings.SETTINGS_ACTIVATE_DISCORD_EXPERIMENTS}
            subLabel={Strings.SETTINGS_ACTIVATE_DISCORD_EXPERIMENTS_DESC}
            icon={<TableRow.Icon source={findAssetId("FlaskIcon")!} />}
            value={settings.enableDiscordDeveloperSettings}
            onValueChange={(v: boolean) => {
              settings.enableDiscordDeveloperSettings = v;
            }}
          />
        </TableRowGroup>
        <TableRowGroup title="Community & Support">
          <TableRow
            arrow={true}
            label={Strings.DISCORD_SERVER}
            subLabel="Join our community server"
            icon={<TableRow.Icon source={findAssetId("Discord")!} />}
            onPress={() => Linking.openURL(DISCORD_SERVER)}
          />
          <TableRow
            arrow={true}
            label={Strings.GITHUB}
            subLabel="Source code and issues"
            icon={
              <TableRow.Icon
                source={findAssetId("img_account_sync_github_white")!}
              />
            }
            onPress={() => Linking.openURL(GITHUB)}
          />
        </TableRowGroup>
        <TableRowGroup title="System Information">
          <TableRow
            arrow
            label={Strings.ABOUT}
            subLabel="Detailed technical information"
            icon={
              <TableRow.Icon
                source={findAssetId("CircleInformationIcon-primary")!}
              />
            }
            onPress={() =>
              navigation.push("PUPU_CUSTOM_PAGE", {
                title: Strings.ABOUT,
                render: () => <About />,
              })
            }
          />
        </TableRowGroup>
      </Stack>
    </ScrollView>
  );
}
