import axios from "axios";
import * as Sentry from '@sentry/nextjs'

export const fetchUserInvestment = async (offerId) => {
    try {
        const url = `/api/vault?offer=${offerId}`
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchUserInvestment", e});
    }
    return 0
}

export const fetchVault = async (acl, address) => {
    let url = `/api/vault/all`
    if(acl !== undefined) {
        url+= `?acl=${acl}&address=${address}`
    }
    try {
        const {data} = await axios.get(url)
        return data
    } catch(e) {
        Sentry.captureException({location: "fetchVault", e, url});
    }
    return []
}

