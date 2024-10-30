import ErrorType from "../../shared/enum/errorType.enum";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";
import { authTokenName } from "@/lib/authHelpers";
import { axiosPublic } from "@/lib/axios/axiosPublic";
import { handleError } from "@/v2/lib/error";

export const fetchUserInvestment = async (offerId) => {
    try {
        const { data } = await axiosPrivate.get(`${API.offerDetails}${offerId}/state`);
        return data;
    } catch (error) {
        handleError(ErrorType.FETCHER, error, { methodName: "fetchUserInvestment", enableSentry: true });
    }
    return 0;
};

export const fetchUserInvestmentSsr = async (offerId, token) => {
    try {
        const { data } = await axiosPublic.get(`${API.offerDetails}${offerId}/state`, {
            headers: {
                Cookie: `${authTokenName}=${token}`,
            },
        });
        return data;
    } catch (error) {
        handleError(ErrorType.FETCHER, error, { methodName: "fetchUserInvestmentSsr", enableSentry: true });
    }
    return 0;
};

export const fetchVault = async (query, config) => {
    try {
        const { data } = await axiosPrivate.get(API.fetchVault + "/all", {
            params: query,
            ...config,
        });
        return data;
    } catch (error) {
        handleError(ErrorType.FETCHER, error, { methodName: "fetchVault", enableSentry: true });
    }
    return [];
};

export const fetchVaultStats = async (query, config) => {
    try {
        const { data } = await axiosPrivate.get(API.fetchVault + "/stats", {
            params: query,
            ...config,
        });
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "fetchVaultStats", enableSentry: true });
    }
};

export const awaitForReassign = async (vaultId) => {
    try {
        const { data } = await axiosPrivate.get(`${API.reassignVault}/await/${vaultId}`);
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "awaitForReassign", enableSentry: true });
    }
};
