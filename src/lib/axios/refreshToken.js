import mem from "mem";
import { axiosPublic } from "./axiosPublic";

const refreshTokenFn = async () => {
    try {
        const response = await axiosPublic.put("/api/auth/login");
        console.log("response refres", response)

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};

const maxAge = 10000;

export const memoizedRefreshToken = mem(refreshTokenFn, {
    maxAge,
});
