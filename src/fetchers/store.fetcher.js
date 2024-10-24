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
