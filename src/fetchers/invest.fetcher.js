import ErrorType from "../../shared/enum/errorType.enum";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { handleError } from "@/v2/lib/error";

export const fetchHash = async (id, amount, currency, chain) => {
    const url = `/api/invest?id=${id}&amount=${amount}&currency=${currency}&chain=${chain}`;
    try {
        const { data } = await axiosPrivate.get(url);
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "fetchHash", enableSentry: true });
    }
};
