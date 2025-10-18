import React from "react";
import { hasStack, isComponentStack } from "@core/ui/reporter/utils/isStack";
import parseErrorStack from "@core/ui/reporter/utils/parseErrorStack";
import { getDebugInfo, toggleSafeMode } from "@lib/api/debug";
import { BundleUpdaterManager } from "@lib/api/native/modules";
import { settings } from "@lib/api/settings";
import { Codeblock, ErrorBoundary } from "@lib/ui/components";
import { createStyles } from "@lib/ui/styles";
import { tokens } from "@metro/common";
import {
  Button,
  Card,
  SafeAreaProvider,
  SafeAreaView,
  Text,
} from "@metro/common/components";
import { ScrollView, View } from "react-native";

import {
  registeredPlugins,
  disablePlugin,
  getBisectBatches,
  enablePlugin,
  getPluginSettingsComponent,
} from "@lib/addons/plugins";
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

  return (
    <ErrorBoundary>
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
                              props.rerender();
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
                              await disablePlugin(s.id);
                              props.rerender();
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

              // 3) No confident detection — show bisect suggestion and controls
              const batches = bisectBatches;
              return (
                <Card>
                  <View style={{ gap: 8 }}>
                    <Text variant="heading-md/bold">No plugin detected</Text>
                    <Text variant="text-sm/normal" color="text-muted">
                      We couldn't confidently identify a plugin from this call
                      stack. If you recently installed or updated plugins, try
                      disabling the most recent ones first.
                    </Text>

                    {!showBisectUI ? (
                      <Button
                        text="Start plugin bisect"
                        onPress={() => {
                          try {
                            const b = getBisectBatches();
                            if (!b || b.length === 0) {
                              // nothing to bisect
                              setBisectBatches([]);
                              setShowBisectUI(false);
                              props.rerender();
                              return;
                            }
                            setBisectBatches(b);
                            setBisectIndex(0);
                            setShowBisectUI(true);
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                      />
                    ) : (
                      <>
                        <Text variant="text-md/normal">
                          Bisect step {bisectIndex + 1} of {batches.length}
                        </Text>
                        {(batches[bisectIndex] || []).map((id) => {
                          const manifest = registeredPlugins.get(id);
                          const name =
                            manifest?.display?.name ?? manifest?.name ?? id;
                          return (
                            <View
                              key={id}
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Text>{name}</Text>
                              <View style={{ flexDirection: "row", gap: 8 }}>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  text="Disable"
                                  onPress={async () => {
                                    try {
                                      await disablePlugin(id);
                                      props.rerender();
                                    } catch (e) {
                                      console.error(e);
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  text="Open"
                                  onPress={() => {
                                    try {
                                      const Comp =
                                        getPluginSettingsComponent(id);
                                      if (Comp)
                                        navigation.push(
                                          "SHIGGYCORD_CUSTOM_PAGE",
                                          {
                                            render: () => <Comp />,
                                            title: name,
                                          },
                                        );
                                    } catch (e) {
                                      console.error(e);
                                    }
                                  }}
                                />
                              </View>
                            </View>
                          );
                        })}
                        <View style={{ flexDirection: "row", gap: 8 }}>
                          <Button
                            text="Disable batch"
                            variant="destructive"
                            onPress={async () => {
                              try {
                                const batch = bisectBatches[bisectIndex] || [];
                                for (const id of batch) await disablePlugin(id);
                                props.rerender();
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                          />
                          <Button
                            text="Next step"
                            onPress={() => {
                              setBisectIndex((i) =>
                                Math.min(i + 1, bisectBatches.length - 1),
                              );
                            }}
                          />
                          <Button
                            text="Stop"
                            variant="secondary"
                            onPress={() => setShowBisectUI(false)}
                          />
                        </View>
                      </>
                    )}
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
              onPress={() => props.rerender()}
            />
          </Card>
        </SafeAreaView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
