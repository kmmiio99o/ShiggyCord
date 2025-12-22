/**
 * Lightweight timing utility for boot / init instrumentation.
 *
 * Usage examples:
 *   import { timings } from "@lib/utils/timings";
 *
 *   // measure synchronous function
 *   const res = timings.measureSync("initThemes", () => initThemes());
 *
 *   // measure async function
 *   await timings.measureAsync("loadPlugins", async () => { await loadPlugins(); });
 *
 *   // manual start/stop
 *   const stop = timings.start("heavyTask");
 *   doHeavyWork();
 *   stop();
 *
 *   // inspect / log results
 *   timings.logReport(); // prints a concise table to console
 *
 * Goals:
 * - Minimal, zero-dep helper to identify slow initializers.
 * - Safe for environments without `performance` (falls back to Date.now).
 * - Small memory footprint and simple API.
 */

type Stat = {
  name: string;
  calls: number;
  totalMs: number;
  lastMs: number;
  minMs: number;
  maxMs: number;
};

type ReportRow = {
  name: string;
  calls: number;
  totalMs: number;
  avgMs: number;
  lastMs: number;
  minMs: number;
  maxMs: number;
};

const now = (() => {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return () => performance.now();
  }
  return () => Date.now();
})();

/**
 * Internal stats map: key -> Stat
 */
const _stats = new Map<string, Stat>();

/**
 * Start a manual timer for `name`. Returns a stop() function that records the
 * elapsed time into the statistics and returns the duration.
 *
 * Example:
 *   const stop = start('db.init');
 *   // ... work ...
 *   const ms = stop();
 */
export function start(name: string) {
  const t0 = now();
  let stopped = false;

  return function stop() {
    if (stopped) return 0;
    stopped = true;
    const duration = Math.max(0, now() - t0);
    record(name, duration);
    return duration;
  };
}

/**
 * Measure a synchronous function and record its duration.
 * Returns the function result.
 */
export function measureSync<T>(name: string, fn: () => T): T {
  const t0 = now();
  try {
    return fn();
  } finally {
    const duration = Math.max(0, now() - t0);
    record(name, duration);
  }
}

/**
 * Measure an async function (promise-returning) and record its duration.
 * Returns the awaited result.
 */
export async function measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const t0 = now();
  try {
    return await fn();
  } finally {
    const duration = Math.max(0, now() - t0);
    record(name, duration);
  }
}

/**
 * Wrap a function (sync or async) preserving its return value and recording the timing.
 * If fn returns a Promise it will await it and record the time.
 */
export function wrap<T extends (...a: any[]) => any>(name: string, fn: T): T {
  const wrapped = function (this: any, ...args: any[]) {
    const t0 = now();
    try {
      const res = (fn as any).apply(this, args);
      if (res && typeof res.then === "function") {
        // async
        return res.finally(() => {
          const duration = Math.max(0, now() - t0);
          record(name, duration);
        });
      }
      // sync
      return res;
    } finally {
      // for synchronous returns, ensure timing recorded in finally above won't double-record.
      if ((fn as any).constructor?.name !== "AsyncFunction") {
        const duration = Math.max(0, now() - t0);
        record(name, duration);
      }
    }
  };

  return (wrapped as unknown) as T;
}

/**
 * Record a measured duration (milliseconds) under `name`.
 */
export function record(name: string, durationMs: number) {
  if (!name) name = "<unnamed>";
  const s = _stats.get(name);
  if (!s) {
    _stats.set(name, {
      name,
      calls: 1,
      totalMs: durationMs,
      lastMs: durationMs,
      minMs: durationMs,
      maxMs: durationMs,
    });
    return;
  }

  s.calls += 1;
  s.lastMs = durationMs;
  s.totalMs += durationMs;
  if (durationMs < s.minMs) s.minMs = durationMs;
  if (durationMs > s.maxMs) s.maxMs = durationMs;
}

/**
 * Produce a sorted report array (desc by total time) limited to `limit` rows.
 */
export function report(limit = 25): ReportRow[] {
  const rows: ReportRow[] = [];
  for (const [, s] of _stats) {
    rows.push({
      name: s.name,
      calls: s.calls,
      totalMs: s.totalMs,
      avgMs: s.calls > 0 ? s.totalMs / s.calls : 0,
      lastMs: s.lastMs,
      minMs: s.minMs,
      maxMs: s.maxMs,
    });
  }

  rows.sort((a, b) => b.totalMs - a.totalMs);
  return rows.slice(0, limit);
}

/**
 * Console-log a human-readable report.
 */
export function logReport(limit = 25) {
  const rows = report(limit);
  if (rows.length === 0) {
    console.info("[timings] no recorded timings");
    return;
  }

  // Build a compact table-like output
  console.groupCollapsed(`[timings] top ${rows.length} (by total ms)`);
  try {
    console.table(
      rows.map((r) => ({
        name: r.name,
        calls: r.calls,
        totalMs: Number(r.totalMs.toFixed(2)),
        avgMs: Number(r.avgMs.toFixed(2)),
        lastMs: Number(r.lastMs.toFixed(2)),
        minMs: Number(r.minMs.toFixed(2)),
        maxMs: Number(r.maxMs.toFixed(2)),
      })),
    );
  } catch {
    // Some environments don't support console.table
    for (const r of rows) {
      console.log(
        `${r.name} — total ${r.totalMs.toFixed(2)}ms • avg ${r.avgMs.toFixed(2)}ms • last ${r.lastMs.toFixed(
          2,
        )}ms • calls ${r.calls}`,
      );
    }
  } finally {
    console.groupEnd();
  }
}

/**
 * Clear collected timing stats.
 */
export function clear() {
  _stats.clear();
}

/**
 * Convenience: record but return value for fluent usage.
 * Example:
 *   const data = await timings.withTimingAsync('fetch', () => fetchJSON());
 */
export async function withTimingAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const t0 = now();
  try {
    return await fn();
  } finally {
    record(name, Math.max(0, now() - t0));
  }
}

export function withTimingSync<T>(name: string, fn: () => T): T {
  const t0 = now();
  try {
    return fn();
  } finally {
    record(name, Math.max(0, now() - t0));
  }
}

/**
 * Expose a small default export for convenience.
 */
export const timings = {
  start,
  measureSync,
  measureAsync,
  wrap,
  record,
  report,
  logReport,
  clear,
  withTimingAsync,
  withTimingSync,
};

export default timings;