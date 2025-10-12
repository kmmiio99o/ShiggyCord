import { before, after } from "@lib/api/patcher";
import { findAssetId } from "@lib/api/assets";
import { findInReactTree } from "@lib/utils";
import { FluxDispatcher, React } from "@metro/common";
import { showToast } from "@lib/ui/toasts";
import { findByProps } from "@metro";
import { regexEscaper, isEnabled } from "..";

const ActionSheet = findByProps("openLazy", "hideActionSheet");
const MessageStore = findByProps("getMessage", "getMessages");
const ChannelStore = findByProps("getChannel", "getDMFromUserId");
const ChannelMessages = findByProps("_channelMessages");
const { ActionSheetRow } = findByProps("ActionSheetRow");

/** @param {any} a */
function someFunc(a) {
  // return a?.props?.label == i18n?.Messages?.MESSAGE_ACTION_REPLY
  return a?.props?.label?.toLowerCase?.() == "reply";
}

export default () =>
  before("openLazy", ActionSheet, ([component, args, actionMessage]) => {
    if (isEnabled) {
      try {
        const message = actionMessage?.message;

        if (args !== "MessageLongPressActionSheet" || !message) return;

        component.then((/** @type {any} */ instance) => {
          const unpatch = after("default", instance, (_, comp) => {
            try {
              React.useEffect(
                () => () => {
                  unpatch();
                },
                [],
              );

              const buttons = findInReactTree(comp, (c) => c?.find?.(someFunc));
              if (!buttons) return comp;

              const position = Math.max(
                buttons.findIndex(someFunc),
                buttons.length - 1,
              );

              let originalMessage = null;

              if (message?.channel_id && message?.id) {
                originalMessage = MessageStore.getMessage(
                  message?.channel_id,
                  message?.id,
                );

                if (!originalMessage) {
                  const channel = ChannelMessages.get(message?.channel_id);
                  originalMessage = channel?.get(message?.id);
                }
              }

              if (!originalMessage) return comp;

              const escapedBuffer = regexEscaper("`[ EDITED ]`\n\n");

              const separator = new RegExp(escapedBuffer, "gmi");
              const checkIfBufferExist = separator.test(message.content);

              if (checkIfBufferExist) {
                const targetPos = position || 1;

                const actionRow = React.createElement(
                  ActionSheetRow,
                  {
                    label: "Remove Edit History",
                    subLabel: "Added by Message Logger",
                    icon: React.createElement(ActionSheetRow.Icon, {
                      source: findAssetId("ic_edit_24px"),
                    }),
                    onPress: () => {
                      try {
                        const lats = message?.content?.split(separator);
                        const targetMessage = lats[lats.length - 1];

                        FluxDispatcher.dispatch({
                          type: "MESSAGE_UPDATE",
                          message: {
                            ...message,
                            message_reference:
                              message?.message_reference ||
                              message?.messageReference ||
                              null,
                            content: `${targetMessage}`,
                            guild_id: ChannelStore.getChannel(
                              originalMessage.channel_id,
                            ).guild_id,
                          },
                          otherPluginBypass: true,
                        });

                        ActionSheet.hideActionSheet();
                        showToast(
                          "History Removed",
                          findAssetId("ic_edit_24px"),
                        );
                      } catch (ex) {
                        showToast(
                          "[Message Logger] Failed to remove edit history",
                        );
                        console.error(
                          "[Message Logger] Error while removing history",
                          ex,
                        );
                      }
                    },
                  },
                  null,
                );

                buttons.splice(targetPos, 0, actionRow);
              }
            } catch (e) {
              showToast(
                "[Message Logger] Crash on ActionSheet, check debug log for more info",
              );
              console.error(
                "[Message Logger] Error > ActionSheet:Component Patch\n",
                e,
              );
            }
          });
        });
      } catch (e) {
        showToast(
          "[Message Logger] Crash on ActionSheet, check debug log for more info",
        );
        console.error("[Message Logger] Error > ActionSheet Patch\n", e);
      }
    }
  });
