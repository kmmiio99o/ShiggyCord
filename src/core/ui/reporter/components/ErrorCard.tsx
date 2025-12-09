import { Strings } from "@core/i18n";
import { Codeblock } from "@lib/ui/components";
import { showSheet } from "@lib/ui/sheets";
import {
  Button,
  Card,
  Stack,
  Text,
  TwinButtons,
} from "@metro/common/components";
import { semanticColors } from "@ui/color";
import { ReactNode } from "react";
import { View } from "react-native";
import ErrorDetailsActionSheet from "./ErrorDetailsActionSheet";

export const INDEX_BUNDLE_FILE: string =
  window.HermesInternal.getFunctionLocation(window.__r).fileName;

interface ErrorCardProps {
  error: unknown;
  header?: string | ReactNode;
  onRetryRender?: () => void;
}

export default function ErrorCard(props: ErrorCardProps) {
  return (
    <Card>
      <Stack>
        {props.header && typeof props.header !== "string" ? (
          props.header
        ) : (
          <Text variant="heading-lg/bold">{props.header ?? Strings.UH_OH}</Text>
        )}
        <View
          style={{
            backgroundColor: semanticColors.BACKGROUND_SECONDARY,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: semanticColors.BACKGROUND_TERTIARY,
            padding: 12,
          }}
        >
          <Text style={{ color: semanticColors.TEXT_MUTED }}>
            {String(props.error)}
          </Text>
        </View>
        <TwinButtons>
          {props.onRetryRender && (
            <Button
              variant="destructive"
              // icon={findAssetId("RetryIcon")}
              text={Strings.RETRY_RENDER}
              onPress={props.onRetryRender}
            />
          )}
          {props.error instanceof Error ? (
            <Button
              text={"Details"}
              // icon={findAssetId("CircleInformationIcon-primary")}
              onPress={() =>
                showSheet(
                  "BunnyErrorDetailsActionSheet",
                  ErrorDetailsActionSheet,
                  { error: props.error as Error },
                )
              }
            />
          ) : null}
        </TwinButtons>
      </Stack>
    </Card>
  );
}
