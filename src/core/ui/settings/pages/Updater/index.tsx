import React, { useEffect, useState } from "react";
import { useProxy } from "@core/vendetta/storage";
import {
  updateRepository,
  updateAllRepository,
  updateAndWritePlugin,
  registeredPlugins,
  pluginRepositories,
  pluginSettings,
  isGreaterVersion,
  refreshPlugin,
} from "@lib/addons/plugins";
import { updaterSettings } from "@lib/api/settings";
import { awaitStorage } from "@lib/api/storage";
import { findAssetId } from "@lib/api/assets";
import { showToast } from "@lib/ui/toasts";
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

  // Merge both toggles into one: autoEnabled
  const autoEnabled = !!updaterSettings.autoUpdateEnabled;
  const lastChecked = updaterSettings.lastChecked ?? null;

  useEffect(() => {
    // Optionally, we could auto-refresh after app fully loads if configured,
    // but we intentionally keep refresh manual here to avoid background network.
  }, []);

  const setAutoUpdate = (v: boolean) => {
    updaterSettings.autoUpdateEnabled = v;
    updaterSettings.fetchPluginsOnStart = v;
  };

  const refresh = async () => {
    if (checking) return;
    setChecking(true);
    setLastError(null);
    // Provide immediate user feedback
    try {
      showToast("Checking for updates...");

      // Ensure storages are loaded so pluginRepositories/pluginSettings are populated
      try {
        await awaitStorage(pluginRepositories, pluginSettings);
      } catch (e) {
        console.warn("Updater: awaitStorage failed", e);
      }

      // For each registered repository, attempt to refresh its metadata and then
      // fetch each plugin's manifest+script so it becomes available in the updater
      const repos = Object.keys(pluginRepositories || {});
      console.debug("Updater: manual fetch for repos:", repos);

      for (const repoUrl of repos) {
        try {
          // Attempt to refresh repo.json so we have an up-to-date list of plugins
          try {
            await updateRepository(repoUrl);
          } catch (repoErr) {
            console.warn(
              "Updater: updateRepository failed for",
              repoUrl,
              repoErr,
            );
            // continue - we may still have entries in pluginRepositories to iterate
          }

          const repo = pluginRepositories[repoUrl];
          if (!repo) continue;

          // For each plugin declared in the repository, try to fetch its manifest and script.
          for (const pluginId of Object.keys(repo)) {
            if (pluginId === "$meta") continue;
            try {
              const manifest = await updateAndWritePlugin(
                repoUrl,
                pluginId,
                true,
              );
              if (manifest) {
                // Register the fetched manifest in-memory so the Updater list can use it
                registeredPlugins.set(pluginId, manifest as any);
                console.debug(
                  `Updater: registered plugin ${pluginId} from ${repoUrl}`,
                );
              }
            } catch (fetchErr) {
              console.warn(
                `Updater: failed to fetch plugin ${pluginId} from ${repoUrl}`,
                fetchErr,
              );
            }
          }
        } catch (eRepo) {
          console.error(
            "Updater: unexpected error iterating repo",
            repoUrl,
            eRepo,
          );
        }
      }

      // mark last checked
      updaterSettings.lastChecked = new Date().toISOString();

      // Build available updates list by comparing registered plugin versions to repository metadata
      const pending: UpdateEntry[] = [];

      const repos2 = Object.keys(pluginRepositories || {});
      for (const repoUrl of repos2) {
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

      // Inform user of result (we do not auto-install anything; we only populate the Updater)
      if (pending.length === 0) {
        showToast("No updates available");
      } else {
        showToast(
          `Found ${pending.length} update${pending.length > 1 ? "s" : ""}`,
        );
      }
    } catch (e) {
      console.error("Updater refresh failed", e);
      const msg = String((e as Error)?.message ?? e);
      setLastError(msg);
      showToast(`Failed to check for updates: ${msg}`);
    } finally {
      setChecking(false);
    }
  };

  const checkBundleNow = async () => {
    try {
      showToast("Checking bundle...");
      const customEnabled = Boolean(loaderConfig?.customLoadUrl?.enabled);
      const customUrl = loaderConfig?.customLoadUrl?.url ?? null;

      const extractVersion = (txt: string) => {
        const m =
          txt.match(/\bversion\s*[:=]\s*['"`]v?([^'"`\s;]+)['"`]/i) ||
          txt.match(/export\s+const\s+version\s*=\s*['"`]([^'"`\n]+)['"`]/i) ||
          txt.match(/\bVERSION\b\s*[:=]\s*['"`]([^'"`\n]+)['"`]/i) ||
          txt.match(/@version\s+v?([0-9]+\.[0-9]+\.[0-9][^\s]*)/i);
        return m ? m[1] : null;
      };

      let latestTag: string | null = null;
      let latestUrl: string | null = null;

      if (customEnabled && customUrl) {
        try {
          const r = await fetch(customUrl, { cache: "no-store" });
          if (r.ok) {
            const txt = await r.text();
            const v = extractVersion(txt);
            if (v) {
              latestTag = v;
              latestUrl = customUrl;
            }
          }
        } catch (e) {
          console.warn("checkBundleNow custom fetch failed", e);
        }
      }

      if (!latestTag) {
        try {
          const bundleDownload =
            "https://github.com/kmmiio99o/ShiggyCord/releases/latest/download/shiggycord.js";
          const r2 = await fetch(bundleDownload, { cache: "no-store" });
          if (r2.ok) {
            const txt2 = await r2.text();
            const v2 = extractVersion(txt2);
            if (v2) {
              latestTag = v2;
              latestUrl = bundleDownload;
            }
          }
        } catch (e) {
          console.warn("checkBundleNow default download failed", e);
        }
      }

      const installed = getDebugInfo()?.bunny?.version ?? null;

      updaterSettings.lastBundleChecked = new Date().toISOString();
      updaterSettings.lastBundleVersion = latestTag;
      updaterSettings.bundleLatestTag = latestTag;
      updaterSettings.bundleLatestUrl = latestUrl ?? null;
      updaterSettings.bundleAvailable =
        latestTag != null &&
        installed != null &&
        String(latestTag).replace(/^v/, "") !==
          String(installed).replace(/^v/, "");

      if (latestTag) {
        if (updaterSettings.bundleAvailable) {
          showToast(`Bundle update available: ${latestTag}`);
        } else {
          showToast(`Bundle up-to-date: ${latestTag}`);
        }
      } else {
        showToast("Bundle check completed: no version found");
      }
    } catch (e) {
      console.error("checkBundleNow failed", e);
      showToast("Bundle check failed");
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
            label="Auto Update Plugins"
            subLabel="Automatically check and install plugin updates at startup"
            icon={<TableRow.Icon source={findAssetId("CloudUploadIcon")!} />}
            value={autoEnabled}
            onValueChange={setAutoUpdate}
          />

          <TableRow
            label="Last checked"
            subLabel={
              lastChecked ? new Date(lastChecked).toLocaleString() : "Never"
            }
            icon={<TableRow.Icon source={findAssetId("ClockIcon")!} />}
          />
        </TableRowGroup>

        <View style={{ marginTop: 4, marginBottom: 8 }}>
          <Button
            text="Fetch Now"
            variant="primary"
            onPress={refresh}
            disabled={checking}
            style={{ width: "100%", height: 48, fontSize: 18 }}
          />
        </View>

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
              No updates available. Press the refresh icon to check.
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
