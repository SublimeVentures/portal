import ErrorType from "../../shared/enum/errorType.enum";
import { API } from "@/routes";
import { axiosPublic } from "@/lib/axios/axiosPublic";
import { handleError } from "@/v2/lib/error";

export const fetchEnvironment = async (token, authTokenName) => {
    try {
        const { data } = await axiosPublic.get(API.environment, {
            headers: {
                Cookie: `${authTokenName}=${token}`,
            },
        });
        return data;
    } catch (error) {
        return handleError(ErrorType.FETCHER, error, { methodName: "fetchEnvironment", enableSentry: true });
    }
};
