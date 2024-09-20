const axios = require("axios");

export const axiosAutherPublic = axios.create({
    baseURL: process.env.AUTHER,
    headers: {
        "Content-Type": "application/json",
    },
});
