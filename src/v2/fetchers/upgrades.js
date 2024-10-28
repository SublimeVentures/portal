import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from '@/routes';

export const fetchReservedStoreItems = async (userId, tenantId, storeId) => {
    try {
        const { data: reservedItems } = await axiosPrivate.post(API.reservedUpgrades, {
            userId, tenantId, storeId
        });

        if (reservedItems.length > 0) {
            const reservedItem = reservedItems[0];

            return {
                ok: true,
                hasReservation: true,
                ...reservedItem,
            };
        } else {
            return {
                ok: true,
                hasReservation: false,
            };
        }
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchReservedStoreItems", e });
        }
        return null;
    }
};


export const reserveUpgrade = async (params) => {
    try {
        const { data } = await axiosPrivate.post(API.reserveUpgrade, params);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "reserveUpgrade", e });
        }
    }
    return [];
};

export const removeUpgradeBooking = async (params) => {
    try {
        const { data } = await axiosPrivate.post(API.removeUpgradeBooking, params);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "removeUpgradeBooking", e });
        }
    }
    return [];
};

export const signUpgrade = async (params) => {
    try {
        const { data } = await axiosPrivate.post(API.signUpgrade, params);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "signUpgrade", e });
        }
    }
    return [];
};
