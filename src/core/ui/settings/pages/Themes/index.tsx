import { formatString, Strings } from "@core/i18n";
import AddonPage from "@core/ui/components/AddonPage";
import ThemeCard from "@core/ui/settings/pages/Themes/ThemeCard";
import { useProxy } from "@core/vendetta/storage";
import {
  getCurrentTheme,
  installTheme,
  removeTheme,
  themes,
  VdThemeInfo,
} from "@lib/addons/themes";
import { colorsPref } from "@lib/addons/themes/colors/preferences";
import { updateBunnyColor } from "@lib/addons/themes/colors/updater";
import { Author } from "@lib/addons/types";
import { findAssetId } from "@lib/api/assets";
import { settings } from "@lib/api/settings";
import { useObservable } from "@lib/api/storage";
import { lazyDestructure } from "@lib/utils/lazy";
import safeFetch from "@lib/utils/safeFetch";
import Search from "@ui/components/Search";
import { findByProps } from "@metro";
import { NavigationNative, React, clipboard } from "@metro/common";
import { showSheet } from "@lib/ui/sheets";
import {
  ActionSheet,
  BottomSheetTitleHeader,
  Button,
  Card,
  FlashList,
  IconButton,
  Stack,
  TableRowGroup,
  TableSwitchRow,
  TableRowIcon,
  Text,
  AlertModal,
  AlertActions,
  AlertActionButton,
} from "@metro/common/components";
import { View, Image } from "react-native";

const { useReducer } = React;

const { showSimpleActionSheet, hideActionSheet } = lazyDestructure(() =>
  findByProps("showSimpleActionSheet"),
);

interface BaseAddonData {
  name: string;
  description: string;
  authors: string[];
  installUrl: string;
}

interface ThemeData extends BaseAddonData {}

enum Sort {
  DateNewest = "Date Added (Newest First)",
  DateOldest = "Date Added (Oldest First)",
  NameAZ = "Name (A-Z)",
  NameZA = "Name (Z-A)",
}

const THEME_URL =
  "https://raw.githubusercontent.com/kmmiio99o/theme-marketplace/refs/heads/main/themes.json";

function BrowserThemeCard({
  theme,
  installing,
  setInstalling,
  setRefreshTick,
}: {
  theme: ThemeData;
  installing: Set<string>;
  setInstalling: React.Dispatch<React.SetStateAction<Set<string>>>;
  setRefreshTick: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { name, description, authors, installUrl } = theme;

  useProxy(themes);

  // Use installUrl as the theme ID (themes are keyed by URL)
  const themeId = installUrl;
  const isInstalling = installing.has(themeId);
  const isInstalled = themes[themeId];
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [rotation, setRotation] = React.useState(0);
  const [pulse, setPulse] = React.useState(1);

  const handleInstall = async () => {
    if (isInstalling) return;

    setInstalling((prev) => new Set([...prev, themeId]));

    // Start animation
    const animationInterval = setInterval(() => {
      setRotation((prev) => (prev + 15) % 360);
      setPulse((prev) => 0.8 + 0.2 * Math.sin(Date.now() / 200));
      forceUpdate();
    }, 100);

    try {
      await installTheme(themeId);
      setRefreshTick((prev) => prev + 1);
      forceUpdate();
    } catch (e) {
      console.error("Failed to install theme:", e);
    } finally {
      clearInterval(animationInterval);
      setRotation(0);
      setPulse(1);
      setInstalling((prev) => {
        const newSet = new Set(prev);
        newSet.delete(themeId);
        return newSet;
      });
    }
  };

  const handleUninstall = async () => {
    try {
      await removeTheme(themeId);
      setRefreshTick((prev) => prev + 1);
      forceUpdate();
    } catch (e) {
      console.error("Failed to uninstall theme:", e);
    }
  };

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
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <IconButton
              size="sm"
              variant="secondary"
              icon={findAssetId("MoreHorizontalIcon")}
              onPress={() => {
                showSimpleActionSheet({
                  key: "ThemeShareSheet",
                  header: {
                    title: "Share Theme",
                  },
                  options: [
                    {
                      label: "Copy Install URL",
                      onPress: () => {
                        clipboard.setString(themeId);
                        // URL copied
                      },
                    },
                  ],
                });
              }}
            />
            {isInstalled ? (
              <Button
                size="sm"
                text="Uninstall"
                variant="destructive"
                icon={findAssetId("TrashIcon")}
                onPress={handleUninstall}
              />
            ) : (
              <View style={{ opacity: pulse }}>
                <Button
                  size="sm"
                  text={isInstalling ? "Installing..." : "Install"}
                  variant="primary"
                  disabled={isInstalling}
                  loading={isInstalling}
                  icon={
                    isInstalling ? (
                      <View
                        style={{ transform: [{ rotate: `${rotation}deg` }] }}
                      >
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
            )}
          </View>
        </View>
        <Text variant="text-md/medium">{description}</Text>
      </Stack>
    </Card>
  );
}

interface BrowseThemePageProps {
  themes: ThemeData[];
  installing: Set<string>;
  setInstalling: React.Dispatch<React.SetStateAction<Set<string>>>;
  setRefreshTick: React.Dispatch<React.SetStateAction<number>>;
}

function BrowseThemePage(props: BrowseThemePageProps) {
  useProxy(themes);

  return (
    <AddonPage<ThemeData>
      CardComponent={({ item }) => (
        <BrowserThemeCard
          theme={item}
          installing={props.installing}
          setInstalling={props.setInstalling}
          setRefreshTick={props.setRefreshTick}
        />
      )}
      title={Strings.THEMES}
      searchKeywords={[
        "name",
        "description",
        (t) => (t.authors || []).join(", "),
      ]}
      sortOptions={{
        "Date (Newest)": (a, b) => 0,
        "Date (Oldest)": (a, b) => 0,
        "Name (A-Z)": (a, b) => a.name.localeCompare(b.name),
        "Name (Z-A)": (a, b) => b.name.localeCompare(a.name),
      }}
      items={props.themes}
    />
  );
}

/**
 * Theme options have been changed from radio groups to individual switches
 * for better UX. Each option can now be toggled independently.
 */

export default function Themes() {
  useProxy(settings);
  useProxy(themes);
  const navigation = NavigationNative.useNavigation();

  const [mode, setMode] = React.useState<"installed" | "browse">("installed");
  const [themesList, setThemesList] = React.useState<ThemeData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [installing, setInstalling] = React.useState<Set<string>>(new Set());
  const [refreshTick, setRefreshTick] = React.useState(0);

  React.useEffect(() => {
    const headerButtons = [];

    // Add mode toggle button
    headerButtons.push(
      <Button
        key="mode-toggle"
        size="sm"
        variant="secondary"
        text={mode === "installed" ? "Browse" : "Installed"}
        icon={findAssetId(mode === "installed" ? "LinkIcon" : "DownloadIcon")}
        onPress={() => setMode(mode === "installed" ? "browse" : "installed")}
      />,
    );

    // Add options button (always visible)
    headerButtons.push(
      <IconButton
        key="options"
        size="sm"
        variant="secondary"
        icon={findAssetId("MoreHorizontalIcon")}
        onPress={() =>
          showSheet("ThemeOptionsSheet", () => {
            useObservable([colorsPref]);

            return (
              <ActionSheet>
                <BottomSheetTitleHeader title="Options" />
                <View style={{ paddingVertical: 20, gap: 12 }}>
                  <TableRowGroup title="Override Theme Type">
                    <TableSwitchRow
                      label="Auto"
                      icon={<TableRowIcon source={findAssetId("RobotIcon")} />}
                      value={!colorsPref.type}
                      onValueChange={(enabled: boolean) => {
                        if (enabled) {
                          colorsPref.type = undefined;
                        } else {
                          colorsPref.type = "dark";
                        }
                        getCurrentTheme()?.data &&
                          updateBunnyColor(getCurrentTheme()!.data!, {
                            update: true,
                          });
                      }}
                    />
                    <TableSwitchRow
                      label="Dark"
                      icon={
                        <TableRowIcon source={findAssetId("ThemeDarkIcon")} />
                      }
                      value={colorsPref.type === "dark"}
                      onValueChange={(enabled: boolean) => {
                        colorsPref.type = enabled ? "dark" : undefined;
                        getCurrentTheme()?.data &&
                          updateBunnyColor(getCurrentTheme()!.data!, {
                            update: true,
                          });
                      }}
                    />
                    <TableSwitchRow
                      label="Light"
                      icon={
                        <TableRowIcon source={findAssetId("ThemeLightIcon")} />
                      }
                      value={colorsPref.type === "light"}
                      onValueChange={(enabled: boolean) => {
                        colorsPref.type = enabled ? "light" : undefined;
                        getCurrentTheme()?.data &&
                          updateBunnyColor(getCurrentTheme()!.data!, {
                            update: true,
                          });
                      }}
                    />
                  </TableRowGroup>
                  <TableRowGroup title="Chat Background">
                    <TableSwitchRow
                      label="Show Background"
                      icon={<TableRowIcon source={findAssetId("ImageIcon")} />}
                      value={!colorsPref.customBackground}
                      onValueChange={(enabled: boolean) => {
                        colorsPref.customBackground = enabled ? null : "hidden";
                      }}
                    />
                    <TableSwitchRow
                      label="Hide Background"
                      icon={<TableRowIcon source={findAssetId("DenyIcon")} />}
                      value={colorsPref.customBackground === "hidden"}
                      onValueChange={(enabled: boolean) => {
                        colorsPref.customBackground = enabled ? "hidden" : null;
                      }}
                    />
                  </TableRowGroup>
                </View>
              </ActionSheet>
            );
          })
        }
      />,
    );

    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 8 }}>{headerButtons}</View>
      ),
    });
  }, [navigation, mode]);

  const fetchThemes = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await safeFetch(THEME_URL);
      if (!response.ok)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const data = await response.json();

      let themeList: ThemeData[] = [];
      if (Array.isArray(data)) {
        themeList = data;
      } else if (data.OFFICIAL_THEMES) {
        themeList = data.OFFICIAL_THEMES;
      } else if (data.themes) {
        themeList = data.themes;
      } else if (data.THEMES) {
        themeList = data.THEMES;
      } else if (data.items) {
        themeList = data.items;
      }

      setThemesList(themeList);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setThemesList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (mode === "browse") {
      fetchThemes();
    }
  }, [mode, fetchThemes, refreshTick]);

  if (mode === "installed") {
    return (
      <AddonPage<VdThemeInfo>
        title={Strings.THEMES}
        searchKeywords={[
          "data.name",
          "data.description",
          (p) => p.data.authors?.map((a: Author) => a.name).join(", ") ?? "",
        ]}
        sortOptions={{
          "Name (A-Z)": (a, b) => a.data.name.localeCompare(b.data.name),
          "Name (Z-A)": (a, b) => b.data.name.localeCompare(a.data.name),
        }}
        installAction={{
          label: "Install a theme",
          fetchFn: installTheme,
        }}
        items={Object.values(themes)}
        safeModeHint={{
          message: formatString("SAFE_MODE_NOTICE_THEMES", {
            enabled: Boolean(settings.safeMode?.currentThemeId),
          }),
          footer: settings.safeMode?.currentThemeId && (
            <Button
              size="small"
              text={Strings.DISABLE_THEME}
              onPress={() => delete settings.safeMode?.currentThemeId}
              style={{ marginTop: 8 }}
            />
          ),
        }}
        CardComponent={ThemeCard}
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
            onPress={fetchThemes}
            icon={findAssetId("RetryIcon")}
          />
        </Card>
      </View>
    );
  }

  return (
    <BrowseThemePage
      themes={themesList}
      installing={installing}
      setInstalling={setInstalling}
      setRefreshTick={setRefreshTick}
    />
  );
}
