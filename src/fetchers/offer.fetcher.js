import * as Sentry from "@sentry/nextjs";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";
import { axiosPublic } from "@/lib/axios/axiosPublic";
import { authTokenName } from "@/lib/authHelpers";

export const fetchOfferList = async () => {
    try {
        const { data } = await axiosPrivate.get(`${API.offerList}/?type=vc`);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchOfferList" });
        }
    }
    return {};
};

export const fetchLaunchpadList = async () => {
    try {
        const { data } = await axiosPrivate.get(`${API.offerList}/?type=launchpad`);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchLaunchpadList" });
        }
    }
    return {};
};

export const fetchOfferDetails = async (slug) => {
    if (!slug) return {};
    try {
        const { data } = await axiosPrivate.get(`${API.offerDetails}${slug}`);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchOfferDetails", slug });
        }
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
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchOfferDetails", slug });
        }
    }
    return null;
};

export const fetchOfferAllocation = async (id) => {
    if (!id) return {};
    try {
        const { data } = await axiosPrivate.get(`${API.offerAllocation}${id}`);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchOfferAllocation", e });
        }
    }
    return {};
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
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchOfferAllocation", e });
        }
    }
    return {};
};

export const useUpgrade = async (offerId, upgradeId) => {
    if (!offerId || !upgradeId) return {};
    try {
        const { data } = await axiosPrivate.get(`${API.offerList}/${offerId}/upgrade/${upgradeId}`);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "useUpgrade", e });
        }
    }
    return {};
};
