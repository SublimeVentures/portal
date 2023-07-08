import * as Sentry from '@sentry/nextjs'
import {axiosPublic} from "@/lib/axios/axiosPublic";
import {clearToken, refreshTokenName, retrieveToken, saveToken} from "@/lib/authHelpers";
import {API} from "@/routes";

export const logIn = async (message, signature) => {
    try {
        const {data} = await axiosPublic.post(API.auth, {message, signature})
        if(data?.refreshToken) {
            saveToken(refreshTokenName, data.refreshToken)
        }
        return data
    } catch (e) {
    }
    return false
}

export const logOut = async () => {
    try {
        clearToken(refreshTokenName)
        const {data} = await axiosPublic.delete(API.auth)
        return data
    } catch (e) {
        Sentry.captureException({location: "logOut", e});
    }
    return false
}

export const refresh = async () => {
    try {
        const {data} = await axiosPublic.put(API.auth, {}, {
                headers: {
                    [refreshTokenName]: `${retrieveToken(refreshTokenName)}`,
                }
            })
        saveToken(refreshTokenName, data.refreshToken)
        return data.refreshToken
    } catch (e) {
    }
    return false
}

export const updateSession_CitCapStaking = async () => {
    try {
        const {data} = await axiosPublic.get(API.updateSession_CitCapStaking, {
                headers: {
                    [refreshTokenName]: `${retrieveToken(refreshTokenName)}`,
                }
            })
        saveToken(refreshTokenName, data.refreshToken)
        console.log("updateSession_CitCapStaking",data)
        return data.refreshToken
    } catch (e) {
    }
    return false
}
