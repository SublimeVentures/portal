import { axiosPublic } from "@/lib/axios/axiosPublic";
import { API } from "@/routes";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";

export const logIn = async (message, signature, tenant, partner, type, referralCode) => {
    try {
        const { data } = await axiosPublic.post(API.auth, { message, signature, tenant, partner, type, referralCode });
        return data;
    } catch (e) {}
    return false;
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
