import * as Sentry from '@sentry/nextjs'
import {axiosPrivate} from "@/lib/axios/axiosPrivate";
import {API} from "@/routes";


export const fetchInvestmentPayout = async (offerId) => {
    try {
        const {data} = await axiosPrivate.get(`${API.fetchPayout}${offerId}`)
        return data
    } catch(e) {
        if(e?.status && e.status !== 401) {
            Sentry.captureException({location: "fetchVault", e});
        }
    }
    return []
}
