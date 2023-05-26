import axios from "axios";
import Sentry from "@sentry/nextjs";

export const fetchSessionData = async (address) => {
    try {
        const {data} = await axios.get(`/api/validate/l0gin/${address}`)
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchSessionData", e});
    }
    return {}
}
