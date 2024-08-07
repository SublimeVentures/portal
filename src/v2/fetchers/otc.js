import * as Sentry from "@sentry/nextjs";

import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { axiosPublic } from "@/lib/axios/axiosPublic";
import { API_ROUTES } from "@/v2/routes";
import { authTokenName } from "@/lib/authHelpers";

export const getMarkets = async () => {
    try {
        const { data } = await axiosPrivate.get(API_ROUTES.otc.getMarkets);

        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "getMarkets", e });
        }
    }

    return [];
};

export const getMarketsSsr = async (token) => {
    try {
        const { data } = await axiosPublic.get(API_ROUTES.otc.getMarkets, {
            headers: {
                Cookie: `${authTokenName}=${token}`,
            },
        });

        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "getMarketsSsr", e });
        }
    }

    return [];
};

export const getUserAllocation = async () => {
    try {
        const { data } = await axiosPrivate.get(API_ROUTES.otc.getUserAllocation);

        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "getUserAllocation", e });
        }
    }

    return [];
};

export const getOffers = async ({ otcId, filters = {}, sort }) => {
    if (!otcId) return [];

    const { sortId = "", sortOrder = "" } = sort ?? {};

    try {
        const { data } = await axiosPrivate.get(`${API_ROUTES.otc.getOffers}/${otcId}`, {
            params: { ...filters, sortId, sortOrder },
        });

        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "getOffers", e });
        }
    }

    return [];
};

export const getLatestDeals = async ({ sort }) => {
    const { sortId = "", sortOrder = "" } = sort ?? {};

    try {
        const { data } = await axiosPrivate.get(API_ROUTES.otc.getLatest, { params: { sortId, sortOrder } });

        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "getOffers", e });
        }
    }

    return [];
};

export const getOffersHistory = async ({ offerId, sort }) => {
    if (!offerId) return [];

    const { sortId = "", sortOrder = "" } = sort ?? {};

    try {
        const { data } = await axiosPrivate.get(`${API_ROUTES.otc.getHistory}/${offerId}`, {
            params: { sortId, sortOrder },
        });

        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchHistory", e });
        }
    }

    return [];
};
