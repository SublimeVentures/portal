import mem from "mem";

import { axiosPublic } from "./axiosPublic";
import {clearToken, refreshTokenName, retrieveToken, saveToken} from "@/lib/authHelpers";

const refreshTokenFn = async () => {
    try {
        const response = await axiosPublic.put("/api/auth/login", {}, {
            headers: {
                [refreshTokenName]: `${retrieveToken(refreshTokenName)}`,
            }
        });

        const { refreshToken } = response.data;
        if (refreshToken) {
            clearToken(refreshTokenName)
        }
        saveToken(refreshTokenName, refreshToken)

        return refreshToken;
    } catch (error) {
        clearToken(refreshTokenName)
        return false;
    }
};

const maxAge = 10000;

export const memoizedRefreshToken = mem(refreshTokenFn, {
    maxAge,
});
