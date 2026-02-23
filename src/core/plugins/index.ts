import { PluginInstanceInternal } from "@lib/addons/plugins/types";

interface CorePlugin {
  default: PluginInstanceInternal;
  preenabled: boolean;
  loader: () => PluginInstanceInternal;
}

type CorePluginRecord = Record<string, CorePlugin>;

function makeLazyPlugin(loaderFn: () => any, preenabled = true): CorePlugin {
  const container: any = {
    loader: () => {
      // loaderFn should synchronously require the module
      const mod = loaderFn();
      // module may be an object with `.default` or the instance directly
      const inst = mod && (mod.default ?? mod);
      return inst;
    },
    preenabled,
    get default() {
      // load and cache the instance on first access
      const inst = container.loader();
      Object.defineProperty(container, "default", { value: inst, writable: false, enumerable: true });
      return inst;
    },
  };

  return container as CorePlugin;
}

// Called from @lib/plugins
export const getCorePlugins = (): CorePluginRecord => ({
  "bunny.quickinstall": makeLazyPlugin(() => require("./quickinstall"), true),
  "bunny.badges": makeLazyPlugin(() => require("./badges")),
  "bunny.notrack": makeLazyPlugin(() => require("./notrack")),
  "bunny.messagefix": makeLazyPlugin(() => require("./messagefix")),
  "bunny.fixembed": makeLazyPlugin(() => require("./fixembed")),
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
