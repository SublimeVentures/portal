import * as Sentry from "@sentry/nextjs";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";

/**
 * @param {NotificationFilters} filters
 */
export const fetchNotificationList = async (query = {}) => {
    try {
        const { data } = await axiosPrivate.get(API.notificationList, { params: query });

        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchNotificationList" });
        }
    }
    
    return [];
};
