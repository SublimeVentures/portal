import Sentry from "@sentry/nextjs";

async function failsafe(method, defaultReturn){
    console.log("FAILSAFE", this.constructor.name);
    try {
        return await method()
    } catch (e) {
        Sentry.captureException({location: "fetchSessionData", e});
        return defaultReturn ? defaultReturn : {ok: false}
    }
}
module.exports = {failsafe}
