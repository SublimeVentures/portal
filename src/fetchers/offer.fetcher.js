import axios from "axios";
import Sentry from "@sentry/nextjs";

export const fetchOfferList = async (acl, address) => {
    let url = `/api/offer`
    if(acl !== undefined) {
        url+= `?acl=${acl}&address=${address}`
    }
    try {
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchOfferList", e,url});
    }
    return {}
}

export const fetchOfferDetails = async (slug, acl, address) => {
    if(!slug) return {}
    let url = `/api/offer/${slug}`
    if(acl !== undefined) {
        url+= `?acl=${acl}&address=${address}`
    }
    try {
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchOfferDetails",slug, address, acl, e, url});
    }
    return {}
}


export const fetchOfferAllocation = async (id) => {
    if(!id) return {}
    let url = `/api/offer/${id}/allocation`
    try {
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchOfferAllocation", e,url});
    }
    return {}
}


