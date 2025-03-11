import mem from "mem";
import { axiosPublic } from "./axiosPublic";

const refreshTokenFn = async () => {
    try {
        const response = await axiosPublic.put("/api/auth/login");

        return response.status === 200;
    } catch (error) {
        return false;
    }
};

const maxAge = 10000;

export const memoizedRefreshToken = mem(refreshTokenFn, {
    maxAge,
});
