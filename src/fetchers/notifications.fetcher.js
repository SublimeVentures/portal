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

export const fetchNotificationPreferences = async () => {
    try {
        const { data } = await axiosPrivate.get(API.notificationPreferences);
        return data.preferences;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchNotificationPreferences", e });
        }
        return {};
    }
};

export const updateNotificationPreferences = async (updates) => {
    try {
        await axiosPrivate.post(API.notificationPreferences, { updates });
        return true;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "updateNotificationPreferences", e });
        }
        return false;
    }
};

export const subscribeToPushCategory = async (categoryId, token) => {
    try {
        const { data } = await axiosPrivate.post(API.subscribeToPush, {
            categoryId,
            token,
        });
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "subscribeToPushTopic", e });
        }
        return {
            ok: false,
            error: e.message,
        };
    }
};
