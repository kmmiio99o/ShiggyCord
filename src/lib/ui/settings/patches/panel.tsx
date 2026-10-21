import { after } from "@lib/api/patcher";
import { findInReactTree } from "@lib/utils";
import { i18n, NavigationNative } from "@metro/common";
import {
  LegacyFormDivider,
  LegacyFormIcon,
  LegacyFormRow,
  LegacyFormSection,
} from "@metro/common/components";
import { findByNameLazy } from "@metro/wrappers";
import { registeredSections } from "@ui/settings";

import { CustomPageRenderer, wrapOnPress } from "./shared";

function SettingsSection() {
  const navigation = NavigationNative.useNavigation();

  return (
    <>
      {Object.keys(registeredSections).map(
        (sect) =>
          registeredSections[sect].length > 0 && (
            <LegacyFormSection key={sect} title={sect}>
              {/** Is usePredicate here safe? */}
              {registeredSections[sect]
                .filter((r) => r.usePredicate?.() ?? true)
                .map((row, i, arr) => (
                  <>
                    <LegacyFormRow
                      label={row.title()}
                      leading={<LegacyFormIcon source={row.icon} />}
                      trailing={
                        <LegacyFormRow.Arrow
                          label={row.useTrailing?.() || undefined}
                        />
                      }
                      onPress={wrapOnPress(
                        row.onPress,
                        navigation,
                        row.render,
                        row.title(),
                      )}
                    />
                    {i !== arr.length - 1 && <LegacyFormDivider />}
                  </>
                ))}
            </LegacyFormSection>
          ),
      )}
    </>
  );
}

export function patchPanelUI(unpatches: (() => void | boolean)[]) {
  try {
    unpatches.push(
      after("default", findByNameLazy("getScreens", false), (_a, screens) => ({
        ...screens,
        VendettaCustomPage: {
          title: "ShiggyCord",
          render: () => <CustomPageRenderer />,
        },
        BUNNY_CUSTOM_PAGE: {
          title: "ShiggyCord",
          render: () => <CustomPageRenderer />,
        },
        SHIGGYCORD_CUSTOM_PAGE: {
          title: "ShiggyCord",
          render: () => <CustomPageRenderer />,
        },
      })),
    );

    const unpatch = after(
      "default",
      findByNameLazy("UserSettingsOverviewWrapper", false),
      (_a, ret) => {
        // Never let a failed lookup crash the settings screen: on newer Discord
        // builds the overview may be function-based and "type.prototype" may be
        // undefined, which makes "after(...)" throw inside the patched render.
        try {
          const UserSettingsOverview = findInReactTree(
            ret?.props?.children,
            (n) => n?.type?.name === "UserSettingsOverview",
          );

          const proto = UserSettingsOverview?.type?.prototype;
          if (!proto) return;

          if (typeof proto.renderSupportAndAcknowledgements === "function") {
            unpatches.push(
              after(
                "renderSupportAndAcknowledgements",
                proto,
                (_args, { props: { children } }: any) => {
                  const index = children.findIndex(
                    (c: any) => c?.type?.name === "UploadLogsButton",
                  );
                  if (index !== -1) children.splice(index, 1);
                },
              ),
            );
          }

          if (typeof proto.render !== "function") return;

          unpatches.push(
            after("render", proto, (_args, res) => {
              try {
                const titles = [
                  i18n.Messages.BILLING_SETTINGS,
                  i18n.Messages.PREMIUM_SETTINGS,
                ];

                const sections =
                  findInReactTree(
                    res.props.children,
                    (n) => n?.children?.[1]?.type === LegacyFormSection,
                  )?.children || res.props.children;

                if (sections) {
                  const index = sections.findIndex((c: any) =>
                    titles.includes(c?.props.label),
                  );
                  sections.splice(-~index || 4, 0, <SettingsSection />);
                }
              } catch {}
            }),
          );
        } catch {}
      },
      true,
    );

    unpatches.push(unpatch);
  } catch {}
}
