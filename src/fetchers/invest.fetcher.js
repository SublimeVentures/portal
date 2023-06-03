import axios from "axios";
import Sentry from "@sentry/nextjs";

export const fetchHash = async (id, amount, currency, chain) => {
    const url = `/api/invest?id=${id}&amount=${amount}&currency=${currency}&chain=${chain}`
    try {
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchHash", e, url});
    }
    return {}
}

export const expireHash = async (id, hash) => {
    const url = `/api/invest/hash?id=${id}&hash=${hash}`
    try {
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        Sentry.captureException({location: "expireHash", e,url});
    }
    return {}
}
