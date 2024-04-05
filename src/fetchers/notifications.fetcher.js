import * as Sentry from "@sentry/nextjs";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";

/**
 * @typedef {Record<string, string | number | undefined>} NotificationFilters
 * @property {string | number | undefined} type
 * @property {number | undefined} offerId
 */

/**
 * @param {NotificationFilters} filters
 */
export const fetchNotificationList = async (filters) => {
    try {
        const queryParams = {};
        if (filters.type) queryParams["type"] = filters.type;
        if (filters.offerId) queryParams["offerId"] = filters.offerId;
        const query = new URLSearchParams(queryParams);
        const { data } = await axiosPrivate.get(`${API.notificationList}?${query}`);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchOfferList" });
        }
    }
    return {};
};
