import Sentry from "@sentry/nextjs";
import {fetchWrapper} from "@/lib/fetchWrapper";

export const singIn = async (message, signature) => {
    try {
        const request = await fetchWrapper.post(`/api/auth/login`, { message, signature })

        console.log("singIn", request)
    } catch (e) {
        console.log("singIn", e)
        Sentry.captureException({location: "singIn", e});
    }
    return {}
}
