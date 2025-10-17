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
  Button,
  Text,
} from "@metro/common/components";
import { Linking, ScrollView } from "react-native";

// Fetch latest commits from GitHub for Changelog
import React, { useState } from "react";

export default function General() {
  useProxy(settings);

  const debugInfo = getDebugInfo();
  const navigation = NavigationNative.useNavigation();

  // Remove modal state, use openAlert for both modals
  const [loadingCommits, setLoadingCommits] = useState(false);
  const [commits, setCommits] = useState<any[]>([]);
  const [commitsError, setCommitsError] = useState<string | null>(null);

  // Handler for Changelog
  const handleShowChangelog = () => {
    setLoadingCommits(true);
    setCommitsError(null);
    fetch(
      "https://api.github.com/repos/kmmiio99o/ShiggyCord/commits?per_page=10",
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch commits");
        return res.json();
      })
      .then((data) => {
        setCommits(data);
        setLoadingCommits(false);
        openAlert(
          "shiggycord-changelog",
          <AlertModal
            title="Changelog"
            content={
              loadingCommits ? (
                <Text>Loading latest commits...</Text>
              ) : commitsError ? (
                <Text style={{ color: "red" }}>{commitsError}</Text>
              ) : (
                <Stack spacing={12}>
                  {data.map((entry: any) => (
                    <Stack key={entry.sha} spacing={2}>
                      <Text style={{ fontWeight: "bold" }}>
                        {new Date(
                          entry.commit.author.date,
                        ).toLocaleDateString()}{" "}
                        — {entry.commit.author.name}
                      </Text>
                      <Text>{entry.commit.message.split("\n")[0]}</Text>
                      <Button
                        text="View Commit"
                        variant="secondary"
                        onPress={() => Linking.openURL(entry.html_url)}
                        style={{ alignSelf: "flex-start", marginTop: 2 }}
                      />
                    </Stack>
                  ))}
                  <Button
                    text="View All Commits on GitHub"
                    variant="primary"
                    onPress={() =>
                      Linking.openURL(
                        "https://github.com/kmmiio99o/ShiggyCord/commits/main/",
                      )
                    }
                  />
                </Stack>
              )
            }
            actions={
              <AlertActions>
                <AlertActionButton text="Close" variant="secondary" />
              </AlertActions>
            }
          />,
        );
      })
      .catch((e) => {
        setCommitsError("Could not load changelog.");
        setLoadingCommits(false);
        openAlert(
          "shiggycord-changelog-error",
          <AlertModal
            title="Changelog"
            content={
              <Text style={{ color: "red" }}>Could not load changelog.</Text>
            }
            actions={
              <AlertActions>
                <AlertActionButton text="Close" variant="secondary" />
              </AlertActions>
            }
          />,
        );
      });
  };

  // Team members array for easy editing
  const TEAM_MEMBERS = [
    {
      name: "kmmiio99o",
      role: "Lead Developer",
      avatar: "https://avatars.githubusercontent.com/u/73043890?v=4",
      profile: "https://github.com/kmmiio99o",
    },
    {
      name: "Angelw0lf",
      role: "Contributor",
      avatar: "https://avatars.githubusercontent.com/u/112412567?v=4",
      profile: "https://github.com/Angelw0lf",
    },
    // Add or remove members here
  ];

  // Handler for About the Team is no longer needed (navigation used instead)

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
            label="ShiggyCord"
            icon={<TableRow.Icon source={{ uri: PupuIcon }} />}
            trailing={<TableRow.TrailingText text={debugInfo.bunny.version} />}
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
            subLabel={`${debugInfo.bunny.loader.name} loader`}
            icon={<TableRow.Icon source={findAssetId("DownloadIcon")!} />}
            trailing={
              <TableRow.TrailingText text={debugInfo.bunny.loader.version} />
            }
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
        <TableRowGroup title="Project Info">
          <TableRow
            arrow
            label="Changelog"
            subLabel="See what's new and recent changes"
            icon={
              <TableRow.Icon
                source={findAssetId("CircleInformationIcon-primary")!}
              />
            }
            onPress={handleShowChangelog}
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
