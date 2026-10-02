import { findByProps } from "@metro";

const getChroma = () => require("chroma-js") as typeof import("chroma-js").default;

const tokenRef = findByProps("SemanticColor");

// Discord's stock raw colors, read before the resolver patch makes RawColor return theme values.
const stockRaw: Record<string, string> = { ...tokenRef.RawColor };

const NEUTRAL_KEY = /^NEUTRAL_\d+$/;

// Semantic keys whose value best describes a theme's main background, in order of preference.
const BACKGROUND_KEYS = ["BACKGROUND_PRIMARY", "CHAT_BACKGROUND", "BG_BASE_PRIMARY", "BACKGROUND_SECONDARY"];

/**
 * Newer Discord versions draw most surfaces (channel list, headers, bars) straight from the
 * NEUTRAL_1-100 raw grays, which themes written before that palette existed don't set, so those
 * surfaces stayed stock. Fill them in for such themes: each step keeps Discord's lightness and
 * takes the hue and chroma of the theme's background.
 *
 * Does nothing when the theme sets any NEUTRAL_ color itself, has no background color, or the
 * Discord version has no NEUTRAL palette.
 */
export function deriveNeutralRaw(
    raw: Record<string, string>,
    semantic: Record<string, { value: string; opacity: number; }>,
) {
    if (Object.keys(raw).some(k => NEUTRAL_KEY.test(k))) return;

    const background = BACKGROUND_KEYS.map(k => semantic[k]?.value).find(Boolean);
    if (!background) return;

    const chroma = getChroma();
    let hue: number;
    let saturation: number;
    try {
        [, saturation, hue] = chroma(background).lch();
    } catch {
        return;
    }
    // Achromatic backgrounds have no hue; keep Discord's grays then.
    if (!Number.isFinite(hue) || saturation < 1) return;

    for (const [key, value] of Object.entries(stockRaw)) {
        if (!NEUTRAL_KEY.test(key) || typeof value !== "string") continue;
        try {
            const [lightness] = chroma(value).lch();
            // Taper the chroma near white and black, where it would read as a strong tint.
            const taper = Math.min(1, lightness / 15, (100 - lightness) / 15);
            raw[key] = chroma.lch(lightness, saturation * taper, hue).hex();
        } catch {
            // Leave this step stock.
        }
    }
}
