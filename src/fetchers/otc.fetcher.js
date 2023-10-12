import * as Sentry from "@sentry/nextjs";
import {axiosPrivate} from "@/lib/axios/axiosPrivate";

export const fetchMarkets = async () => {
    try {
        const url = `/api/otc/markets`
        const {data} = await axiosPrivate.get(url)
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "fetchMarkets", e});
        }
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
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "fetchOffers", e});
        }
    }
    return []
}

export const fetchHistory = async (offerId) => {
    try {
        const url = `/api/otc/history/${offerId}`
        const {data} = await axiosPrivate.get(url)
        return data
    } catch(e) {

        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "fetchHistory", e});
        }
    }
    return {}
}

export const saveTransaction = async (offerId, networkChainId, price, amount, isSell) => {
    try {
        const {data} = await axiosPrivate.post(`/api/otc/${offerId}/create`, {
            networkChainId,
            price,
            amount,
            isSell,
        })
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "saveTransaction", e});
        }
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
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "getSignature", e});
        }
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
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "removeTransaction", e});
        }
    }
    return {}
}

