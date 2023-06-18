import * as Sentry from '@sentry/nextjs'
import {fetchWrapper} from "@/lib/fetchHandler";

export const fetchPortfolio = async () => {
    try {
        return await fetchWrapper.get(`/api/portfolio`)
    } catch(e) {
        console.log("fetchPortfolio",e)
        Sentry.captureException({location: "fetchPublicInvestments", e});
    }
    return []
}

export const fetchPartners = async () => {
    try {
        return await fetchWrapper.get(`/api/partners`)
    } catch(e) {
        console.log("fetchPartners",e)
        Sentry.captureException({location: "fetchPartners", e});
    }
    return []

}

