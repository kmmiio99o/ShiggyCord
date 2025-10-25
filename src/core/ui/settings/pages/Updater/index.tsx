import React, { useEffect, useState } from "react";
import { useProxy } from "@core/vendetta/storage";
import {
  updateAllRepository,
  registeredPlugins,
  pluginRepositories,
  isGreaterVersion,
  refreshPlugin,
} from "@lib/addons/plugins";
import { updaterSettings } from "@lib/api/settings";
import { findAssetId } from "@lib/api/assets";
import { getDebugInfo } from "@lib/api/debug";
import {
  Stack,
  TableRowGroup,
  TableSwitchRow,
  TableRow,
  Text,
  Button,
  Card,
  IconButton,
} from "@metro/common/components";
import { ScrollView, View } from "react-native";

/**
 * Updater UI
 * - Shows updater toggles (auto update, fetch-on-start)
 * - Shows bundle info with refresh button
 * - Lists available plugin updates discovered after refresh
 * - Provides per-plugin Update button and Update All
 */

type UpdateEntry = {
  id: string;
  name: string;
  current: string;
  latest: string;
  repo: string;
};

export default function Updater() {
  // Bind persisted settings
  useProxy(updaterSettings);

  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<UpdateEntry[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);

  const fetchPluginsOnStart = updaterSettings.fetchPluginsOnStart ?? true;
  const autoEnabled = !!updaterSettings.autoUpdateEnabled;
  const lastChecked = updaterSettings.lastChecked ?? null;

  const debugInfo = getDebugInfo();

  useEffect(() => {
    // Optionally, we could auto-refresh after app fully loads if configured,
    // but we intentionally keep refresh manual here to avoid background network.
  }, []);

  const setAutoUpdate = (v: boolean) => {
    updaterSettings.autoUpdateEnabled = v;
  };

  const setFetchOnStart = (v: boolean) => {
    updaterSettings.fetchPluginsOnStart = v;
  };

  const refresh = async () => {
    if (checking) return;
    setChecking(true);
    setLastError(null);

    try {
      // Update repositories (this function is aware of updaterSettings)
      await updateAllRepository();

      // mark last checked
      updaterSettings.lastChecked = new Date().toISOString();

      // Build available updates list:
      // Iterate known repositories and compare remote versions with registered plugin versions.
      const pending: UpdateEntry[] = [];

      const repos = Object.keys(pluginRepositories || {});
      for (const repoUrl of repos) {
        const repo = pluginRepositories[repoUrl];
        if (!repo) continue;

        for (const id of Object.keys(repo)) {
          if (id === "$meta") continue;
          const remoteInfo = repo[id];
          if (!remoteInfo || !remoteInfo.version) continue;

          const registered = registeredPlugins.get(id);
          if (!registered) continue;

          const currentVersion = (registered as any).version ?? "0.0.0";
          const latestVersion = remoteInfo.version;

          if (isGreaterVersion(latestVersion, currentVersion)) {
            pending.push({
              id,
              name: (registered as any).display?.name ?? id,
              current: currentVersion,
              latest: latestVersion,
              repo: repoUrl,
            });
          }
        }
      }

      setAvailable(pending);
    } catch (e) {
      console.error("Updater refresh failed", e);
      setLastError(String((e as Error)?.message ?? e));
    } finally {
      setChecking(false);
    }
  };

  const updatePlugin = async (id: string, repo: string) => {
    try {
      await refreshPlugin(id, repo);
      // remove from list
      setAvailable((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(`Failed updating plugin ${id}`, e);
      setLastError(String((e as Error)?.message ?? e));
    }
  };

  const updateAll = async () => {
    // Iterate copy because we modify available inside loop
    const items = [...available];
    for (const it of items) {
      // sequential to avoid spamming network, but could be parallelized if desired
      // ignore errors per plugin and continue
      try {
        // best-effort
        // eslint-disable-next-line no-await-in-loop
        await updatePlugin(it.id, it.repo);
      } catch {
        // swallow - updatePlugin sets lastError
      }
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 38 }}
    >
      <Stack
        style={{ paddingVertical: 24, paddingHorizontal: 12 }}
        spacing={24}
      >
        <TableRowGroup title="Updater">
          <TableSwitchRow
            label="Auto Update"
            subLabel="Automatically install updates when available"
            icon={<TableRow.Icon source={findAssetId("CloudUploadIcon")!} />}
            value={autoEnabled}
            onValueChange={setAutoUpdate}
          />

          <TableSwitchRow
            label="Fetch external plugins on startup"
            subLabel="Reduce startup network activity when disabled"
            icon={<TableRow.Icon source={findAssetId("CloudDownloadIcon")!} />}
            value={fetchPluginsOnStart}
            onValueChange={setFetchOnStart}
          />

          <TableRow
            label="Last checked"
            subLabel={
              lastChecked ? new Date(lastChecked).toLocaleString() : "Never"
            }
            icon={<TableRow.Icon source={findAssetId("ClockIcon")!} />}
          />

          <TableRow
            label="Bundle"
            subLabel={`Version ${debugInfo.bunny.version} — Loader ${debugInfo.bunny.loader.version}`}
            icon={
              <TableRow.Icon
                source={findAssetId("CircleInformationIcon-primary")!}
              />
            }
            trailing={
              <IconButton icon={findAssetId("RetryIcon")!} onPress={refresh} />
            }
          />
        </TableRowGroup>

        <TableRowGroup title="Available Plugin Updates">
          {lastError ? (
            <Text variant="text-sm/medium" color="text-danger">
              Error: {lastError}
            </Text>
          ) : null}

          {checking ? (
            <Text variant="text-sm/medium" color="text-muted">
              Checking for updates...
            </Text>
          ) : available.length === 0 ? (
            <Text variant="text-sm/medium" color="text-muted">
              No updates available. Press the refresh icon in Bundle to check.
            </Text>
          ) : (
            available.map((p) => (
              <Card key={p.id} style={{ padding: 10, marginBottom: 10 }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "bold" }}>{p.name}</Text>
                    <Text>
                      Current: {p.current} — Latest: {p.latest}
                    </Text>
                    <Text style={{ color: "#666", marginTop: 6, fontSize: 12 }}>
                      {p.repo}
                    </Text>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Button
                      text="Update"
                      variant="primary"
                      onPress={() => updatePlugin(p.id, p.repo)}
                    />
                    <Button
                      text="Skip"
                      variant="secondary"
                      style={{ marginTop: 8 }}
                      onPress={() =>
                        setAvailable((prev) =>
                          prev.filter((x) => x.id !== p.id),
                        )
                      }
                    />
                  </View>
                </View>
              </Card>
            ))
          )}

          {available.length > 0 ? (
            <View style={{ marginTop: 6 }}>
              <Button text="Update All" variant="primary" onPress={updateAll} />
            </View>
          ) : null}
        </TableRowGroup>
      </Stack>
    </ScrollView>
  );
}
