import Sentry from "@sentry/nextjs";
import {signInQuery, signOutQuery} from "@/lib/authHelpers";

export const singIn = async (message, signature) => {
    try {
        const request = await signInQuery(message, signature)
        console.log("request result - singIn", request)
        return true //todo: redirect
    } catch (e) {
        console.log("singIn", e)
        Sentry.captureException({location: "singIn", e});
    }
    return false
}

export const singOut = async (message, signature) => {
    try {
        const request = await signOutQuery()
        console.log("request result - singIn", request)
        return true //todo: redirect
    } catch (e) {
        console.log("singIn", e)
        Sentry.captureException({location: "singIn", e});
    }
    return false
}
