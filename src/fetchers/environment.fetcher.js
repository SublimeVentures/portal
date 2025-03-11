import { API } from "@/routes";
import { axiosPublic } from "@/lib/axios/axiosPublic";

export const fetchEnvironment = async (token, authTokenName) => {
    try {
        const { data } = await axiosPublic.get(API.environment, {
            headers: {
                Cookie: `${authTokenName}=${token}`,
            },
        });
        return data;
    } catch (e) {
        console.log("ERRROR!fetch env failed");
    }
    return { ok: false };
};
