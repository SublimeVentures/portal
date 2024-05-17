import * as Sentry from "@sentry/nextjs";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";
import { tenantIndex } from "@/lib/utils";
import { TENANT } from "@/lib/tenantHelper";

const isBaseVCTenant = tenantIndex === TENANT.basedVC;

export const fetchUserReferralCode = async () => {
    if (isBaseVCTenant) {
        try {
            const { data } = await axiosPrivate.get(API.referral);
            return data;
        } catch (e) {
            if (e?.status && e.status !== 401) {
                Sentry.captureException({ location: "fetchUserReferralCode", e });
            }
        }
    } else {
        throw new Error("Not allowed on current tenant");
    }
    return {};
};

export const fetchUserReferrals = async () => {
    if (isBaseVCTenant) {
        try {
            const { data } = await axiosPrivate.get(`${API.referral}referrals`);
            return data;
        } catch (e) {
            if (e?.status && e.status !== 401) {
                Sentry.captureException({ location: "fetchUserReferrals", e });
            }
        }
    } else {
        throw new Error("Not allowed on current tenant");
    }
    return {};
};

export const createInviteLink = async () => {
    if (isBaseVCTenant) {
        try {
            const { data } = await axiosPrivate.post(`${API.referral}create`);
            return data;
        } catch (e) {
            if (e?.status && e.status !== 401) {
                Sentry.captureException({ location: "createInviteLink", e });
            }
        }
    } else {
        throw new Error("Not allowed on current tenant");
    }
    return {};
};

export const fetchUserReferralClaims = async (offerId) => {
    if (isBaseVCTenant) {
        try {
            const { data } = await axiosPrivate.get(`${API.fetchReferralClaim}/${offerId}`);
            return data;
        } catch (e) {
            if (e?.status && e.status !== 401) {
                Sentry.captureException({ location: "fetchInvestmentReferralClaim", e });
            }
        }
    } else {
        throw new Error("Not allowed on current tenant");
    }
    return [];
};

export const getReferralClaimSignature = async (claimId, wallet) => {
    if (isBaseVCTenant) {
        try {
            const { data } = await axiosPrivate.post(`${API.fetchReferralClaim}/sign`, {
                claimId,
                wallet,
            });
            return data;
        } catch (e) {
            if (e?.status && e.status !== 401) {
                Sentry.captureException({ location: "getSignature", e });
            }
        }
    } else {
        throw new Error("Not allowed on current tenant");
    }
    return {};
}
