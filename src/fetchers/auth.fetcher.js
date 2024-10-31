import IPData from "ipdata";
import CryptoJS from "crypto-js";
import { axiosPublic } from "@/lib/axios/axiosPublic";
import { API } from "@/routes";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { simpleEncrypt } from "@/lib/utils";

const ipdata = new IPData(`${process.env.IPDATA_API_KEY}`, {
    max: 1000,
    maxAge: 10 * 60 * 1000,
});

const fetchIp = async () => {
    try {
        const ipinfo = await ipdata.lookup(); // Fetch IP data
        const ip = ipinfo.ip;
        const country = ipinfo.country_code;

        return JSON.stringify({ ip, country });
    } catch (error) {
        console.error("Error fetching IP address:", error);
    }
};

const fetchAndEncryptIp = async () => {
    try {
        const { country_code } = await ipdata.lookup();

        return simpleEncrypt(JSON.stringify({ country_code }), process.env.IPDATA_SECRET_KEY);
    } catch (error) {
        console.error("Error fetching IP address:", error);
    }
};

export const logIn = async (message, signature, tenant, partner, type) => {
    try {
        const clientInfo = await fetchAndEncryptIp();
        const { data } = await axiosPublic.post(API.auth, { message, signature, tenant, partner, type, clientInfo });
        return data;
    } catch (e) {}
    return false;
};

export const logOut = async () => {
    try {
        const { data } = await axiosPrivate.delete(API.auth);
        return data;
    } catch (e) {}
    return false;
};

export const logOutRefresh = async () => {
    try {
        const { data } = await axiosPrivate.delete(API.auth, {
            data: { softLogout: true },
        });
        return data;
    } catch (e) {}
    return false;
};
