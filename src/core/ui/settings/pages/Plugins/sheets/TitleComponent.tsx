import React from "react";
import { UnifiedPluginModel } from "@core/ui/settings/pages/Plugins/models";
import { lazyDestructure } from "@lib/utils/lazy";
import { findByNameLazy, findByProps } from "@metro";
import { FluxUtils } from "@metro/common";
import { Avatar, AvatarPile, Text } from "@metro/common/components";
import { UserStore } from "@metro/common/stores";
import { View } from "react-native";

const showUserProfileActionSheet = findByNameLazy("showUserProfileActionSheet");
const { getUser: maybeFetchUser } = lazyDestructure(() =>
  findByProps("getUser", "fetchProfile"),
);

export default function TitleComponent({
  plugin,
}: {
  plugin: UnifiedPluginModel;
}) {
  const users: any[] = FluxUtils.useStateFromStoresArray([UserStore], () => {
    plugin.authors?.forEach((a) => a.id && maybeFetchUser(a.id));
    return plugin.authors?.map((a) => UserStore.getUser(a.id));
  });

  const { authors } = plugin;

  // Render all authors inline inside a single Text so punctuation and spacing are consistent.
  // Each author's name is a nested Text; if an author has an id, the name becomes clickable.
  const authorsTextNode = (
    <Text variant="text-md/medium" style={{ flexWrap: "wrap" }}>
      {(authors ?? []).map((author, idx) => (
        <React.Fragment key={author.id ?? author.name}>
          <Text
            variant="text-md/medium"
            onPress={
              author.id
                ? () => showUserProfileActionSheet({ userId: author.id })
                : undefined
            }
          >
            {author.name}
          </Text>
          {idx < (authors?.length ?? 0) - 1 ? ", " : ""}
        </React.Fragment>
      ))}
    </Text>
  );

  // openAuthorSelection removed — individual author names are now clickable inline

  return (
    <View style={{ gap: 4 }}>
      <View>
        <Text variant="heading-xl/semibold">{plugin.name}</Text>
      </View>
      <View style={{ flexDirection: "row", flexShrink: 1 }}>
        {authors?.length && (
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              paddingVertical: 4,
              paddingHorizontal: 8,
              backgroundColor: "#00000016",
              borderRadius: 32,
            }}
          >
            {users.length && (
              <AvatarPile
                size="xxsmall"
                names={plugin.authors?.map((a) => a.name)}
                totalCount={plugin.authors?.length}
              >
                {users.map((a) => (
                  <Avatar size="xxsmall" user={a} />
                ))}
              </AvatarPile>
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {authorsTextNode}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
