import React from "react";
import { hasStack, isComponentStack } from "@core/ui/reporter/utils/isStack";
import { getDebugInfo, toggleSafeMode } from "@lib/api/debug";
import { BundleUpdaterManager } from "@lib/api/native/modules";
import { settings } from "@lib/api/settings";
import { Codeblock } from "@lib/ui/components";
import { createStyles } from "@lib/ui/styles";
import { tokens } from "@metro/common";
import { showToast } from "@lib/ui/toasts";
import {
  Button,
  SafeAreaProvider,
  SafeAreaView,
  Text,
  TableRowGroup,
  TableRow,
} from "@metro/common/components";
import { ScrollView, View, Clipboard } from "react-native";

import ErrorComponentStackCard from "./ErrorComponentStackCard";
import ErrorStackCard from "./ErrorStackCard";

const useStyles = createStyles(() => ({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.BG_BASE_SECONDARY,
  },
  scrollContent: {
    paddingBottom: 100, // Extra space for fixed buttons
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: tokens.colors.BG_BASE_SECONDARY,
  },
  headerText: {
    textAlign: "center",
    marginBottom: 8,
  },
  debugInfo: {
    fontSize: 12,
    color: tokens.colors.TEXT_MUTED,
    textAlign: "center",
    marginTop: 8,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: tokens.colors.BG_MOD_STRONG,
    padding: 16,
    gap: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  fullButton: {
    flex: 1,
  },
  errorMessageRow: {
    backgroundColor: tokens.colors.BG_MOD_FAINT,
    borderRadius: 8,
    marginVertical: 4,
    overflow: "hidden",
  },
  centeredErrorText: {
    color: tokens.colors.TEXT_DANGER,
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 8,
    flex: 1,
  },
}));

export default function ErrorBoundaryScreen(props: {
  error: Error;
  rerender: () => void;
}) {
  const styles = useStyles();
  const debugInfo = getDebugInfo();

  const copyErrorDetails = () => {
    const errorText = `Error: ${props.error.message}\n\nStack: ${props.error.stack || "No stack trace"}`;
    Clipboard.setString(errorText);
    showToast("Error details copied");
  };

  const copyStackTrace = () => {
    if (props.error.stack) {
      Clipboard.setString(props.error.stack);
      showToast("Stack trace copied");
    } else {
      showToast("No stack trace available");
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header - Using the same approach as About.tsx */}
          <View style={styles.header}>
            <Text variant="heading-xl/bold" style={styles.headerText}>
              Uh oh.
            </Text>
            <Text variant="text-md/normal" style={styles.headerText}>
              A crash occurred while rendering a component
            </Text>
            <Text style={styles.debugInfo}>
              {debugInfo.os.name} • Discord {debugInfo.discord.version} •{" "}
              {debugInfo.bunny.version}
            </Text>
          </View>

          {/* Error Details */}
          <View style={styles.section}>
            <TableRowGroup title="Error Details">
              <View style={styles.errorMessageRow}>
                <TableRow
                  label={
                    <Text style={styles.centeredErrorText}>
                      {props.error.message || "Unknown error occurred"}
                    </Text>
                  }
                  onPress={copyErrorDetails}
                  style={{ justifyContent: "center" }}
                />
              </View>
            </TableRowGroup>
          </View>

          {/* Stack Traces */}
          {hasStack(props.error) && (
            <View style={styles.section}>
              <TableRowGroup title="JavaScript Stack Trace">
                <View style={{ paddingHorizontal: 8, paddingBottom: 8 }}>
                  <ErrorStackCard error={props.error} />
                </View>
              </TableRowGroup>
            </View>
          )}

          {isComponentStack(props.error) && (
            <View style={styles.section}>
              <TableRowGroup title="Component Stack">
                <View style={{ paddingHorizontal: 8, paddingBottom: 8 }}>
                  <ErrorComponentStackCard
                    componentStack={props.error.componentStack}
                  />
                </View>
              </TableRowGroup>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.section}>
            <TableRowGroup title="Quick Actions">
              <TableRow label="Copy Error Message" onPress={copyErrorDetails} />
              {props.error.stack && (
                <TableRow label="Copy Stack Trace" onPress={copyStackTrace} />
              )}
            </TableRowGroup>
          </View>
        </ScrollView>

        {/* Fixed Bottom Buttons - Always visible */}
        <View style={styles.fixedButtonContainer}>
          <View style={styles.buttonRow}>
            <Button
              text="Reload Discord"
              style={styles.fullButton}
              onPress={() => BundleUpdaterManager.reload()}
            />
            {!settings.safeMode?.enabled && (
              <Button
                text="Safe Mode"
                variant="secondary"
                style={styles.fullButton}
                onPress={() => toggleSafeMode()}
              />
            )}
          </View>

          <View style={styles.buttonRow}>
            <Button
              text="Retry Render"
              variant="destructive"
              style={{ flex: 1 }}
              onPress={() => {
                try {
                  console.log(
                    "[ShiggyCord][ErrorBoundaryScreen] Retry Render clicked",
                  );
                } catch {}
                props.rerender();
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
