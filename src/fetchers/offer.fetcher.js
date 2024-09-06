import * as Sentry from "@sentry/nextjs";
import ErrorType from "../../shared/enum/errorType.enum";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";
import { axiosPublic } from "@/lib/axios/axiosPublic";
import { authTokenName } from "@/lib/authHelpers";
import { handleError } from "@/v2/lib/error";

export const fetchOfferList = async (query, config = {}) => {
    try {
        const { data } = await axiosPrivate.get(API.offerList, { params: { type: "vc", ...query }, ...config });

        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "fetchOfferList", enableSentry: true });
    }
};

export const fetchOfferStats = async () => {
    try {
        const { data } = await axiosPrivate.get(API.offerStats);
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "fetchOfferStats", enableSentry: true });
    }
};

export const fetchOfferProgress = async (offerId) => {
    if (!offerId) return {};

    try {
        const { data } = await axiosPrivate.get(API.offerProgress, {
            params: {
                offerId,
            },
        });
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "fetchOfferProgress", enableSentry: true });
    }
};

export const fetchLaunchpadList = async () => {
    try {
        const { data } = await axiosPrivate.get(`${API.offerList}/?type=launchpad`);
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "fetchLaunchpadList", enableSentry: true });
    }
};

export const fetchOfferDetails = async (slug) => {
    if (!slug) return {};
    try {
        const { data } = await axiosPrivate.get(`${API.offerDetails}${slug}`);
        return data;
    } catch (error) {
        handleError(ErrorType.FETCHER, error, { methodName: "fetchOfferDetails", enableSentry: true });
    }
    return null;
};

export const fetchOfferDetailsSsr = async (slug, token) => {
    if (!slug) return {};
    try {
        const { data } = await axiosPublic.get(`${API.offerDetails}${slug}`, {
            headers: {
                Cookie: `${authTokenName}=${token}`,
            },
        });
        return data;
    } catch (error) {
        handleError(ErrorType.FETCHER, error, { methodName: "fetchOfferDetailsSsr", enableSentry: true });
    }
    return null;
};

export const fetchOfferAllocation = async (id) => {
    if (!id) return {};
    try {
        const { data } = await axiosPrivate.get(`${API.offerAllocation}${id}`);
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "fetchOfferAllocation", enableSentry: true });
    }
};

export const fetchOfferAllocationSsr = async (id, token) => {
    if (!id) return {};
    try {
        const { data } = await axiosPublic.get(`${API.offerAllocation}${id}`, {
            headers: {
                Cookie: `${authTokenName}=${token}`,
            },
        });
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "fetchOfferAllocationSsr", enableSentry: true });
    }
};

export const useUpgrade = async (offerId, upgradeId) => {
    if (!offerId || !upgradeId) return {};
    try {
        const { data } = await axiosPrivate.get(`${API.offerList}/${offerId}/upgrade/${upgradeId}`);
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "useUpgrade", enableSentry: true });
    }
};
