
import * as Sentry from '@sentry/nextjs'
import {axiosPrivate} from "@/lib/axios/axiosPrivate";

export const fetchHash = async (id, amount, currency, chain) => {
    const url = `/api/invest?id=${id}&amount=${amount}&currency=${currency}&chain=${chain}`
    try {
        const {data} = await axiosPrivate.get(url)
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "fetchHash", e, url});
        }
    }
    return {}
}

export const expireHash = async (id, hash) => {
    const url = `/api/invest/hash?id=${id}&hash=${hash}`
    try {
        const {data} = await axiosPrivate.get(url)
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "expireHash", e,url});
        }
    }
    return {}
}

export const expireBookings = async (id) => {
    const url = `/api/invest/expire?id=${id}`
    try {
        const {data} = await axiosPrivate.get(url)
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "expireHash", e,url});
        }
    }
    return {}
}
