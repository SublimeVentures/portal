import ErrorType from "../../shared/enum/errorType.enum";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { handleError } from "@/v2/lib/error";
import { API } from "@/routes";

export const fetchStakingData = async () => {
    try {
        const { data } = await axiosPrivate.get(API.stakingData);

        console.log("------TEST-----", data);

        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "fetchHash", enableSentry: true });
    }
};
