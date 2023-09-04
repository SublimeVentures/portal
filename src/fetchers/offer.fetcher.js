import * as Sentry from '@sentry/nextjs'
import {axiosPrivate} from "@/lib/axios/axiosPrivate";
import {API} from "@/routes";

export const fetchOfferList = async () => {

    try {
        const {data} = await axiosPrivate.get(API.offerList)
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "fetchOfferList"});
        }
    }
    return {}
}

export const fetchOfferDetails = async (slug) => {
    if(!slug) return {}
    try {
        const {data} = await axiosPrivate.get(`${API.offerDetails}${slug}`)
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "fetchOfferDetails", slug});
        }
    }
    return null
}


export const fetchOfferAllocation = async (id) => {
    if(!id) return {}
    try {
        const {data} = await axiosPrivate.get(`${API.offerList}/${id}/allocation`)
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "fetchOfferAllocation", e});
        }
    }
    return {}
}

export const useUpgrade = async (offerId, upgradeId) => {
    if(!offerId || !upgradeId) return {}
    try {
        const {data} = await axiosPrivate.get(`${API.offerList}/${offerId}/upgrade/${upgradeId}`)
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "useUpgrade", e});
        }
    }
    return {}
}


export const getUpgrades = async (offerId) => {
    if(!offerId) return {}
    try {
        const {data} = await axiosPrivate.get(`${API.offerList}/${offerId}/upgrade`)
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "getUpgrades", e});
        }
    }
    return {}
}


