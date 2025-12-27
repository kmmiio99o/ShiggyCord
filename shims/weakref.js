// @ts-nocheck
/**
 * WeakRef / FinalizationRegistry shim
 *
 * Purpose:
 * - Provide a safe fallback when the runtime doesn't implement WeakRef or FinalizationRegistry.
 * - This fallback avoids a ReferenceError and keeps code paths functional, but it does NOT
 *   emulate true weak-reference GC behavior. Use it only as a compatibility fallback.
 *
 */

let _shimWarned = false;

function _warnOnce(msg) {
    if (!_shimWarned) {
        // keep this quiet by default; print only when fallback is actually used
        try {
            // Prefer console.warn when available
            if (typeof console !== "undefined" && typeof console.warn === "function") {
                console.warn(`[weakref-shim] ${msg}`);
            }
        } catch (_) {}
        _shimWarned = true;
    }
}

/**
 * WeakRef fallback
 * - Keeps a strong reference to the target (so it will not be GC'd).
 * - Implements the minimal `deref()` API.
 */
class WeakRefFallback {
    constructor(value) {
        // Keep a strong reference: this is *not* weak.
        this.__value = value;
        _warnOnce(
            "WeakRef is not available in this runtime. Using a strong-reference fallback — memory usage/semantics may differ."
        );
    }

    deref() {
        return this.__value;
    }
}

/**
 * FinalizationRegistry fallback
 * - No-op registry: register/unregister do nothing.
 * - Implement `cleanupSome` as a best-effort sync call when a callback is provided,
 *   but it cannot be tied to GC.
 */
class FinalizationRegistryFallback {
    constructor(cleanupCallback) {
        // store callback to allow optional manual invocation via cleanupSome
        this.__cleanupCallback = typeof cleanupCallback === "function" ? cleanupCallback : null;
        _warnOnce(
            "FinalizationRegistry is not available in this runtime. Using a no-op fallback — finalizers will not run based on GC."
        );
    }

    /**
     * register(target, heldValue, unregisterToken?)
     * - No-op in fallback. We keep no strong references here on purpose (can't emulate GC).
     */
    register(_target /*, _heldValue, _unregisterToken */) {
        // intentionally no-op
    }

    /**
     * unregister(unregisterToken)
     * - No-op in fallback.
     */
    unregister(_unregisterToken) {
        // intentionally no-op
    }

    /**
     * cleanupSome(callback?)
     * - If provided a callback or a stored cleanup callback exists, call it immediately.
     * - This is NOT equivalent to real FinalizationRegistry cleanup; it's only a manual helper.
     */
    cleanupSome(callback) {
        const cb = typeof callback === "function" ? callback : this.__cleanupCallback;
        if (typeof cb === "function") {
            try {
                cb();
            } catch (e) {
                try {
                    if (typeof console !== "undefined" && typeof console.error === "function") {
                        console.error("[weakref-shim] error running cleanupSome callback:", e);
                    }
                } catch (_) {}
            }
        }
    }
}

// If native implementations exist, prefer them; otherwise install fallbacks.
// We assign to globalThis so code using `WeakRef`/`FinalizationRegistry` globals doesn't crash.
const NativeWeakRef =
    typeof globalThis !== "undefined" && typeof globalThis.WeakRef === "function" ? globalThis.WeakRef : undefined;

const NativeFinalizationRegistry =
    typeof globalThis !== "undefined" && typeof globalThis.FinalizationRegistry === "function"
        ? globalThis.FinalizationRegistry
        : undefined;

const WeakRefImpl = NativeWeakRef ?? WeakRefFallback;
const FinalizationRegistryImpl = NativeFinalizationRegistry ?? FinalizationRegistryFallback;

try {
    if (typeof globalThis !== "undefined") {
        if (typeof globalThis.WeakRef === "undefined") {
            // Install fallback
            globalThis.WeakRef = WeakRefImpl;
        }
        if (typeof globalThis.FinalizationRegistry === "undefined") {
            globalThis.FinalizationRegistry = FinalizationRegistryImpl;
        }
    }
} catch (e) {
    // Some embedder environments may forbid writing globals; ignore in that case.
    _warnOnce("Unable to assign WeakRef/FinalizationRegistry to globalThis: " + (e && e.message));
}

// Export the implementations so the inject mechanism (or explicit imports) can reference them.
// Export names are sorted to satisfy lint rules that require sorted exports.
export { FinalizationRegistryImpl as FinalizationRegistry, WeakRefImpl as WeakRef };
