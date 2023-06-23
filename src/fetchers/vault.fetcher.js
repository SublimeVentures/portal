import * as Sentry from '@sentry/nextjs'
import {axiosPrivate} from "@/lib/axios/axiosPrivate";
import {API} from "@/routes";

export const fetchUserInvestment = async (offerId) => {
    try {
        const {data} = await axiosPrivate.get(`${API.fetchVaultOfferDetails}${offerId}`)
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchUserInvestment", e});
    }
    return 0
}

export const fetchVault = async () => {
    try {
        const {data} = await axiosPrivate.get(API.fetchVault)
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchVault", e});
    }
    return []
}

