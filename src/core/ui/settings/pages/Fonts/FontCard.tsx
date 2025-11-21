import { Strings } from "@core/i18n";
import { CardWrapper } from "@core/ui/components/AddonCard";
import { showConfirmationAlert } from "@core/vendetta/alerts";
import { useProxy } from "@core/vendetta/storage";
import { FontDefinition, fonts, selectFont } from "@lib/addons/fonts";
import { findAssetId } from "@lib/api/assets";
import { BundleUpdaterManager } from "@lib/api/native/modules";
import { NavigationNative } from "@metro/common";
import { Button, Card, IconButton, Text } from "@metro/common/components";
import { View } from "react-native";

import FontEditor from "./FontEditor";

export default function FontCard({ item: font }: CardWrapper<FontDefinition>) {
  useProxy(fonts);

  const navigation = NavigationNative.useNavigation();
  const selected = fonts.__selected === font.name;

  return (
    <Card style={{ padding: 18, borderRadius: 16, backgroundColor: "#23272a" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text variant="heading-lg/bold">{font.name}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Button
            size="sm"
            variant={selected ? "secondary" : "primary"}
            text={selected ? "Unapply" : "Apply"}
            style={{ minWidth: 80, marginRight: 8 }}
            onPress={async () => {
              await selectFont(selected ? null : font.name);
              showConfirmationAlert({
                title: Strings.HOLD_UP,
                content: "Reload Discord to apply changes?",
                confirmText: Strings.RELOAD,
                cancelText: Strings.CANCEL,
                confirmColor: "red",
                onConfirm: BundleUpdaterManager.reload,
              });
            }}
          />
          <IconButton
            onPress={() => {
              navigation.push("BUNNY_CUSTOM_PAGE", {
                title: "Edit Font",
                render: () => <FontEditor name={font.name} />,
              });
            }}
            size="sm"
            variant="secondary"
            disabled={selected}
            icon={findAssetId("WrenchIcon")}
          />
        </View>
      </View>
    </Card>
  );
}
