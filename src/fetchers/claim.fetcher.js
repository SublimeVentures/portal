import ErrorType from "../../shared/enum/errorType.enum";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";
import { handleError } from "@/v2/lib/error";

export const getSignature = async (claimId, wallet) => {
    try {
        const { data } = await axiosPrivate.post(`${API.fetchClaim}/sign`, {
            claimId,
            wallet,
        });
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "getSignature", enableSentry: true });
    }
};
