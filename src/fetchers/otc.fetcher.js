import axios from "axios";
import * as Sentry from "@sentry/nextjs";

export const fetchMarkets = async () => {
    try {
        const url = `/api/otc/markets`
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchMarkets", error: e});
    }
    return {}
}


export const fetchOffers = async (offerId) => {
    try {
        const url = `/api/otc/offers/${offerId}`
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchOffers", error: e});
    }
    return {}
}

export const fetchHistory = async (offerId) => {
    try {
        const url = `/api/otc/history/${offerId}`
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchHistory", error: e});
    }
    return {}
}

export const saveTransaction = async (offerId, networkChainId, isBuyer, amount, price) => {
    try {
        const {data} = await axios.post(`/api/otc/${offerId}/create`, {
            isBuyer,
            amount,
            price,
            networkChainId
        })
        return data
    } catch(e) {
        Sentry.captureException({location: "saveTransaction", error: e});
    }
    return {}
}

export const removeTransaction = async (offerId, hash) => {
    try {
        const {data} = await axios.post(`/api/otc/${offerId}/remove`, {
            hash
        })
        return data
    } catch(e) {
        Sentry.captureException({location: "removeTransaction", error: e});
    }
    return {}
}

