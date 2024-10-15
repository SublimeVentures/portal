import ErrorType from "../../../shared/enum/errorType.enum";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { handleError } from "@/v2/lib/error";

export const reassignOfferAllocation = async (id, currency, to, chain, sender) => {
    const url = `/api/reassign?id=${id}&currency=${currency}&to=${to}&chain=${chain}&sender=${sender}`;
    try {
        const { data } = await axiosPrivate.get(url);
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "reassignOfferAllocation", enableSentry: true });
    }
};
