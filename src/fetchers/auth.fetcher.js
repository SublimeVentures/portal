import { axiosPublic } from "@/lib/axios/axiosPublic";
import { API } from "@/routes";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { authTokenName } from "@/lib/authHelpers";

export const logIn = async (message, signature, tenant, partner, type) => {
    try {
        const { data } = await axiosPublic.post(API.auth, { message, signature, tenant, partner, type });
        return data;
    } catch (e) {
        return {
            ok: false,
            error: e.response?.data?.error || "Error processing login",
        };
    }
};

export const logOut = async () => {
    try {
        const { data } = await axiosPrivate.delete(API.auth);
        return data;
    } catch (e) {}
    return false;
};

export const logOutRefresh = async () => {
    try {
        const { data } = await axiosPrivate.delete(API.auth, {
            data: { softLogout: true },
        });
        return data;
    } catch (e) {}
    return false;
};

export const updateUser = async (update) => {
    try {
        const { data } = await axiosPrivate.patch(API.user, update);
        return data;
    } catch (error) {
        return {
            ok: false,
            error,
        };
    }
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
