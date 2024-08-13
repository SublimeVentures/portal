import * as Sentry from "@sentry/nextjs";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";

export const fetchNotificationChannels = async () => {
    try {
        const { data } = await axiosPrivate.get(API.notificationChannels);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchNotificationChannels", e });
        }
        return {
            channels: [],
            categories: [],
        };
    }
};

export const setNotificationPreferences = async (preferences) => {
    try {
        await axiosPrivate.post(API.setNotificationPreferences, preferences);
        return true;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchNotificationChannels", e });
        }
        return false;
    }
};
