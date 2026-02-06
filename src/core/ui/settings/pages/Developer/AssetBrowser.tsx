import AssetDisplay from "@core/ui/settings/pages/Developer/AssetDisplay";
import { iterateAssets } from "@lib/api/assets";
import { findAssetId } from "@lib/api/assets";
import { Strings } from "@core/i18n";
import { IconButton, TableCheckboxRow, TableRowGroup, ActionSheet, BottomSheetTitleHeader } from "@metro/common/components";
import { ErrorBoundary, Search } from "@ui/components";
import { showSheet } from "@lib/ui/sheets";
import { useProxy, createProxy } from "@core/vendetta/storage";
import { useState, useMemo, useCallback } from "react";
import { FlatList, View } from "react-native";

// Asset type categories
const DISPLAYABLE_IMAGE_TYPES = new Set(["png", "jpg", "jpeg", "svg", "gif"]);
const DISPLAYABLE_TEXT_TYPES = new Set(["jsona", "json", "lottie"]);

// Define all available filters with their display names
const FILTER_OPTIONS = [
  { id: "images", label: "Images (PNG, JPG, SVG, GIF)", types: DISPLAYABLE_IMAGE_TYPES, defaultEnabled: true },
  { id: "text", label: "Text Types (JSON, JSONA, Lottie)", types: DISPLAYABLE_TEXT_TYPES, defaultEnabled: false },
];

const { proxy: assetBrowserStorage } = createProxy({
  enabledFilters: {
    images: true,
    text: false,
  }
});

export default function AssetBrowser() {
  const [search, setSearch] = useState("");
  const [updateTick, setUpdateTick] = useState(0);

  // Use useProxy to make the state reactive
  useProxy(assetBrowserStorage);

  const getFilteredAssets = useCallback(() => {
    return Array.from(iterateAssets()).filter((asset) => {
      const type = String(asset.type ?? "").toLowerCase();

      // Check if this asset type is enabled in any filter
      for (const filter of FILTER_OPTIONS) {
        if (assetBrowserStorage.enabledFilters[filter.id as keyof typeof assetBrowserStorage.enabledFilters] && filter.types.has(type)) {
          return true;
        }
      }
      return false;
    });
  }, [updateTick]);

  const all = useMemo(() => getFilteredAssets(), [getFilteredAssets]);

  const toggleFilter = (filterId: string) => {
    assetBrowserStorage.enabledFilters[filterId as keyof typeof assetBrowserStorage.enabledFilters] = !assetBrowserStorage.enabledFilters[filterId as keyof typeof assetBrowserStorage.enabledFilters];
    setUpdateTick(prev => prev + 1);
  };

  const handleFilterPress = () => {
    showSheet("AssetBrowserFilter", () => {
      useProxy(assetBrowserStorage);

      return (
        <ActionSheet>
          <BottomSheetTitleHeader title={Strings.ASSET_TYPES} />
          <View style={{ paddingVertical: 12, paddingHorizontal: 8 }}>
            <TableRowGroup title="">
              {FILTER_OPTIONS.map(filter => (
                <TableCheckboxRow
                  key={filter.id}
                  label={filter.label}
                  checked={assetBrowserStorage.enabledFilters[filter.id as keyof typeof assetBrowserStorage.enabledFilters]}
                  onPress={() => toggleFilter(filter.id)}
                />
              ))}
            </TableRowGroup>
          </View>
        </ActionSheet>
      );
    });
  };

  return (
    <ErrorBoundary>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", margin: 10, gap: 8, alignItems: "center" }}>
          <Search
            style={{ flex: 1 }}
            isRound
            onChangeText={(v: string) => setSearch(v)}
          />
          <IconButton
            icon={findAssetId("FileIcon")}
            variant="tertiary"
            onPress={handleFilterPress}
          />
        </View>
        <View
          style={{
            flex: 1,
            borderRadius: 16,
            paddingHorizontal: 12,
            overflow: "hidden",
            backgroundColor: "transparent",
          }}
        >
          <FlatList
            data={all.filter(
              (a) => (a.name.includes(search) || a.id.toString() === search),
            )}
            renderItem={({ item }: any) => <AssetDisplay asset={item} />}
            contentContainerStyle={{
              overflow: "hidden",
              backgroundColor: "transparent",
              borderRadius: 16,
            }}
            keyExtractor={(a) => a.name}
          />
        </View>
      </View>
    </ErrorBoundary>
  );
}
