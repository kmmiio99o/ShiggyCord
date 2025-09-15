import { findByProps } from "@metro";
import { noop } from "./utils";

// Stuff in here is non-specific tracking scattered around the app

const AnalyticsUtils = findByProps("AnalyticsActionHandlers");
const SuperPropUtils = findByProps("encodeProperties", "track");
const VoiceStateUtils = findByProps("getVoiceStateMetadata");
const CrashReportUtils = findByProps("submitLiveCrashReport");
const MetricsUtils = findByProps("_metrics");

export default () => {
    const patches = [
        // Global analytics utilities
        ...(["handleTrack", "handleFingerprint"].map((i) => noop(i, AnalyticsUtils.AnalyticsActionHandlers))),
        // TODO: This is a getter - look into patching it
        // noop("analyticsTrackingStoreMaker", AnalyticsUtils),

        // Super properties tracking
        noop("track", SuperPropUtils),

        // Voice state metadata tracking
        noop("trackWithMetadata", VoiceStateUtils),

        // Crash reporter
        noop("submitLiveCrashReport", CrashReportUtils),

        // Whatever "metrics" implies
        noop("push", MetricsUtils._metrics),
    ];

    return () => patches.forEach((p) => p());
}
