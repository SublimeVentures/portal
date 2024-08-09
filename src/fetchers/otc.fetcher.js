import ErrorType from "../../shared/enum/errorType.enum";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { handleError } from "@/v2/lib/error";

export const fetchMarkets = async () => {
    try {
        const url = `/api/otc/markets`;
        const { data } = await axiosPrivate.get(url);

        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "fetchMarkets", enableSentry: true });
    }
};

export const fetchOTCOffers = async ({ otcId, filters = {}, sort }) => {
    if (!otcId) return [];

    const { sortId = "", sortOrder = "" } = sort || {};
    const queryParams = new URLSearchParams({ ...filters, sortId, sortOrder });

    try {
        const url = `/api/otc/offers/${otcId}`;
        const { data } = await axiosPrivate.get(url);

        return data;
    } catch (error) {
        handleError(ErrorType.FETCHER, error, { methodName: "fetchOTCOffers", enableSentry: true });
        return [];
    }
};

export const fetchOTCHistory = async (offerId) => {
    try {
        const url = `/api/otc/history/${offerId}`;
        const { data } = await axiosPrivate.get(url);
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "fetchOTCHistory", enableSentry: true });
    }
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
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "saveTransaction", enableSentry: true });
    }
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
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "getSignature", enableSentry: true });
    }
};

export const removeTransaction = async (offerId, hash) => {
    try {
        const { data } = await axiosPrivate.post(`/api/otc/${offerId}/remove`, {
            hash,
        });
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "removeTransaction", enableSentry: true });
    }
};
