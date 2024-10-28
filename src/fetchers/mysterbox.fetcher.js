import * as Sentry from "@sentry/nextjs";
import ErrorType from "../../shared/enum/errorType.enum";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";
import { handleError } from "@/v2/lib/error";

export const claimMysterybox = async () => {
    try {
        const { data } = await axiosPrivate.get(API.claimMysterybox);
        return data;
    } catch (error) {
        handleError(ErrorType.FETCHER, error, { methodName: "claimMysterybox", enableSentry: true });
    }
    return [];
};
