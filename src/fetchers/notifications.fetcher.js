import ErrorType from "../../shared/enum/errorType.enum";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";
import { handleError } from "@/v2/lib/error";
import { tenantIndex } from "@/lib/utils";

/**
 * @param {NotificationFilters} filters
 */
export const fetchNotificationList = async (query = {}) => {
    try {
        const { data } = await axiosPrivate.get(API.notificationList, { params: query });

        return data;
    } catch (error) {
        handleError(ErrorType.FETCHER, error, { methodName: "fetchNotificationList", enableSentry: true });
    }

    return [];
};

export const fetchNotificationChannelsWithCategories = async () => {
    try {
        const { data } = await axiosPrivate.get(API.notificationChannels);
        return data;
    } catch (e) {
        handleError(ErrorType.FETCHER, e, {
            methodName: "fetchNotificationChannelsWithCategories",
            enableSentry: true,
        });
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
        handleError(ErrorType.FETCHER, e, { methodName: "fetchNotificationPreferences", enableSentry: true });
        return {};
    }
};

/**
 * @typedef {object} NotificationPreferenceUpdate
 * @property {string} categoryId
 * @property {string} channelId
 * @property {boolean} enabled
 */

/**
 * @param {NotificationPreferenceUpdate[]} updates
 * @returns {Promise<boolean>}
 */
export const updateNotificationPreferences = async (updates) => {
    try {
        await axiosPrivate.post(API.notificationPreferences, { updates });
        return true;
    } catch (e) {
        handleError(ErrorType.FETCHER, e, { methodName: "updateNotificationPreferences", enableSentry: true });
        return false;
    }
};

export const subscribeToPushCategory = async (categoryId, token) => {
    try {
        const { data } = await axiosPrivate.post(API.pushSubscription, {
            categoryId,
            token,
        });
        return data;
    } catch (e) {
        handleError(ErrorType.FETCHER, e, { methodName: "subscribeToPushCategory", enableSentry: true });
        return {
            ok: false,
            error: e.message,
        };
    }
};

export const unsubscribeFromPushCategory = async (categoryId, token) => {
    try {
        const { data } = await axiosPrivate.delete(API.pushSubscription, {
            data: {
                categoryId,
                token,
                tenantId: tenantIndex,
            },
        });
        return data;
    } catch (e) {
        handleError(ErrorType.FETCHER, e, { methodName: "unsubscribeFromPushCategory", enableSentry: true });
        return {
            ok: false,
            error: e.message,
        };
    }
};
