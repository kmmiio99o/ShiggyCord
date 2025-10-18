import ErrorBoundaryScreen from "@core/ui/reporter/components/ErrorBoundaryScreen";
import { after } from "@lib/api/patcher";
import { _lazyContextSymbol } from "@metro/lazy";
import { LazyModuleContext } from "@metro/types";
import { findByNameLazy } from "@metro/wrappers";

/**
 * Try to resolve the ErrorBoundary prototype context in a resilient way.
 * Some Discord versions / builds may expose modules under slightly different
 * names; attempt lookup but fail gracefully if not found.
 */
function getErrorBoundaryContext(): Promise<any> {
  try {
    const ctxt: LazyModuleContext =
      findByNameLazy("ErrorBoundary")[_lazyContextSymbol];
    if (ctxt) {
      return new Promise((resolve) =>
        ctxt.getExports((exp: any) => resolve(exp.prototype)),
      );
    }
  } catch (e) {
    // silent
  }

  // Best-effort fallback: resolve to null so callers can handle absence.
  return Promise.reject(new Error("ErrorBoundary context not found"));
}

/**
 * Patch Discord's ErrorBoundary.render to return ShiggyCord's custom screen.
 * Add defensive logging and fallback behavior so the patch won't break startup
 * if lookup fails. Also register lightweight global handlers to capture
 * uncaught errors for debugging.
 */
export default function patchErrorBoundary() {
  try {
    console.log("[ShiggyCord] patchErrorBoundary: registering");
  } catch {}

  // Attempt to attach after the ErrorBoundary render. If the context lookup
  // fails, the promise will reject and the patcher will not install the patch,
  // which is preferable to throwing during startup.
  const ctxPromise = getErrorBoundaryContext().catch((err) => {
    try {
      console.warn(
        "[ShiggyCord] patchErrorBoundary: context lookup failed",
        err,
      );
    } catch {}
    // Return null so after.await receives a thenable; the patcher wrapper will handle it.
    return null;
  });

  const unpatch = after.await("render", ctxPromise, function (this: any) {
    try {
      if (!this || !this.state || !this.state.error) return;
      try {
        console.log(
          "[ShiggyCord] patchErrorBoundary: rendering custom error screen",
          this.state.error,
        );
      } catch {}
      return (
        <ErrorBoundaryScreen
          error={this.state.error}
          // try to reset state in a way that plays nicely with various ErrorBoundary shapes
          rerender={() => {
            try {
              // common variant: some boundaries track `hasErr` or `error`
              this.setState?.({ info: null, error: null, hasErr: false });
            } catch {
              try {
                this.setState?.({ error: null });
              } catch {}
            }
          }}
        />
      );
    } catch (e) {
      try {
        console.error(
          "[ShiggyCord] patchErrorBoundary: error while rendering custom screen",
          e,
        );
      } catch {}
      // Fall back to original behavior by returning undefined
      return;
    }
  });

  // Best-effort: install global handlers to capture uncaught errors / promise rejections.
  // These handlers do not attempt to mount UI directly (that can be fragile), but they
  // store the last uncaught error for inspection and log details which helps debugging.
  try {
    const g: any = global as any;
    if (g) {
      // Wrap React Native's ErrorUtils if present
      try {
        const ErrorUtils = g.ErrorUtils;
        if (ErrorUtils && typeof ErrorUtils.setGlobalHandler === "function") {
          // preserve previous handler
          const prev =
            ErrorUtils.getGlobalHandler?.() ??
            ErrorUtils._globalHandler ??
            null;
          ErrorUtils.setGlobalHandler((err: any, isFatal?: boolean) => {
            try {
              console.error("[ShiggyCord] global uncaught error:", err, {
                isFatal,
              });
              (window as any).__SHIGGY_LAST_UNCAUGHT_ERROR = err;
            } catch {}
            try {
              if (typeof prev === "function") prev(err, isFatal);
            } catch {}
          });
        }
      } catch {}

      // Listen for unhandled promise rejections if environment supports it.
      try {
        if (typeof g.addEventListener === "function") {
          g.addEventListener("unhandledrejection", (ev: any) => {
            try {
              console.error(
                "[ShiggyCord] unhandledrejection:",
                ev?.reason ?? ev,
              );
              (window as any).__SHIGGY_LAST_UNCAUGHT_ERROR = ev?.reason ?? ev;
            } catch {}
          });
        }
      } catch {}
    }
  } catch {}

  return unpatch;
}
