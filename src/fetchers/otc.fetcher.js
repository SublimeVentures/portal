import * as Sentry from "@sentry/nextjs";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";

export const fetchMarkets = async () => {
    try {
        const url = `/api/otc/markets`;
        const { data } = await axiosPrivate.get(url);

        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchMarkets", e });
        }
    }
    return {};
};

export const fetchOffers = async ({ otcId, filters = {}, sort }) => {
    if (!otcId) return [];
    
    const { sortId = "", sortOrder = "" } = sort || {};
    const queryParams = new URLSearchParams({ ...filters, sortId, sortOrder });

    try {
        const url = `/api/otc/offers/${otcId}`;
        const { data } = await axiosPrivate.get(url);
        return data;
    } catch (e) {
        console.log('offers-err', e)
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchOffers", e });
        }
    }
    
    return [];
};

export const fetchHistory = async (offerId) => {
    try {
        console.log('fetchHistory', offerId)
        const url = `/api/otc/history/${offerId}`;
        const { data } = await axiosPrivate.get(url);
        return data;
    } catch (e) {
        console.log('fetchHistory-err', e)
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchHistory", e });
        }
    }
    return {};
};

export const saveTransaction = async (offerId, networkChainId, price, amount, isSell, account) => {
    try {
        const { data } = await axiosPrivate.post(`/api/otc/${offerId}/create`, {
            networkChainId,
            price,
            amount,
            isSell,
            account,
        });
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "saveTransaction", e });
        }
    }
    return {};
};
export const getSignature = async (offerId, chainId, otcId, dealId, wallet) => {
    try {
        const { data } = await axiosPrivate.post(`/api/otc/${offerId}/sign`, {
            chainId,
            otcId,
            dealId,
            wallet,
        });
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "getSignature", e });
        }
    }
    return {};
};

export const removeTransaction = async (offerId, hash) => {
    try {
        const { data } = await axiosPrivate.post(`/api/otc/${offerId}/remove`, {
            hash,
        });
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "removeTransaction", e });
        }
    }
    return {};
};
