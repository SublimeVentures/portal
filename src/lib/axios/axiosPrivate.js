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
            await memoizedRefreshToken();
            return axios(config);
        }
        return Promise.reject(error);
    }
);

export const axiosPrivate = axios;
