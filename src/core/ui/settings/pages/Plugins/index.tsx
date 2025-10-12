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
import { BUNNY_PROXY_PREFIX, VD_PROXY_PREFIX } from "@lib/utils/constants";
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
} from "@metro/common/components";

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
    } catch (e) {
      openAlert(
        "bunny-plugin-install-failed",
        <AlertModalComponent
          title="Install Failed"
          content={`Unable to install plugin from '${addon.installUrl}':`}
          extraContent={
            <Card>
              <Text variant="text-md/normal">
                {e instanceof Error ? e.message : String(e)}
              </Text>
            </Card>
          }
          actions={<AlertActionButton text="Okay" variant="primary" />}
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

  const continueInstallation = async () => {
    if (
      !addon.installUrl.startsWith(VD_PROXY_PREFIX) &&
      !addon.installUrl.startsWith(BUNNY_PROXY_PREFIX) &&
      !settings.developerSettings
    ) {
      openAlert(
        "bunny-plugin-unproxied-confirmation",
        <AlertModalComponent
          title="Hold On!"
          content="You're trying to install a plugin from an unproxied external source. This means you're trusting the creator to run their code in this app without your knowledge. Are you sure you want to continue?"
          extraContent={
            <Card>
              <Text variant="text-md/bold">{addon.installUrl}</Text>
            </Card>
          }
          actions={
            <AlertActionsComponent>
              <AlertActionButton
                text="Continue"
                variant="primary"
                onPress={performInstall}
              />
              <AlertActionButton text="Cancel" variant="secondary" />
            </AlertActionsComponent>
          }
        />,
      );
    } else {
      performInstall();
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
        "Date (Newest)": (a, b) => 0,
        "Date (Oldest)": (a, b) => 0,
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

          const vdPlugins = Object.values(VdPluginManager.plugins).map(
            unifyVdPlugin,
          );

          // Core plugins (always shown first)
          const corePlugins = [...corePluginInstances.keys()]
            .map((id) => registeredPlugins.get(id))
            .filter(Boolean)
            .map(unifyBunnyPlugin);

          // Regular installed plugins (non-core)
          const bnPlugins = [...registeredPlugins.values()]
            .filter((p) => isPluginInstalled(p.id) && !isCorePlugin(p.id))
            .map(unifyBunnyPlugin);

          // Show only Vendetta plugins + non-core Bunny plugins (exclude core plugins)
          return [...vdPlugins, ...bnPlugins];
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
