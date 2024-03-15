import * as Sentry from "@sentry/nextjs";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";
import { authTokenName } from "@/lib/authHelpers";
import { axiosPublic } from "@/lib/axios/axiosPublic";

export const fetchUserInvestment = async (offerId) => {
    try {
        const { data } = await axiosPrivate.get(
            `${API.offerDetails}${offerId}/state`,
        );
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchUserInvestment", e });
        }
    }
    return 0;
};

export const fetchUserInvestmentSsr = async (offerId, token) => {
    try {
        const { data } = await axiosPublic.get(
            `${API.offerDetails}${offerId}/state`,
            {
                headers: {
                    Cookie: `${authTokenName}=${token}`,
                },
            },
        );
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchUserInvestment", e });
        }
    }
    return 0;
};

export const fetchVault = async () => {
    try {
        const { data } = await axiosPrivate.get(API.fetchVault);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchVault", e });
        }
    }
    return [];
};
