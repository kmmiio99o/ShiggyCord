import { getMetroCache } from "@metro/internals/caches";
import { ModuleFlags } from "@metro/internals/enums";
import { requireModule } from "@metro/internals/modules";

import { assetsModule } from "./patches";

export interface Asset {
    id: number;
    name: string;
    moduleId: number;
    type: string;
}

// Cache common usage
const _nameToAssetCache = {} as Record<string, Asset>;

// Simple cached asset list with TTL to avoid iterating the flagsIndex too often.
// This is a small in-memory cache to improve repeated asset lookups during UI rendering.
let _cachedAssetList: Asset[] | null = null;
let _cachedAssetListTs = 0;
const ASSET_CACHE_TTL = 2500; // milliseconds

/**
 * Invalidate the internal asset caches so the next iterateAssets() call will
 * re-run through the metro flags index and refresh the cache.
 */
export function invalidateAssetCache() {
    _cachedAssetList = null;
    _cachedAssetListTs = 0;
    for (const k in _nameToAssetCache) delete _nameToAssetCache[k];
}

export function* iterateAssets() {
    // Return cached list when fresh
    const now = Date.now();
    if (_cachedAssetList && now - _cachedAssetListTs < ASSET_CACHE_TTL) {
        for (const asset of _cachedAssetList) yield asset;
        return;
    }

    const { flagsIndex } = getMetroCache();
    const yielded = new Set<number>();
    const list: Asset[] = [];

    for (const id in flagsIndex) {
        if (flagsIndex[id] & ModuleFlags.ASSET) {
            const assetId = requireModule(Number(id));
            if (typeof assetId !== "number" || yielded.has(assetId)) continue;
            const asset = getAssetById(assetId);
            if (!asset) continue;
            list.push(asset);
            yielded.add(assetId);
            yield asset;
        }
    }

    // Update cache
    _cachedAssetList = list;
    _cachedAssetListTs = now;
}

// Apply additional properties for convenience
function getAssetById(id: number): Asset {
    const asset = assetsModule.getAssetByID(id);
    if (!asset) return asset;
    return Object.assign(asset, { id });
}

/**
 * Returns the first asset registry by its registry id (number), name (string) or given filter (function)
 */
export function findAsset(id: number): Asset | undefined;
export function findAsset(name: string): Asset | undefined;
export function findAsset(filter: (a: Asset) => boolean): Asset | undefined;

export function findAsset(param: number | string | ((a: Asset) => boolean)) {
    if (typeof param === "number") return getAssetById(param);

    if (typeof param === "string" && _nameToAssetCache[param]) {
        return _nameToAssetCache[param];
    }

    for (const asset of iterateAssets()) {
        if (typeof param === "string" && asset.name === param) {
            _nameToAssetCache[param] = asset;
            return asset;
        } else if (typeof param === "function" && param(asset)) {
            return asset;
        }
    }
}

export function filterAssets(param: string | ((a: Asset) => boolean)) {
    const filteredAssets = [] as Array<Asset>;

    for (const asset of iterateAssets()) {
        if (typeof param === "string" ? asset.name === param : param(asset)) {
            filteredAssets.push(asset);
        }
    }

    return filteredAssets;
}

/**
 * Returns the first asset ID in the registry with the given name
 */
export function findAssetId(name: string) {
    return findAsset(name)?.id;
}
