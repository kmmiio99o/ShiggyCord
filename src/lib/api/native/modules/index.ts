import type { DiscordNativeModules } from "./types";

export const NativeCacheModule = __turboModuleProxy(
    'NativeCacheModule',
) as DiscordNativeModules.CacheModule

export const NativeFileModule = __turboModuleProxy(
    'NativeFileModule',
) as DiscordNativeModules.FileModule

export const NativeClientInfoModule = __turboModuleProxy(
    'NativeClientInfoModule',
) as DiscordNativeModules.ClientInfoModule

export const NativeDeviceModule = __turboModuleProxy(
    'NativeClientInfoModule',
) as DiscordNativeModules.ClientInfoModule

export const BundleUpdaterManager = getNativeModule("BundleUpdaterManager");

export const NativeThemeModule = __turboModuleProxy(
    'NativeThemeModule',
) as DiscordNativeModules.ThemeModule
