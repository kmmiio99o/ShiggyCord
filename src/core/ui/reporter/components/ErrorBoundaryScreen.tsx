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

// Component entrypoint
export default function ErrorBoundaryScreen(props: {
  error: Error;
  rerender: () => void;
}) {
  // Hooks MUST be at the top level and unconditionally called.
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
          <Text
            variant="heading-md/extrabold"
            style={{
              color: tokens.colors.TEXT_NORMAL,
              marginBottom: 8,
              textAlign: "center",
            }}
            selectable
          >
            {props.error.message || "Unknown error occurred"}
          </Text>

          {hasStack(props.error) && <ErrorStackCard error={props.error} />}
          {isComponentStack(props.error) ? (
            <ErrorComponentStackCard
              componentStack={props.error.componentStack}
            />
          ) : null}
        </ScrollView>
        <Card style={{ gap: 12, paddingVertical: 16, alignItems: "center" }}>
          <Stack
            direction="horizontal"
            spacing={12}
            style={{ justifyContent: "center", width: "100%" }}
          >
            <Button
              text="Reload Discord"
              onPress={() => BundleUpdaterManager.reload()}
              style={{ flex: 1 }}
            />
            {!settings.safeMode?.enabled && (
              <Button
                text="Safe Mode"
                onPress={() => toggleSafeMode()}
                style={{ flex: 1 }}
              />
            )}
          </Stack>
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
            style={{ width: "100%" }}
          />
        </Card>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
