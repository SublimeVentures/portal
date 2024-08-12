import * as Sentry from "@sentry/nextjs";
import ErrorType from "../../shared/enum/errorType.enum";
import { axiosPublic } from "@/lib/axios/axiosPublic";
import { API } from "@/routes";
import { handleError } from "@/v2/lib/error";

export const fetchPublicInvestments = async () => {
    try {
        const { data } = await axiosPublic.get(API.publicInvestments);
        return data;
    } catch (error) {
        handleError(ErrorType.FETCHER, error, { methodName: "logOut", enableSentry: true });
    }
    return [];
};

export const fetchPartners = async () => {
    try {
        const { data } = await axiosPublic.get(API.publicPartners);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchPartners", e });
        }
    }
    return [];
};

export const fetchNeoTokyoEnvs = async () => {
    try {
        const { data } = await axiosPublic.get(API.publicNeoTokyoEnvs);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchNeoTokyoEnvs", e });
        }
    }
    return [];
};

export const fetchCyberKongzEnvs = async () => {
    try {
        const { data } = await axiosPublic.get(API.publicKongzEnvs);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchCyberKongzEnvs", e });
        }
    }
    return [];
};
