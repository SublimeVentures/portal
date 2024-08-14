import ErrorType from "../../../shared/enum/errorType.enum";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { handleError } from "@/v2/lib/error";

export const fetchReferals = async () => {
    try {
        const { data } = await axiosPrivate.get("/api/referals");
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "fetchReferals", enableSentry: true });
    }
};
