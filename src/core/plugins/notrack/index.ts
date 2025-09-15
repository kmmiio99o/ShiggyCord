import network from "./lib/network";
import console from "./lib/console";
import miscellanous from "./lib/miscellanous";
import sentry from "./lib/sentry";
import { defineCorePlugin } from "..";
import { logger } from "@lib/utils/logger";

const patches = [
    network(),
    console(),
    miscellanous(),
    // Sentry causes issues
    // sentry(),
];

export default defineCorePlugin({
    manifest: {
        id: "vendetta.notrack",
        version: "1.0.0",
        type: "plugin",
        spec: 3,
        main: "",
        display: {
            name: "NoTrack",
            description: "Disables Discord's telemetry",
            authors: [{ name: "maisymoe" }]
        }
    },
    start() {
        logger.log("gyat");
        const patches = [
            network(),
            console(),
            miscellanous(),
            sentry(),
        ];
    }
});

