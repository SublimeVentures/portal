import ErrorType from "../../shared/enum/errorType.enum";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { handleError } from "@/v2/lib/error";

// id, amount, feePercentage, currency, chain
export const fetchTest = async () => {
    // const url = `/api/staking?id=${id}&amount=${amount}&feePercentage=${feePercentage}&currency=${currency}&chain=${chain}`;
    const url = `/api/staking`;

    try {
        const { data } = await axiosPrivate.get(url);

        return data.data.data.data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "fetchHash", enableSentry: true });
    }
};
