import * as Sentry from "@sentry/nextjs";
import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from "@/routes";

export const fetchReservedItems = async (userId, tenantId, storeId) => {
    try {
        const { data: reservedItems } = await axiosPrivate.post(API.reservedMysteryBox, {
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

export const reserveMysterybox = async (params) => {
    try {
        const { data } = await axiosPrivate.post(API.reserveMysteryBox, params);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "reserveMysterybox", e });
        }
    }
    return [];
};

export const removeMysteryBoxBooking = async (params) => {
    try {
        const { data } = await axiosPrivate.post(API.removeMysteryBoxBooking, params);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "removeMysteryBoxBooking", e });
        }
    }
    return [];
};

export const signMysteryBox = async (params) => {
    try {
        const { data } = await axiosPrivate.post(API.signMysteryBox, params);
        return data;
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "signMysteryBox", e });
        }
    }
    return [];
};
