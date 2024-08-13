import ErrorType from "../../shared/enum/errorType.enum";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";
import { handleError } from "@/v2/lib/error";

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
