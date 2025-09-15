import { findByProps } from "@metro";
import { noop } from "./utils";

const Sentry = {
    initializer: findByProps("initSentry"),
    main: globalThis.__SENTRY__?.hub,
    client: globalThis.__SENTRY__?.hub?.getClient(),
};

export default () => {
    const patches = [
        noop("initSentry", Sentry.initializer),
        noop("addBreadcrumb", Sentry.main),
    ];

    Sentry.client.getOptions().enabled = false;
    Sentry.client.close();
    Sentry.main.getStackTop().scope.clear();
    Sentry.main.getScope().clear();

    return () => {
        patches.forEach((p) => p());
        Sentry.client.getOptions().enabled = true;
        Sentry.client.open();
    };
}
