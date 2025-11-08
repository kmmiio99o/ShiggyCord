import { PluginInstanceInternal } from "@lib/addons/plugins/types";

interface CorePlugin {
  default: PluginInstanceInternal;
  preenabled: boolean;
}

// Called from @lib/plugins
export const getCorePlugins = (): Record<string, CorePlugin> => ({
  "bunny.quickinstall": { ...require("./quickinstall"), preenabled: true },
  "bunny.badges": require("./badges"),
  "bunny.enhancements": require("./shiggyenhancements"),
  "bunny.notrack": { ...require("./notrack"), preenabled: true },
  "bunny.messagefix": require("./messagefix"),
  "bunny.fixembed": require("./fixembed"),
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
