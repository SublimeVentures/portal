import ErrorType from "../../shared/enum/errorType.enum";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";
import { handleError } from "@/v2/lib/error";

/**
 * @param {NotificationFilters} filters
 */
export const fetchNotificationList = async (filters = {}) => {
    try {
        const params = {};
        if (filters.page) params["page"] = filters.page;
        if (filters.type) params["type"] = filters.type;
        if (filters.startDate) params["startDate"] = filters.startDate;
        if (filters.endDate) params["endDate"] = filters.endDate;
        if (filters.offerId) params["offerId"] = filters.offerId;

        const { data } = await axiosPrivate.get(API.notificationList, { params });

        return data;
    } catch (error) {
        handleError(ErrorType.FETCHER, error, { methodName: "fetchNotificationList", enableSentry: true });
    }

    return [];
};
