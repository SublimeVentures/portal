import * as Sentry from "@sentry/nextjs";

import { axiosPrivate } from "@/lib/axios/axiosPrivate";

export const fetchNews = async () => {
    try {
        const { data } = await axiosPrivate.get("/api/news");
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "getNews", e });
        }
    }

    return null;
};
