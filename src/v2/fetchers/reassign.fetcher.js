import ErrorType from "../../../shared/enum/errorType.enum";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { handleError } from "@/v2/lib/error";

export const reassignOfferAllocation = async (id, currency, to, chain) => {
    const url = `/api/reassign?id=${id}&currency=${currency}&to=${to}&chain=${chain}`;
    try {
        const { data } = await axiosPrivate.get(url);
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "reassignOfferAllocation", enableSentry: true });
    }
};
