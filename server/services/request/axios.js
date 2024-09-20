const axios = require("axios");

const axiosAutherPublic = axios.create({
    baseURL: process.env.AUTHER,
    headers: {
        "Content-Type": "application/json",
    },
});

module.exports = { axiosAutherPublic };
