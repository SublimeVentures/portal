import ErrorType from "../../shared/enum/errorType.enum";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";
import { axiosPublic } from "@/lib/axios/axiosPublic";
import { authTokenName } from "@/lib/authHelpers";
import { handleError } from "@/v2/lib/error";

export const fetchUserWallets = async () => {
    try {
        const { data } = await axiosPrivate.get(API.fetchWallets);
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "fetchUserWallets", enableSentry: true });
    }
};

export const fetchUserWalletsSsr = async (token) => {
    try {
        const { data } = await axiosPublic.get(API.fetchWallets, {
            headers: {
                Cookie: `${authTokenName}=${token}`,
            },
        });
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "fetchUserWalletsSsr", enableSentry: true });
    }
};

export const addUserWallet = async (signature, address, network) => {
    try {
        const { data } = await axiosPrivate.post(`${API.settingsWallet}add`, { signature, address, network });
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "addUserWallet", enableSentry: true });
    }
};

export const removeUserWallet = async (signature) => {
    try {
        const { data } = await axiosPrivate.post(`${API.settingsWallet}remove`, { signature });
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "removeUserWallet", enableSentry: true });
    }
};

export const updateStaking = async (address) => {
    try {
        const { data } = await axiosPrivate.post(API.settingsStake, {
            address,
        });
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "updateStaking", enableSentry: true });
    }
};
