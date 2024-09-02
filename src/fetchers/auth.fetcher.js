import ErrorType from "../../shared/enum/errorType.enum";
import { axiosPublic } from "@/lib/axios/axiosPublic";
import { API } from "@/routes";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { handleError } from "@/v2/lib/error";

export const logIn = async (message, signature, tenant, partner, type) => {
    try {
        const { data } = await axiosPublic.post(API.auth, { message, signature, tenant, partner, type });
        return data;
    } catch (error) {
        handleError(ErrorType.FETCHER, error, { methodName: "logIn", enableSentry: true });
    }
    return false;
};

export const logOut = async () => {
    try {
        const { data } = await axiosPrivate.delete(API.auth);
        return data;
    } catch (error) {
        handleError(ErrorType.FETCHER, error, { methodName: "logOut", enableSentry: true });
    }
    return false;
};
export const logOutRefresh = async () => {
    try {
        const { data } = await axiosPrivate.delete(API.auth, {
            data: { softLogout: true },
        });
        return data;
    } catch (error) {
        handleError(ErrorType.FETCHER, error, { methodName: "logOutRefresh", enableSentry: true });
    }
    return false;
};

export const fetchUser = async (config) => {
    try {
        const queryConfig = config?.token
            ? {
                  headers: {
                      Cookie: `${authTokenName}=${config.token}`,
                  },
              }
            : {};
        const { data } = await axiosPrivate.get(API.user, { ...queryConfig });
        return data;
    } catch (error) {
        return {
            ok: false,
            error,
        };
    }
};
