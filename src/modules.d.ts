declare module "bunny-build-info" {
  const version: "1.1.5";
}

declare module "*.png" {
  const str: string;
  export default str;
}

/**
 * Optional runtime helper used by the startup sequence.
 * Declared here to satisfy the typechecker when the file isn't present.
 */
declare module "@core/debug/toggleCorePlugins" {
  type ToggleOptions = { offDuration?: number };
  const _default: (opts?: ToggleOptions) => Promise<void>;
  export default _default;
}
