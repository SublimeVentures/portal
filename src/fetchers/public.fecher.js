import axios from "axios";
import * as Sentry from '@sentry/nextjs'

export const fetchPublicInvestments = async () => {
    try {
        const {data} = await axios.get("/api/public/investments")
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchPublicInvestments", e});
    }
    return []
}

export const fetchPartners = async () => {
    try {
        const {data} = await axios.get("/api/public/partners")
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchPartners", e});
    }
    return []

}

