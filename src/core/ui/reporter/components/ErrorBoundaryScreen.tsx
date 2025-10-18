import React from "react";
import { hasStack, isComponentStack } from "@core/ui/reporter/utils/isStack";
import parseErrorStack from "@core/ui/reporter/utils/parseErrorStack";
import { getDebugInfo, toggleSafeMode } from "@lib/api/debug";
import { BundleUpdaterManager } from "@lib/api/native/modules";
import { settings } from "@lib/api/settings";
import { Codeblock } from "@lib/ui/components";
import { createStyles } from "@lib/ui/styles";
import { tokens } from "@metro/common";
import { showToast } from "@lib/ui/toasts";
import {
  Button,
  Card,
  SafeAreaProvider,
  SafeAreaView,
  Text,
  TableRowGroup,
  TableRow,
  TableSwitchRow,
  Stack,
} from "@metro/common/components";
import { ScrollView, View } from "react-native";

import {
  registeredPlugins,
  disablePlugin,
  getBisectBatches,
  enablePlugin,
  getPluginSettingsComponent,
  isPluginEnabled,
  pluginSettings,
} from "@lib/addons/plugins";
import { getCorePlugins } from "@core/plugins";
import ErrorComponentStackCard from "./ErrorComponentStackCard";
import ErrorStackCard from "./ErrorStackCard";
import { NavigationNative } from "@metro/common";

const useStyles = createStyles({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.BG_BASE_SECONDARY,
    paddingHorizontal: 16,
    height: "100%",
    gap: 12,
  },
});

/**
 * Module-level helper to collect all known plugin IDs (core + registered externals + installed keys).
 * Exported and attached to window so external callers (or code executing before React mounts)
 * can call it without needing the React component to mount first.
 */
export function collectAllPluginIdsModule(): string[] {
  const ids = new Set<string>();
  // registeredPlugins (includes externals known from repos)
  try {
    if (
      typeof registeredPlugins !== "undefined" &&
      registeredPlugins &&
      typeof (registeredPlugins as any).keys === "function"
    ) {
      for (const k of registeredPlugins.keys()) ids.add(k);
    }
  } catch {}
  // installed plugin settings (may include plugins not registered yet)
  try {
    if (typeof pluginSettings !== "undefined" && pluginSettings) {
      for (const k of Object.keys(pluginSettings || {})) ids.add(k);
    }
  } catch {}
  return Array.from(ids);
}

// Provide a global alias for callers that expect the global to exist early.
// Use both spellings seen in various callers.
// Provide global aliases (some callers used plural/singular variants)
// Ensure a safe, early no-op fallback is present on the global object so
// callers that run before this module is evaluated won't throw a ReferenceError.
(function () {
  try {
    const g =
      typeof globalThis !== "undefined"
        ? globalThis
        : typeof window !== "undefined"
          ? window
          : {};
    // If the global already has a function, don't overwrite it.
    if (typeof (g as any).collectAllPluginsIds !== "function") {
      Object.defineProperty(g, "collectAllPluginsIds", {
        configurable: true,
        writable: true,
        enumerable: false,
        value: collectAllPluginIdsModule,
      });
    }
    if (typeof (g as any).collectAllPluginIds !== "function") {
      Object.defineProperty(g, "collectAllPluginIds", {
        configurable: true,
        writable: true,
        enumerable: false,
        value: collectAllPluginIdsModule,
      });
    }
  } catch (e) {
    // Best-effort only — avoid throwing during module evaluation
    try {
      console.error(
        "[ShiggyCord] failed to install global collectAllPluginIds alias",
        e,
      );
    } catch {}
  }
})();

// Component entrypoint
export default function ErrorBoundaryScreen(props: {
  error: Error;
  rerender: () => void;
}) {
  const styles = useStyles();
  const debugInfo = getDebugInfo();
  const navigation = NavigationNative.useNavigation();

  // Bisect UI state (fixes ReferenceError when referenced below)
  const [bisectBatches, setBisectBatches] = React.useState<string[][] | null>(
    null,
  );
  const [bisectIndex, setBisectIndex] = React.useState<number>(0);
  const [showBisectUI, setShowBisectUI] = React.useState<boolean>(false);

  // Use a safe fallback so renders don't throw if state hasn't been initialized yet
  const batches = bisectBatches ?? [];
  const currentBatch = batches[bisectIndex] ?? [];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={{ gap: 4 }}>
          <Text variant="display-lg">Uh oh.</Text>
          <Text variant="text-md/normal">
            A crash occurred while rendering a component. This could be caused
            by a plugin, ShiggyCord, or Discord itself.
          </Text>
          <Text variant="text-sm/normal" color="text-muted">
            {debugInfo.os.name}; {debugInfo.discord.build} (
            {debugInfo.discord.version}); {debugInfo.bunny.version}
          </Text>
        </View>
        <ScrollView fadingEdgeLength={64} contentContainerStyle={{ gap: 12 }}>
          <Codeblock selectable={true}>{props.error.message}</Codeblock>

          {(() => {
            // 1) Prefer explicit annotation on the error (set by plugin loader) or current runtime marker.
            const explicitPluginId =
              (props.error as any)?.pluginId ??
              (window as any)?.__SHIGGY_LAST_UNCAUGHT_ERROR?.pluginId ??
              (window as any)?.__SHIGGY_CURRENT_PLUGIN;

            if (explicitPluginId && registeredPlugins.has(explicitPluginId)) {
              const manifest = registeredPlugins.get(explicitPluginId)!;
              const name =
                manifest.display?.name ?? manifest.name ?? explicitPluginId;
              return (
                <Card>
                  <View style={{ gap: 8 }}>
                    <Text variant="heading-md/bold">Suspected plugin</Text>
                    <Text variant="text-md/normal">
                      This error is associated with a plugin based on runtime
                      context.
                    </Text>
                    <Text variant="text-sm/normal" color="text-muted">
                      {name} ({explicitPluginId})
                    </Text>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <Button
                        variant="destructive"
                        text="Disable plugin"
                        onPress={async () => {
                          try {
                            await disablePlugin(explicitPluginId);
                            // Do not auto-retry render; let the user decide when to retry.
                            showToast("Disabled plugin " + explicitPluginId);
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                      />
                      <Button
                        text="Open settings"
                        onPress={() => {
                          try {
                            const Comp =
                              getPluginSettingsComponent(explicitPluginId);
                            if (Comp) {
                              navigation.push("SHIGGYCORD_CUSTOM_PAGE", {
                                title: name,
                                render: () => <Comp />,
                              });
                            }
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                      />
                    </View>
                  </View>
                </Card>
              );
            }

            // 2) Fallback: heuristic based on stack frames (best-effort)
            let suspected: Array<{ id: string; name: string }> = [];
            try {
              const frames = parseErrorStack((props.error as any).stack);
              if (frames && frames.length) {
                for (const [id, manifest] of registeredPlugins) {
                  try {
                    const jsPath = (manifest as any).jsPath;
                    if (!jsPath) continue;
                    for (const f of frames) {
                      if (!f.file) continue;
                      if (
                        f.file.includes(jsPath) ||
                        f.file.includes(`/plugins/scripts/${id}`) ||
                        f.file.includes(`bunny-plugin/${id}`)
                      ) {
                        suspected.push({
                          id,
                          name:
                            (manifest as any).display?.name ??
                            (manifest as any).name ??
                            id,
                        });
                        break;
                      }
                    }
                    if (suspected.length) break;
                  } catch {
                    // ignore per-manifest errors
                  }
                }
              }
            } catch {
              // parsing failed — continue to show suggestions
            }

            if (suspected.length > 0) {
              const s = suspected[0];
              return (
                <Card>
                  <View style={{ gap: 8 }}>
                    <Text variant="heading-md/bold">Possible culprit</Text>
                    <Text variant="text-md/normal">
                      The call stack contains frames that look like they
                      originate from a plugin.
                    </Text>
                    <Text variant="text-sm/normal" color="text-muted">
                      Suspected plugin: {s.name} ({s.id})
                    </Text>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <Button
                        variant="destructive"
                        text="Disable plugin"
                        onPress={async () => {
                          try {
                            console.log(
                              "[ShiggyCord][ErrorBoundaryScreen] Disable suspected plugin clicked:",
                              s.id,
                            );
                            await disablePlugin(s.id);
                            // Avoid automatically retrying the crashed render here.
                            showToast("Disabled plugin " + s.id);
                            console.log(
                              "[ShiggyCord][ErrorBoundaryScreen] Disabled suspected plugin:",
                              s.id,
                            );
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                      />
                      <Button
                        text="Open settings"
                        onPress={() => {
                          try {
                            const Comp = getPluginSettingsComponent(s.id);
                            if (Comp) {
                              navigation.push("SHIGGYCORD_CUSTOM_PAGE", {
                                title: s.name,
                                render: () => <Comp />,
                              });
                            }
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                      />
                    </View>
                  </View>
                </Card>
              );
            }

            // 3) Show only built-in (core) plugins from the bundle (no externals)
            const corePlugins = getCorePlugins();
            const ids = Object.keys(corePlugins);
            return (
              <Card>
                <View style={{ gap: 8 }}>
                  <Text variant="heading-md/bold">Core plugins</Text>
                  <Text variant="text-sm/normal" color="text-muted">
                    Toggle built-in plugins below. After toggling, press "Retry
                    Render" to re-check the crash.
                  </Text>

                  {ids.length === 0 ? (
                    <Text variant="text-sm/normal" color="text-muted">
                      No core plugins found.
                    </Text>
                  ) : (
                    <TableRowGroup title="Core plugins">
                      {ids.map((id) => {
                        const entry = (corePlugins as any)[id];
                        const name =
                          entry?.default?.manifest?.display?.name ??
                          entry?.default?.manifest?.name ??
                          id;
                        let enabled = false;
                        try {
                          enabled = Boolean(isPluginEnabled(id));
                        } catch {
                          enabled = false;
                        }
                        // Protect specific core plugins from being toggled (same heuristic as PluginCard)
                        const idLower = ((id || "") as string).toLowerCase();
                        const isProtectedCore =
                          idLower.includes("quickinstall") ||
                          idLower === "bunny.badges";

                        return (
                          <TableSwitchRow
                            key={id}
                            label={name}
                            value={enabled}
                            disabled={isProtectedCore}
                            onValueChange={async (v: boolean) => {
                              try {
                                if (v) {
                                  await enablePlugin(id, true);
                                } else {
                                  await disablePlugin(id);
                                }
                                // lightweight refresh so UI reflects the change
                                setBisectBatches((prev) =>
                                  prev ? [...prev] : [],
                                );
                                showToast(
                                  `${v ? "Enabled" : "Disabled"} ${name}`,
                                );
                              } catch (e) {
                                console.error(
                                  "[ShiggyCord][ErrorBoundaryScreen] failed to toggle core plugin",
                                  id,
                                  e,
                                );
                                showToast(
                                  `Failed to ${v ? "enable" : "disable"} ${name}`,
                                );
                              }
                            }}
                          />
                        );
                      })}
                    </TableRowGroup>
                  )}

                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <Button
                      text="Refresh list"
                      onPress={() => {
                        try {
                          // Force UI refresh of core list
                          setBisectBatches((prev) => (prev ? [...prev] : []));
                          showToast("Core plugin list refreshed");
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                    />
                  </View>
                </View>
              </Card>
            );
          })()}

          {hasStack(props.error) && <ErrorStackCard error={props.error} />}
          {isComponentStack(props.error) ? (
            <ErrorComponentStackCard
              componentStack={props.error.componentStack}
            />
          ) : null}
        </ScrollView>
        <Card style={{ gap: 6 }}>
          <Button
            text="Reload Discord"
            onPress={() => BundleUpdaterManager.reload()}
          />
          {!settings.safeMode?.enabled && (
            <Button
              text="Reload in Safe Mode"
              onPress={() => toggleSafeMode()}
            />
          )}
          <Button
            variant="destructive"
            text="Retry Render"
            onPress={() => {
              try {
                console.log(
                  "[ShiggyCord][ErrorBoundaryScreen] Retry Render clicked",
                );
              } catch {}
              props.rerender();
            }}
          />
        </Card>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
