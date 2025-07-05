import { RNModules } from "./types";

const nmp = window.nativeModuleProxy;

export const NativeCacheModule = (nmp.NativeCacheModule ?? nmp.MMKVManager) as RNModules.MMKVManager;
export const NativeFileModule = (nmp.NativeFileModule ?? nmp.RTNFileManager ?? nmp.DCDFileManager) as RNModules.FileManager;
export const NativeClientInfoModule = nmp.NativeClientInfoModule ?? nmp.RTNClientInfoManager ?? nmp.InfoDictionaryManager;
export const NativeDeviceModule = nmp.NativeDeviceModule ?? nmp.RTNDeviceManager ?? nmp.DCDDeviceManager;
export const NativeThemeModule = nmp.NativeThemeModule ?? nmp.RTNThemeManager ?? nmp.DCDTheme;

export const { BundleUpdaterManager } = nmp;

