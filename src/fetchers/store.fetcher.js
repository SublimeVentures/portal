import * as Sentry from "@sentry/nextjs";
import ErrorType from "../../shared/enum/errorType.enum";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";
import { handleError } from "@/v2/lib/error";

export const fetchStore = async () => {
    try {
        const { data } = await axiosPrivate.get(API.fetchStore);
        return data;
    } catch (error) {
        handleError(ErrorType.FETCHER, error, { methodName: "fetchStore", enableSentry: true });
    }
    return [];
};

export const fetchStoreItemsOwned = async (query, config = {}) => {
    try {
        const { data } = await axiosPrivate.get(API.fetchStoreItemsOwned, { params: query, ...config });
        return data;
    } catch (error) {
        handleError(ErrorType.FETCHER, error, { methodName: "fetchStoreItemsOwned", enableSentry: true });
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
