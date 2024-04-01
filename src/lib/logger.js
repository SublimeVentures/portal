const Sentry = require("@sentry/nextjs");

// Logger module
module.exports = {
    logHandledError: (error) => {
        // Explicitly capture exceptions
        Sentry.captureException(error);
    },
    error: (message, data) => {
        console.log(`ERROR :: ${message}`, data);
    },
    warn: (message, data) => {
        console.log(`WARN :: ${message}`, data);
    },
    info: (message, data) => {
        console.log(`INFO :: ${message}`, data);
    },
};
