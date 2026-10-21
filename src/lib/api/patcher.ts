const {
    after: _after,
    before: _before,
    instead: _instead
} = require("spitroast");

/** @internal */
export const _patcherDelaySymbol = Symbol.for("bunny.api.patcher.delay");

type Unpatcher = () => boolean;
type DelayCallback = (callback: (target: any) => void) => unknown;
type Thenable = { then: typeof Promise.prototype.then };

interface PatchFn<Callback> {
    (func: string, parent: any, callback: Callback, once?: boolean): Unpatcher;
    await(func: string, parent: Promise<unknown>, callback: Callback, once?: boolean): Unpatcher;
}

type BeforeFn = PatchFn<(args: any[]) => unknown | unknown[]>;
type InsteadFn = PatchFn<(args: any[], origFunc: Function) => unknown>;
type AfterFn = PatchFn<(args: any[], ret: any) => unknown>;

const noopUnpatch = () => false;

function captureStack(): string | undefined {
    try {
        // Trim everything above safeApply so the log shows the real caller
        // (the module/plugin that requested the patch).
        const err = new Error("patcher caller");
        if (typeof (Error as any).captureStackTrace === "function") {
            (Error as any).captureStackTrace(err, safeApply);
        }
        return err.stack;
    } catch {
        return undefined;
    }
}

function describeTarget(target: any): string {
    if (target === null) return "null";
    if (target === undefined) return "undefined";
    if (typeof target === "function") {
        return `Function(${target.displayName || target.name || "anonymous"})`;
    }
    if (typeof target === "object") {
        return target.constructor?.name ?? "Object";
    }
    return typeof target;
}

/**
 * spitroast throws "<method> is not a function in <Target>" when the target has no
 * such own method. On newer Discord builds this happens a lot (e.g. a component that
 * changed from a class with "render" to a plain function), and because lazy patches
 * are applied while a module initializes — which can happen *inside a React render* —
 * that throw turns into a full component crash and kills the whole screen.
 *
 * A patch that cannot be applied should never be fatal: skip it, log who asked for it
 * and keep going.
 */
function safeApply(
    this: any,
    fn: Function,
    args: any[],
    scheduledAt?: string,
    scheduledBy?: string | null,
) {
    try {
        return fn.apply(this, args);
    } catch (e: any) {
        const message = String(e?.message ?? "");
        if (!message.includes("is not a function in")) throw e;

        try {
            const plugin =
                scheduledBy ?? (globalThis as any).__SHIGGY_CURRENT_PLUGIN;
            console.warn(
                [
                    `[ShiggyCord] patcher: skipped ${String(args[0])}() on ${describeTarget(args[1])}` +
                        (plugin ? ` requested by plugin "${plugin}"` : ""),
                    `  reason: ${message}`,
                    "  scheduled at:",
                    scheduledAt ?? "(unavailable)",
                ].join("\n"),
            );
        } catch {}

        return noopUnpatch;
    }
}

function create(fn: Function) {
    function patchFn(this: any, ...args: any[]) {
        const scheduledAt = captureStack();
        // Plugin id at the moment the patch is requested (lazy patches are
        // applied much later, when this global is already gone).
        const scheduledBy: string | null = (globalThis as any).__SHIGGY_CURRENT_PLUGIN ?? null;

        if (typeof args[1]?.[_patcherDelaySymbol] === "function") {
            const delayCallback: DelayCallback = args[1][_patcherDelaySymbol];

            let cancel = false;
            let unpatch = () => cancel = true;

            delayCallback(target => {
                if (cancel) return;
                args[1] = target;
                unpatch = safeApply.call(this, fn, args, scheduledAt, scheduledBy);
            });

            return () => unpatch();
        }

        return safeApply.call(this, fn, args, scheduledAt, scheduledBy);
    }

    function promisePatchFn(this: any, ...args: [any, Thenable, ...any]) {
        const thenable = args[1];
        if (!thenable || !("then" in thenable)) throw new Error("target is not a then-able object");

        let cancel = false;
        let unpatch = () => cancel = true;

        thenable.then(target => {
            if (cancel) return;
            args[1] = target;
            unpatch = patchFn.apply(this, args);
        });

        return () => unpatch();
    }

    return Object.assign(patchFn, { await: promisePatchFn });
}

export const after = create(_after) as AfterFn;
export const before = create(_before) as BeforeFn;
export const instead = create(_instead) as InsteadFn;

/** @internal */
export default { after, before, instead };
