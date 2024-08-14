import * as Sentry from "@sentry/nextjs";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";
import { axiosPublic } from "@/lib/axios/axiosPublic";
import { authTokenName } from "@/lib/authHelpers";

export const fetchUserWallets = async () => {
    try {
        const { data } = await axiosPrivate.get(API.settingsWallets);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchUserWallets", e });
        };
    };

    return [];
};

export const fetchUserWalletsSsr = async (token) => {
    try {
        const { data } = await axiosPublic.get(API.settingsWallets, {
            headers: {
                Cookie: `${authTokenName}=${token}`,
            },
        });
        return data;
    } catch (e) {

        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchUserWalletsSsr", e });
        }
    }
    return {};
};

export const addUserWallet = async (address, network) => {
    try {
        const { data } = await axiosPrivate.post(API.settingsWallets, { address, network });
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "addUserWallet", e });
        }
    }

    return {};
};

export const removeUserWallet = async (address) => {
    try {
        await axiosPrivate.delete(`${API.settingsWallets}/${address}`);
        
        return { ok: true };
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "removeUserWallet", e });
        }

        return { ok: false, error: e.message || "Unknown error" };
    }
};

export const updateStaking = async (address) => {
    try {
        const { data } = await axiosPrivate.post(API.settingsStake, {
            address,
        });
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "updateStaking", e });
        }
    }
    return {};
};
