import * as Sentry from "@sentry/nextjs";
import {axiosPrivate} from "@/lib/axios/axiosPrivate";

export const fetchMarkets = async () => {
    try {
        const url = `/api/otc/markets`
        const {data} = await axiosPrivate.get(url)
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchMarkets", error: e});
    }
    return {}
}


export const fetchOffers = async (otcId) => {
    if(!otcId) return []
    try {
        const url = `/api/otc/offers/${otcId}`
        const {data} = await axiosPrivate.get(url)
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchOffers", error: e});
    }
    return []
}

export const fetchHistory = async (offerId) => {
    try {
        const url = `/api/otc/history/${offerId}`
        const {data} = await axiosPrivate.get(url)
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchHistory", error: e});
    }
    return {}
}

export const saveTransaction = async (offerId, networkChainId, price, amount, isBuyer) => {
    try {
        const {data} = await axiosPrivate.post(`/api/otc/${offerId}/create`, {
            networkChainId,
            price,
            amount,
            isBuyer,
        })
        return data
    } catch(e) {
        Sentry.captureException({location: "saveTransaction", error: e});
    }
    return {}
}
export const getSignature = async (offerId, networkChainId, otcId, dealId) => {
    try {
        const {data} = await axiosPrivate.post(`/api/otc/${offerId}/sign`, {
            networkChainId,
            otcId,
            dealId
        })
        return data
    } catch(e) {
        Sentry.captureException({location: "getSignature", error: e});
    }
    return {}
}

export const removeTransaction = async (offerId, hash) => {
    try {
        const {data} = await axiosPrivate.post(`/api/otc/${offerId}/remove`, {
            hash
        })
        return data
    } catch(e) {
        Sentry.captureException({location: "removeTransaction", error: e});
    }
    return {}
}

