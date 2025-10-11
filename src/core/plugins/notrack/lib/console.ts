import { logger } from "@lib/utils/logger";

export default () => {
    const sentrified = {};

    try {
        Object.keys(console).forEach((x) => { 
            sentrified[x] = console[x];
            console[x] = console[x].__sentry_original__ ?? console[x];
        });
    } catch(e) {
        logger.log("Failed to de-sentrify console functions!", e);
    };

    return () => Object.keys(console).forEach((x) => console[x] = sentrified[x]);
}
