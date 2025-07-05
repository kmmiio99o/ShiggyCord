export namespace DiscordNativeModules {
    /**
     * Key-value storage
     */
    export interface CacheModule {
        /**
         * Get the value for the given `key`, or null
         * @param key The key to fetch
         */
        getItem: (key: string) => Promise<string | null>
        /**
         * Deletes the value for the given `key`
         * @param key The key to delete
         */
        removeItem: (key: string) => void
        /**
         * Sets the value of `key` to `value`
         */
        setItem: (key: string, value: string) => void
        /**
         * Goes through every item in storage and returns it, excluding the keys specified in `exclude`.
         * @param exclude A list of items to exclude from result
         */
        refresh: (exclude: string[]) => Promise<Record<string, string>>
        /**
         * Clears ALL of Discord's settings.
         */
        clear: () => void
    }

    /**
     * File manager
     */
    export interface FileModule {
        /**
         * @param path **Full** path to file
         */
        fileExists: (path: string) => Promise<boolean>
        /**
         * Reads an asset from the given URI
         * @param nameOrUri The name or URI to read from (`http://` scheme is supported)
         * @param encoding The encoding to read the asset with
         * @returns
         */
        readAsset: (
            nameOrUri: string,
            encoding: 'base64' | 'utf8',
        ) => Promise<string>
        /**
         * Allowed URI schemes on Android: `file://`, `content://` ([See here](https://developer.android.com/reference/android/content/ContentResolver#accepts-the-following-uri-schemes:_3))
         */
        getSize: (uri: string) => Promise<boolean>
        /**
         * @param path **Full** path to file
         * @param encoding Set to `base64` in order to encode response
         */
        readFile(path: string, encoding: 'base64' | 'utf8'): Promise<string>
        saveFileToGallery?(
            uri: string,
            fileName: string,
            fileType: 'PNG' | 'JPEG',
        ): Promise<string>
        /**
         * @param storageDir Either `cache` or `documents`.
         * @param path Path in `storageDir`, parents are recursively created.
         * @param data The data to write to the file
         * @param encoding Set to `base64` if `data` is base64 encoded.
         * @returns Promise that resolves to path of the file once it got written
         */
        writeFile(
            storageDir: 'cache' | 'documents',
            path: string,
            data: string,
            encoding: 'base64' | 'utf8',
        ): Promise<string>
        /**
         * Removes a file from the path given.
         * @param storageDir Either `cache` or `documents`
         * @param path Path to the file to be removed
         */
        removeFile(
            storageDir: 'cache' | 'documents',
            path: string,
        ): Promise<boolean>
        /**
         * Clear the folder from the path given
         * (!) On Android, this only clears all *files* and not subdirectories!
         * @param storageDir Either `cache` or `documents`
         * @param path Path to the folder to be cleared
         * @returns Whether the clearance succeeded
         */
        clearFolder(
            storageDir: 'cache' | 'documents',
            path: string,
        ): Promise<boolean>
        getConstants(): {
            /**
             * The path the `documents` storage dir (see {@link writeFile}) represents.
             */
            DocumentsDirPath: string
            CacheDirPath: string
        }
    }

    /**
     * Client information
     */
    export interface ClientInfoModule {
        getConstants(): {
            /**
             * Sentry ingestion DSN URL for alpha/beta builds
             */
            SentryAlphaBetaDsn: string
            /**
             * Sentry ingestion DSN URL for staff builds (?)
             */
            SentryStaffDsn: string
            /**
             * Sentry ingestion DSN URL for stable builds
             */
            SentryDsn: string
            DeviceVendorID: string
            Manifest: string
            /**
             * Version code
             *
             * Follows the format of `{MINOR}{CHANNEL}{PATCH}` for `{MINOR}.{PATCH} ({CHANNEL})`
             * - `248200` for `248.0 (alpha)`
             * - `247105` for `247.5 (beta)`
             * - `246011` for `246.11 (stable)`
             */
            Build: any
            /**
             * Version string
             *
             * Eg. `248.0`
             */
            Version: string
            /**
             * Release channel
             */
            ReleaseChannel: string
            /**
             * Matches `Version`
             */
            OTABuild: string
            /**
             * Identifier for the installed client
             *
             * - **Android**: Package name
             * - **iOS**: Bundle ID
             */
            Identifier: string
        }
    }

    /**
     * OTA updates, app reloads, etc.
     */
    export interface BundleUpdaterManager {
        /**
         * Reloads the app
         */
        reload(): void
    }

    /**
     * Device information
     */
    export interface DeviceModule {
        /**
         * Returns the screen size of the device
         */
        getScreenSize(): { width: number; height: number }
        getConstants(): {
            /**
             * Maximum CPU frequency
             * @example "2.00"
             */
            maxCpuFreq: string
            /**
             * The brand of the device
             * - On Android, returns the value of `ro.product.brand`
             */
            deviceBrand: string
            /**
             * Whether the device is using gesture navigation
             */
            isGestureNavigationEnabled: boolean
            /**
             * The manufacturer of the device
             * - On Android, returns the value of `ro.product.manufacturer`
             */
            deviceManufacturer: string
            /**
             * RAM size in gigabytes (most likely an approximation)
             * @example "3.62"
             */
            ramSize: string
            /**
             * The device's DPI setting
             */
            smallestScreenWidth: number
            /**
             * The version of the system
             * - On Android, returns the value of `ro.build.version.sdk`
             */
            systemVersion: string
            /**
             * Whether the system taskbar navigation is enabled
             */
            isTaskBarEnabled: boolean
            /**
             * The name of the device product
             * - On Android, returns the value of `ro.product.name`
             */
            deviceProduct: string
            /**
             * The model of the device
             * - On Android, returns the value of `ro.product.model`
             */
            deviceModel: string
            /**
             * The name of the device
             * - On Android, returns the value of `ro.product.device`
             */
            device: string
            /**
             * The name of the device board
             * - On Android, returns the value of `{ro.product.manufacturer}_{ro.soc.model}`
             * @example "Google_Tensor G4" // ro.product.manufacturer=Google; ro.soc.model=Tensor G4
             */
            socName: string
        }
    }

    /**
     * Manage theme settings, saturation settings, etc.
     *
     * This only manages the native-side components and already-rendered native components will need to be re-rendered to apply changes.
     */
    export interface ThemeModule {
        /**
         * Sets the saturation value
         * @param saturation The saturation value to set
         */
        updateSaturation(saturation: number): void
        /**
         * Sets the theme
         * @param theme The theme to set
         */
        updateTheme(theme: 'dark' | 'light'): void
    }
}