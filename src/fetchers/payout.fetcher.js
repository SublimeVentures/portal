import ErrorType from "../../shared/enum/errorType.enum";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";
import { handleError } from "@/v2/lib/error";

export const fetchInvestmentPayout = async (offerId) => {
    try {
        const { data } = await axiosPrivate.get(`${API.fetchPayout}${offerId}`);
        return data;
    } catch (error) {
        handleError(ErrorType.FETCHER, error, { methodName: "fetchInvestmentPayout", enableSentry: true });
    }
    return [];
};

export const fetchAllPayouts = async (query) => {
    try {
        const { data } = await axiosPrivate.get(API.fetchPayout, { params: query });
        return data;
    } catch (error) {
        handleError(ErrorType.FETCHER, error, { methodName: "fetchAllPayouts", enableSentry: true });
    }
    return { count: 0, rows: [] };
};
