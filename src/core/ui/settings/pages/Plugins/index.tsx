import { React, NavigationNative } from "@metro/common";
const { useReducer } = React;
import { View, Image } from "react-native";
import {
  Stack,
  Button,
  IconButton,
  Text,
  Card,
  FlashList,
} from "@metro/common/components";
import { Strings } from "@core/i18n";
import AddonPage from "@core/ui/components/AddonPage";
import PluginCard from "@core/ui/settings/pages/Plugins/components/PluginCard";
import { VdPluginManager } from "@core/vendetta/plugins";
import { useProxy } from "@core/vendetta/storage";
import {
  corePluginInstances,
  isCorePlugin,
  isPluginInstalled,
  pluginSettings,
  registeredPlugins,
} from "@lib/addons/plugins";
import { Author } from "@lib/addons/types";
import { findAssetId } from "@lib/api/assets";
import { settings } from "@lib/api/settings";
import { useObservable } from "@lib/api/storage";
import { showToast } from "@lib/ui/toasts";
import { VD_PROXY_PREFIX } from "@lib/utils/constants";
import { lazyDestructure } from "@lib/utils/lazy";
import { findByProps } from "@metro";
import { ComponentProps } from "react";
import safeFetch from "@lib/utils/safeFetch";
import Search from "@ui/components/Search";
import { clipboard } from "@metro/common";
import {
  ActionSheet,
  AlertModal,
  AlertActions,
  TableRow,
  TableRowGroup,
  BottomSheetTitleHeader,
} from "@metro/common/components";
import { showSheet } from "@lib/ui/sheets";
import { proxyLazy } from "@lib/utils/lazy";

import { UnifiedPluginModel } from "./models";
import unifyBunnyPlugin from "./models/bunny";
import unifyVdPlugin from "./models/vendetta";

const { openAlert } = lazyDestructure(() =>
  findByProps("openAlert", "dismissAlert"),
);
const {
  AlertModal: AlertModalComponent,
  AlertActions: AlertActionsComponent,
  AlertActionButton,
} = lazyDestructure(() => findByProps("AlertModal", "AlertActions"));
const { showSimpleActionSheet, hideActionSheet } = lazyDestructure(() =>
  findByProps("showSimpleActionSheet"),
);

const dismissAlert = proxyLazy(() => findByProps("close", "openLazy").close);

interface BaseAddonData {
  name: string;
  description: string;
  authors: string[];
  installUrl: string;
}

interface PluginData extends BaseAddonData {
  status: "working" | "broken" | "warning" | string;
  sourceUrl: string;
  warningMessage?: string;
}

type AddonData = PluginData;

const PLUGIN_URL =
  "https://raw.githubusercontent.com/Purple-EyeZ/Plugins-List/refs/heads/main/src/plugins-data.json";

enum Sort {
  DateNewest = "Date Added (Newest First)",
  DateOldest = "Date Added (Oldest First)",
  NameAZ = "Name (A-Z)",
  NameZA = "Name (Z-A)",
  WorkingFirst = "Working First",
  BrokenFirst = "Broken First",
}

function normalizeIdFromInstallUrl(url: string) {
  return url.endsWith("/") ? url : url + "/";
}

function InstallButton({
  addon,
  installing,
  setInstalling,
  setRefreshTick,
}: any) {
  const pluginId = normalizeIdFromInstallUrl(addon.installUrl);
  const plugin = VdPluginManager.plugins[pluginId];
  const installed = !!plugin;
  const isInstalling = installing.has(pluginId);

  // Determine if this is the QuickInstall plugin which can't be disabled
  const isQuickInstall = pluginId.toLowerCase().includes("quickinstall");
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [rotation, setRotation] = React.useState(0);
  const [pulse, setPulse] = React.useState(1);

  const continueInstallation = () => {
    performInstall();
  };

  const handleInstall = async () => {
    if (isInstalling) return;

    // Check for broken or warning status
    if (addon.status === "broken" || addon.status === "warning") {
      const isBroken = addon.status === "broken";
      openAlert(
        "bunny-plugin-status-warning",
        <AlertModalComponent
          title={isBroken ? "Plugin is Broken" : "Plugin Warning"}
          content={
            isBroken
              ? "This plugin is marked as broken and may not work properly or could cause issues. Do you still want to install it?"
              : "This plugin has warnings and might have issues. Do you want to continue with the installation?"
          }
          extraContent={
            addon.warningMessage ? (
              <Card>
                <Text variant="text-md/normal">{addon.warningMessage}</Text>
              </Card>
            ) : null
          }
          actions={
            <AlertActionsComponent>
              <AlertActionButton
                text="Install Anyway"
                variant={isBroken ? "destructive" : "primary"}
                onPress={continueInstallation}
              />
              <AlertActionButton text="Cancel" variant="secondary" />
            </AlertActionsComponent>
          }
        />,
      );
      return;
    }

    continueInstallation();
  };

  const performInstall = async () => {
    setInstalling((prev: Set<string>) => new Set([...prev, pluginId]));

    // Start animation
    const animationInterval = setInterval(() => {
      setRotation((prev) => (prev + 15) % 360);
      setPulse((prev) => 0.8 + 0.2 * Math.sin(Date.now() / 200));
      forceUpdate();
    }, 100);

    try {
      await VdPluginManager.installPlugin(addon.installUrl);
      setRefreshTick((prev: number) => prev + 1);

      // Show success feedback
      showSheet("PluginInstalledSheet", () => (
        <ActionSheet>
          <BottomSheetTitleHeader title="Plugin Installed" />
          <View style={{ padding: 16, alignItems: "center", gap: 12 }}>
            <View
              style={{
                backgroundColor: "rgba(67, 181, 129, 0.1)",
                borderRadius: 50,
                padding: 16,
              }}
            >
              <Image
                source={findAssetId("CheckmarkCircle")}
                style={{
                  width: 32,
                  height: 32,
                  tintColor: "#43b581",
                }}
              />
            </View>
            <Text variant="heading-md/bold">
              {addon.name} installed successfully!
            </Text>
            <Text
              variant="text-md/medium"
              color="text-muted"
              style={{ textAlign: "center" }}
            >
              The plugin has been added to your plugins list.
            </Text>
            <Button
              size="md"
              text="Open Plugin Settings"
              variant="primary"
              icon={findAssetId("SettingsIcon")}
              onPress={() => hideActionSheet()}
            />
          </View>
        </ActionSheet>
      ));
    } catch (e) {
      openAlert(
        "bunny-plugin-install-failed",
        <AlertModalComponent
          title="Installation Failed"
          content="Failed to install plugin"
          extraContent={
            <Stack spacing={16} style={{ width: "100%" }}>
              <View style={{ alignItems: "center", marginTop: 8 }}>
                <View
                  style={{
                    backgroundColor: "rgba(240, 71, 71, 0.1)",
                    borderRadius: 50,
                    padding: 16,
                    marginBottom: 12,
                  }}
                >
                  <Image
                    source={findAssetId("ErrorCircle")}
                    style={{
                      width: 32,
                      height: 32,
                      tintColor: "#f04747",
                    }}
                  />
                </View>
              </View>
              <Card
                style={{
                  backgroundColor: "rgba(0,0,0,0.05)",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Text variant="text-md/semibold" color="text-danger">
                  {e instanceof Error ? e.message : String(e)}
                </Text>
              </Card>
            </Stack>
          }
          actions={
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <AlertActionButton
                text="Cancel"
                variant="secondary"
                style={{ flex: 1 }}
              />
              <AlertActionButton
                text="Try Again"
                icon={findAssetId("RetryIcon")}
                variant="primary"
                style={{ flex: 1 }}
                onPress={() => {
                  dismissAlert("bunny-plugin-install-failed");
                  setTimeout(performInstall, 500);
                }}
              />
            </View>
          }
        />,
      );
    } finally {
      clearInterval(animationInterval);
      setRotation(0);
      setPulse(1);
      setInstalling((prev: Set<string>) => {
        const newSet = new Set(prev);
        newSet.delete(pluginId);
        return newSet;
      });
    }
  };

  const handleUninstall = () => {
    VdPluginManager.removePlugin(pluginId);
    setRefreshTick((prev: number) => prev + 1);
  };

  if (installed) {
    return (
      <Button
        size="sm"
        text="Uninstall"
        variant="destructive"
        icon={findAssetId("TrashIcon")}
        onPress={handleUninstall}
        disabled={isQuickInstall}
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,
        }}
      />
    );
  }

  return (
    <View style={{ opacity: pulse }}>
      <Button
        size="sm"
        text={isInstalling ? "Installing..." : "Install"}
        variant="primary"
        disabled={isInstalling}
        loading={isInstalling}
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,
        }}
        icon={
          isInstalling ? (
            <View style={{ transform: [{ rotate: `${rotation}deg` }] }}>
              <Image
                source={findAssetId("RetryIcon")}
                style={{ width: 16, height: 16 }}
              />
            </View>
          ) : (
            findAssetId("DownloadIcon")
          )
        }
        onPress={handleInstall}
      />
    </View>
  );
}

function TrailingButtons({
  addon,
  installing,
  setInstalling,
  setRefreshTick,
}: any) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <IconButton
        size="sm"
        variant="secondary"
        icon={findAssetId("MoreHorizontalIcon")}
        onPress={() => {
          showSimpleActionSheet({
            key: "AddonShareSheet",
            header: {
              title: "Share Plugin",
            },
            options: [
              {
                label: "Copy Install URL",
                onPress: () => {
                  clipboard.setString(addon.installUrl);
                  // URL copied
                },
              },
              {
                label: "Copy Source URL",
                onPress: () => {
                  if (addon.sourceUrl) {
                    clipboard.setString(addon.sourceUrl);
                    // Source URL copied
                  }
                },
              },
            ],
          });
        }}
      />
      <InstallButton
        addon={addon}
        installing={installing}
        setInstalling={setInstalling}
        setRefreshTick={setRefreshTick}
      />
    </View>
  );
}

function BrowseAddonCard({
  addon,
  installing,
  setInstalling,
  setRefreshTick,
}: any) {
  const { name, description, authors, status, warningMessage } = addon;

  let statusColor = "text-normal";
  if (status === "working") statusColor = "#4ADE80";
  if (status === "broken") statusColor = "#EF4444";
  if (status === "warning") statusColor = "#F59E0B";

  return (
    <Card>
      <Stack spacing={16}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexShrink: 1 }}>
            <Text numberOfLines={1} variant="heading-lg/semibold">
              {name}
            </Text>
            <Text variant="text-md/semibold" color="text-muted">
              by {authors?.join(", ") || "Unknown"}
            </Text>
            <Text variant="text-md/semibold" style={{ color: statusColor }}>
              Status: {status}
            </Text>
          </View>
          <View>
            <TrailingButtons
              addon={addon}
              installing={installing}
              setInstalling={setInstalling}
              setRefreshTick={setRefreshTick}
            />
          </View>
        </View>
        <Text variant="text-md/medium">{description}</Text>
        {warningMessage && (
          <Text variant="text-sm/medium" color="text-muted">
            Warning: {warningMessage}
          </Text>
        )}
      </Stack>
    </Card>
  );
}

interface PluginPageProps
  extends Partial<ComponentProps<typeof AddonPage<UnifiedPluginModel>>> {
  useItems: () => unknown[];
}

function InstalledPluginPage(props: PluginPageProps) {
  const items = props.useItems();

  return (
    <AddonPage<UnifiedPluginModel>
      CardComponent={PluginCard}
      title={Strings.PLUGINS}
      searchKeywords={[
        "name",
        "description",
        (p) =>
          p.authors
            ?.map((a: Author | string) => (typeof a === "string" ? a : a.name))
            .join() || "",
      ]}
      sortOptions={{
        "Enabled First": (a, b) =>
          Number(b.isEnabled()) - Number(a.isEnabled()),
        "Disabled First": (a, b) =>
          Number(a.isEnabled()) - Number(b.isEnabled()),
        "Date (Newest)": (a, b) => {
          // Prefer recently installed/registered plugins first. We look up insertion
          // order from Vendetta manager and Bunny pluginSettings; later entries are
          // considered newer (higher index). If missing, treat index as -1.
          const vdOrder = Object.keys(VdPluginManager.plugins || {});
          const bnOrder = Object.keys(pluginSettings || {});
          const idx = (id: string) => {
            const vdI = vdOrder.indexOf(id);
            const bnI = bnOrder.indexOf(id);
            return Math.max(vdI, bnI);
          };
          return idx(b.id) - idx(a.id);
        },
        "Date (Oldest)": (a, b) => {
          const vdOrder = Object.keys(VdPluginManager.plugins || {});
          const bnOrder = Object.keys(pluginSettings || {});
          const idx = (id: string) => {
            const vdI = vdOrder.indexOf(id);
            const bnI = bnOrder.indexOf(id);
            return Math.max(vdI, bnI);
          };
          return idx(a.id) - idx(b.id);
        },
        "Name (A-Z)": (a, b) => a.name.localeCompare(b.name),
        "Name (Z-A)": (a, b) => b.name.localeCompare(a.name),
      }}
      safeModeHint={{ message: Strings.SAFE_MODE_NOTICE_PLUGINS }}
      items={items}
      {...props}
    />
  );
}

interface BrowsePluginPageProps {
  plugins: PluginData[];
  installing: Set<string>;
  setInstalling: React.Dispatch<React.SetStateAction<Set<string>>>;
  setRefreshTick: React.Dispatch<React.SetStateAction<number>>;
}

function BrowsePluginPage(props: BrowsePluginPageProps) {
  // Build quick lookup/index map based on the order fetched from remote repository.
  // The remote list doesn't provide timestamps, so we treat the list order as the
  // chronological order from oldest -> newest and use indices for Date sorting.
  const indexMap = new Map<string, number>();
  (props.plugins || []).forEach((p, i) =>
    indexMap.set(normalizeIdFromInstallUrl(p.installUrl), i),
  );

  // Helpers to determine install / enabled state.
  const findBunnyIdForAddon = (addon: PluginData) => {
    for (const [id, manifest] of registeredPlugins) {
      if (!manifest) continue;
      const name = manifest.display?.name ?? id;
      if (name === addon.name) return id;
    }
    return null;
  };

  const isEnabledForAddon = (addon: PluginData) => {
    const vendettaId = normalizeIdFromInstallUrl(addon.installUrl);
    const vd = VdPluginManager.plugins[vendettaId];
    if (vd) return Boolean(vd.enabled ?? true);

    const bnId = findBunnyIdForAddon(addon);
    if (bnId) return Boolean(pluginSettings[bnId]?.enabled);

    return false;
  };

  // Helper to determine whether an addon from the remote list is installed locally.
  const isInstalledForAddon = (addon: PluginData) => {
    const vendettaId = normalizeIdFromInstallUrl(addon.installUrl);
    // Vendetta-managed plugin presence indicates installed
    if (VdPluginManager.plugins[vendettaId]) return true;

    // For Bunny-registered plugins, try to resolve by display name -> id and check pluginSettings
    const bnId = findBunnyIdForAddon(addon);
    if (bnId) return Boolean(pluginSettings[bnId] != null);

    return false;
  };

  const getIndexForAddon = (addon: PluginData) =>
    indexMap.get(normalizeIdFromInstallUrl(addon.installUrl)) ?? 0;

  return (
    <AddonPage<PluginData>
      CardComponent={({ item }) => (
        <BrowseAddonCard
          addon={item}
          installing={props.installing}
          setInstalling={props.setInstalling}
          setRefreshTick={props.setRefreshTick}
        />
      )}
      title={Strings.PLUGINS}
      searchKeywords={[
        "name",
        "description",
        (p) => (p.authors || []).join(", "),
      ]}
      sortOptions={{
        // Newest first -> larger index is newer (we treat list order as chronological)
        "Date (Newest)": (a, b) => getIndexForAddon(b) - getIndexForAddon(a),
        // Oldest first -> smaller index is older
        "Date (Oldest)": (a, b) => getIndexForAddon(a) - getIndexForAddon(b),

        // Health-based sorts: surface problematic plugins first or working ones first
        "Broken First": (a, b) => {
          const score = (p: PluginData) =>
            p.status === "broken"
              ? 3
              : p.status === "warning"
                ? 2
                : p.status === "working"
                  ? 1
                  : 0;
          return score(b) - score(a);
        },
        "Warning First": (a, b) => {
          const score = (p: PluginData) =>
            p.status === "warning"
              ? 3
              : p.status === "broken"
                ? 2
                : p.status === "working"
                  ? 1
                  : 0;
          return score(b) - score(a);
        },
        "Working First": (a, b) => {
          const score = (p: PluginData) =>
            p.status === "working"
              ? 3
              : p.status === "warning"
                ? 2
                : p.status === "broken"
                  ? 1
                  : 0;
          return score(b) - score(a);
        },

        // Keep name sorts
        "Name (A-Z)": (a, b) => a.name.localeCompare(b.name),
        "Name (Z-A)": (a, b) => b.name.localeCompare(a.name),
      }}
      items={props.plugins}
    />
  );
}

export default function Plugins() {
  useProxy(settings);
  const navigation = NavigationNative.useNavigation();

  const [mode, setMode] = React.useState<"installed" | "browse">("installed");
  const [plugins, setPlugins] = React.useState<PluginData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [installing, setInstalling] = React.useState<Set<string>>(new Set());
  const [refreshTick, setRefreshTick] = React.useState(0);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          size="sm"
          variant="secondary"
          text={mode === "installed" ? "Browse" : "Installed"}
          icon={findAssetId(mode === "installed" ? "LinkIcon" : "DownloadIcon")}
          onPress={() => setMode(mode === "installed" ? "browse" : "installed")}
        />
      ),
    });
  }, [navigation, mode]);

  const fetchPlugins = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await safeFetch(PLUGIN_URL);
      if (!response.ok)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const data = await response.json();

      let pluginList: PluginData[] = [];
      if (Array.isArray(data)) {
        pluginList = data;
      } else if (data.OFFICIAL_PLUGINS) {
        pluginList = data.OFFICIAL_PLUGINS;
      }

      setPlugins(pluginList);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setPlugins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (mode === "browse") {
      fetchPlugins();
    }
  }, [mode, fetchPlugins, refreshTick]);

  if (mode === "installed") {
    return (
      <InstalledPluginPage
        useItems={() => {
          useProxy(VdPluginManager.plugins);
          useObservable([pluginSettings]);

          // Vendetta plugins: preserve VdPluginManager.plugins insertion order,
          // but display most recently added first (reverse the keys).
          const vdIds = Object.keys(VdPluginManager.plugins || {});
          const vdPlugins = vdIds
            .slice()
            .reverse()
            .map((id) => unifyVdPlugin(VdPluginManager.plugins[id]));

          // Bunny external plugins which are installed (non-core).
          // Use the insertion order of pluginSettings so newly-installed plugins
          // (which add entries to pluginSettings) appear first.
          const installedBnIds = Object.keys(pluginSettings || {})
            .filter((id) => registeredPlugins.has(id) && !isCorePlugin(id))
            .slice()
            .reverse();

          const bnPlugins = installedBnIds
            .map((id) => registeredPlugins.get(id)!)
            .map(unifyBunnyPlugin);

          // Merge lists: show Vendetta-managed plugins first (recent first),
          // then Bunny-installed externals (recent first).
          const allPlugins = [...vdPlugins, ...bnPlugins];

          // Filter out core plugins from the list
          return allPlugins.filter((plugin) => !isCorePlugin(plugin.id));
        }}
        ListHeaderComponent={() => null}
        installAction={{
          label: "Install a plugin",
          fetchFn: async (url: string) => {
            return await VdPluginManager.installPlugin(url);
          },
        }}
      />
    );
  }

  // Browse mode
  if (error) {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 8,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card style={{ gap: 8 }}>
          <Text style={{ textAlign: "center" }} variant="heading-lg/bold">
            An error occurred while fetching the repository
          </Text>
          <Text
            style={{ textAlign: "center" }}
            variant="text-sm/medium"
            color="text-muted"
          >
            {error}
          </Text>
          <Button
            size="lg"
            text="Refetch"
            onPress={fetchPlugins}
            icon={findAssetId("RetryIcon")}
          />
        </Card>
      </View>
    );
  }

  return (
    <BrowsePluginPage
      plugins={plugins}
      installing={installing}
      setInstalling={setInstalling}
      setRefreshTick={setRefreshTick}
    />
  );
}
