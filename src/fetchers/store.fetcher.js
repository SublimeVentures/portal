import * as Sentry from "@sentry/nextjs";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";

export const fetchStore = async () => {
    try {
        const { data } = await axiosPrivate.get(API.fetchStore);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchStore", e });
        }
    }
    return [];
};

export const fetchStoreItemsOwned = async () => {
    try {
        const { data } = await axiosPrivate.get(API.fetchStoreItemsOwned);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchStoreItemsOwned", e });
        }
    }
    return [];
};

export const reserveUpgrade = async (params) => {
    try {
        const { data } = await axiosPrivate.post(API.reserveUpgrade, params);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "reserveMysterybox", e });
        }
    }
    return [];
};