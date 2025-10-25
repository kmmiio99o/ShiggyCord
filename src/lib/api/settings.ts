import {
  createFileBackend,
  createMMKVBackend,
  createStorage,
  wrapSync,
} from "@core/vendetta/storage";
import { getLoaderConfigPath } from "@lib/api/native/loader";

export interface Settings {
  debuggerUrl: string;
  developerSettings: boolean;
  enableDiscordDeveloperSettings: boolean;
  safeMode?: {
    enabled: boolean;
    currentThemeId?: string;
  };
  enableEvalCommand?: boolean;
}

export interface LoaderConfig {
  customLoadUrl: {
    enabled: boolean;
    url: string;
  };
  loadReactDevTools: boolean;
}

/**
 * New: Updater settings persisted in MMKV.
 * Fields:
 * - autoUpdateEnabled: whether updates are applied automatically
 * - checkOnStart: whether to check for updates on app start
 * - updateChannel: optional update channel (stable/beta/alpha)
 * - lastChecked: ISO timestamp of last update check
 *
 * Plugin-related additions:
 * - fetchPluginsOnStart: when true, plugins (external repositories) are fetched at startup;
 *   when false, plugin repository fetching is deferred and controlled from the Updater UI.
 * - repoAutoFetchOverrides: per-repository overrides for auto-fetch behavior
 *   (keyed by repository URL, boolean value overrides fetchPluginsOnStart).
 */
export interface UpdaterSettings {
  // Whether updates (bundle-level auto-updates) should be applied automatically
  autoUpdateEnabled: boolean;
  // Whether to perform an update check on app start
  checkOnStart: boolean;
  // Optional channel preference for updates
  updateChannel?: "stable" | "beta" | "alpha";
  // ISO timestamp of the last time the updater checked (plugins + bundle)
  lastChecked?: string | null;

  // -------------------------
  // Plugin-related settings
  // -------------------------
  // Whether external plugin repositories should be fetched at startup
  fetchPluginsOnStart?: boolean;
  // Per-repo override for auto-fetch behavior (repoUrl => boolean)
  repoAutoFetchOverrides?: Record<string, boolean>;

  // -------------------------
  // Bundle update settings
  // -------------------------
  // How often (in hours) to check the project's releases for bundle updates.
  // Default should be treated as 3 if unset.
  bundleCheckIntervalHours?: number;
  // Releases URL (used for checking the bundle). Defaults to:
  // https://github.com/kmmiio99o/ShiggyCord/releases/
  bundleReleasesUrl?: string;
  // Whether to ignore prerelease releases when checking bundle updates.
  // Defaults to true.
  bundleIgnorePrereleases?: boolean;
  // ISO timestamp of the last bundle check
  lastBundleChecked?: string | null;
  // Last known bundle version discovered by the updater (if any)
  lastBundleVersion?: string | null;
}

export const settings = wrapSync(
  createStorage<Settings>(createMMKVBackend("VENDETTA_SETTINGS")),
);

export const loaderConfig = wrapSync(
  createStorage<LoaderConfig>(
    createFileBackend(getLoaderConfigPath(), {
      customLoadUrl: {
        enabled: false,
        url: "http://localhost:4040/shiggycord.js",
      },
      loadReactDevTools: false,
    }),
  ),
);

/**
 * Updater settings storage.
 * Stored under MMKV key: VENDETTA_UPDATER_SETTINGS
 * Defaults should be handled by UI code when reading values if necessary.
 */
export const updaterSettings = wrapSync(
  createStorage<UpdaterSettings>(
    createMMKVBackend("VENDETTA_UPDATER_SETTINGS"),
  ),
);
