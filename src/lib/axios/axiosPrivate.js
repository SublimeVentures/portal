import axios from "axios";

import { memoizedRefreshToken } from "./refreshToken";

axios.defaults.baseURL = process.env.DOMAIN;
axios.defaults.headers = {
    "Content-Type": "application/json",
};

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error?.config;
        if (error?.response?.status === 401 && !config?.sent) {
            console.log("token expired, refreshing client")
            config.sent = true;
            const refresh = await memoizedRefreshToken();
            if(!refresh) {
                const logoutEvent = new CustomEvent('logoutEvent');
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(logoutEvent);
                }
            }
            return axios(config);
        }
        return Promise.reject(error);
    }
);

export const axiosPrivate = axios;
