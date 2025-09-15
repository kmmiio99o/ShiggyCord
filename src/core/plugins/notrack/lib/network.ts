import { instead } from "@lib/api/patcher";

export default () => {
    // https://github.com/yellowsink/shelter-plugins/blob/3a62d1557b704f4617f72882edba826218eb8c6e/plugins/antitrack/index.js#L10-L25
    const analyticsTest = /client-analytics\.braintreegateway\.com|discord\.com\/api\/v9\/(science|track)|app\.adjust\..*|.*\.ingest\.sentry\.io/;

    return instead(
        "send",
        XMLHttpRequest.prototype,
        function (args, orig) { if (!analyticsTest.test(this.__sentry_xhr__?.url)) return orig.apply(this, args) },
    );
}
