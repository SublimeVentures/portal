import axios from "axios";
import Sentry from "@sentry/nextjs";

export const fetchPayableCurrency = async () => {
    try {
        let url = `/api/chain/currencies`
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchPayableCurrency", e});
    }
    return {}
}


