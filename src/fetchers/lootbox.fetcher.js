import * as Sentry from '@sentry/nextjs'
import {axiosPrivate} from "@/lib/axios/axiosPrivate";
import {API} from "@/routes";

export const fetchLootbox = async () => {
    try {
        const {data} = await axiosPrivate.get(API.fetchLootbox)
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "fetchLootbox", e});
        }
    }
    return []
}

