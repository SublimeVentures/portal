import * as Sentry from "@sentry/nextjs";

import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API_ROUTES } from "@/v2/routes";
import { authTokenName } from "@/lib/authHelpers";

export const getMarkets = async (token) => {
    try {
        const { data } = await axiosPrivate.get(API_ROUTES.otc.getMarkets, {
            headers: {
                Cookie: `${authTokenName}=${token}`,
            },
        });


        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "getMarkets", e });
        }
    }

    return [];
};

export const getOffers = async ({ otcId, filters = {}, sort }) => {
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
