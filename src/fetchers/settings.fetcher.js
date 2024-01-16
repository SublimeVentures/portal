import * as Sentry from '@sentry/nextjs'
import {axiosPrivate} from "@/lib/axios/axiosPrivate";
import {API} from "@/routes";
import {axiosPublic} from "@/lib/axios/axiosPublic";
import {authTokenName, refreshTokenName} from "@/lib/authHelpers";


export const fetchUserWallets = async () => {
    try {
        const {data} = await axiosPrivate.get(API.fetchWallets)
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "fetchUserWallets", e});
        }
    }
    return {}
}

export const fetchUserWalletsSsr = async (token) => {
    try {
        const {data} = await axiosPublic.get(API.fetchWallets, {
            headers: {
                Cookie: `${authTokenName}=${token}`
            }
        })
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "fetchUserWalletsSsr", e});
        }
    }
    return {}
}



export const addUserWallet = async (signature) => {
    try {
        const {data} = await axiosPrivate.post(`${API.settingsWallet}add`, {signature})
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "addUserWallet", e});
        }
    }
    return {}
}


export const removeUserWallet = async (signature) => {
    try {
        const {data} = await axiosPrivate.post(`${API.settingsWallet}remove`, {signature})
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "removeUserWallet", e});
        }
    }
    return {}
}

export const updateStaking = async (address) => {
    try {
        const {data} = await axiosPrivate.post(API.settingsStake, {address})
        return data
    } catch (e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "updateStaking", e});
        }
    }
    return {}
}
