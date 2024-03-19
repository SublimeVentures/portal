// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const DNS = process.env.SENTRY_DSN;

Sentry.init({
    dsn: DNS,
    ignoreErrors: [
        "No internet connection detected",
        "WebSocket connection failed",
        "Invariant: attempted to hard navigate",
        "Loading CSS chunk",
        "Socket stalled when trying to connect",
    ],
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
});
