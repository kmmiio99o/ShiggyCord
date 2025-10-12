import { PluginInstanceInternal } from "@lib/addons/plugins/types";

interface CorePlugin {
  default: PluginInstanceInternal;
  preenabled: boolean;
}

// Called from @lib/plugins
export const getCorePlugins = (): Record<string, CorePlugin> => ({
  "bunny.quickinstall": { ...require("./quickinstall"), preenabled: true },
  "bunny.badges": require("./badges"),
  "bunny.notrack": { ...require("./notrack"), preenabled: true },
  "bunny.messagefix": { ...require("./messagefix") },
  "bunny.messagelogger": { ...require("./messagelogger"), preenabled: true },
  "bunny.fixembed": { ...require("./fixembed"), preenabled: true },
  "bunny.shiggyhelper": { ...require("./shiggyhelper") },
});

/**
 * @internal
 */
export function defineCorePlugin(
  instance: PluginInstanceInternal,
): PluginInstanceInternal {
  // @ts-expect-error
  instance[Symbol.for("bunny.core.plugin")] = true;
  return instance;
}
