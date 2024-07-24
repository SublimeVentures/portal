import * as Sentry from "@sentry/nextjs";

import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API_ROUTES } from "@/v2/routes";

export const getNetwork = async () => {
    try {
        const { data } = await axiosPrivate.get(API_ROUTES.network.getNetwork);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "getMarkets", e });
        }
    }

    return [];
};
