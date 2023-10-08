import * as Sentry from '@sentry/nextjs'
import {axiosPublic} from "@/lib/axios/axiosPublic";
import {API} from "@/routes";

export const fetchPublicInvestments = async () => {
    try {
        const {data} = await axiosPublic.get(API.publicInvestments)
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "fetchPublicInvestments", e});

        }
    }
    return []
}

export const fetchPartners = async () => {
    try {
        const {data} = await axiosPublic.get(API.publicPartners)
        return data
    } catch(e) {

        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "fetchPartners", e});
        }
    }
    return []

}

