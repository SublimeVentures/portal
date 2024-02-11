import * as Sentry from '@sentry/nextjs'
import {axiosPrivate} from "@/lib/axios/axiosPrivate";
import {API} from "@/routes";
import {authTokenName} from "@/lib/authHelpers";
import {axiosPublic} from "@/lib/axios/axiosPublic";


export const getSignature = async (claimId, wallet) => {
    try {
        const {data} = await axiosPrivate.post(`${API.fetchClaim}/sign`, {
            claimId,
            wallet
        })
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "getSignature", e});
        }
    }
    return {}
}
