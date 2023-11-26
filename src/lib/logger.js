const Sentry = require("@sentry/nextjs");

// Logger module
module.exports = {
    logHandledError: (error) => {
        // Explicitly capture exceptions
        Sentry.captureException(error);
    },
    error: (message, data) => {
        console.log(`ERROR :: ${message}`, data)
        Sentry.withScope((scope) => {
            scope.setLevel("error");
            scope.setExtras(data);
            Sentry.captureMessage(message);
        });
    },
    warn: (message, data) => {
        console.log(`WARN :: ${message}`, data)

        Sentry.withScope((scope) => {
            scope.setLevel("warning");
            scope.setExtras(data);
            Sentry.captureMessage(message);
        });
    },
    info: (message, data) => {
        console.log(`INFO :: ${message}`, data)

        Sentry.withScope((scope) => {
            scope.setLevel("info");
            scope.setExtras(data);
            Sentry.captureMessage(message);
        });
    },
};
