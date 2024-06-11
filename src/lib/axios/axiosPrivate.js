import axios from "axios";

import { memoizedRefreshToken } from "./refreshToken";

const instance = axios.create({
    baseURL: process.env.DOMAIN,
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error?.config;
        if (error?.response?.status === 401 && !config?.sent) {
            console.log("token expired, refreshing client");
            config.sent = true;
            const refresh = await memoizedRefreshToken();
            if (!refresh) {
                const logoutEvent = new CustomEvent("logoutEvent");
                if (typeof window !== "undefined") {
                    window.dispatchEvent(logoutEvent);
                }
            }
            return axios(config);
        }
        return Promise.reject(error);
    },
);

export const axiosPrivate = instance;
