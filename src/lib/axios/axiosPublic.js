import axios from "axios";

export const axiosPublic = axios.create({
    baseURL: process.env.DOMAIN,
    headers: {
        "Content-Type": "application/json",
    },
});
