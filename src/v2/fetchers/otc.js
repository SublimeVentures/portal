import * as Sentry from "@sentry/nextjs";

import { axiosPrivate  } from "@/lib/axios/axiosPrivate";
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

export const getUserAlocation = async () => {
    try {
        console.log('11');
        const { data } = await axiosPrivate.get(API_ROUTES.otc.getUserAllocation);
        console.log('22', data)

        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "getUserAllocation", e });
        }
    }

    return [];
};

export const getOffers = async ({ otcId, filters = {}, sort }) => {
    if (!otcId) return;

    const { sortId = "", sortOrder = "" } = sort || {};
    const queryParams = new URLSearchParams({ ...filters, sortId, sortOrder });

    try {
        const { data } = await axiosPrivate.get(`${API_ROUTES.otc.getOffers}/${otcId}?${queryParams.toString()}`);

        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "getOffers", e });
        }
    }

    return [];
};

export const getLatestDeals = async ({ otcId, filters = {}, sort }) => {
    // const { sortId = "", sortOrder = "" } = sort || {};
    // const queryParams = new URLSearchParams({ ...filters, sortId, sortOrder });

    try {
        const { data } = await axiosPrivate.get(API_ROUTES.otc.getLatest);
        // const { data } = await axiosPrivate.get(`${API_ROUTES.otc.getLatest}?${queryParams.toString()}`);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "getOffers", e });
        }
    }

    return [];
};

export const getOffersHistory = async ({ offerId, sort }) => {
    if (!offerId) return {};

    const { sortId = "", sortOrder = "" } = sort || {};
    const queryParams = new URLSearchParams({ sortId, sortOrder });

    try {
        const { data } = await axiosPrivate.get(`${API_ROUTES.otc.getHistory}/${offerId}?${queryParams.toString()}`);

        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchHistory", e });
        }
    }

    return {};
};
