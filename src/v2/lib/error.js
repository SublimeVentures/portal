import * as Sentry from "@sentry/nextjs";
import { isProduction } from "@/lib/utils";

export function handleError(type, error, config) {
    const { isLog = !isProduction, message, methodName, enableSentry } = config;

    if (isLog) {
        console.error(`${type} :: [${methodName}] - FAILED, ${error.message || message}`);
    }

    if (enableSentry && error?.status && error.status !== 401 && error.status !== 403) {
        Sentry.captureException({ location: methodName, error });
    }

    return { error: error.message || message, ok: false };
}
