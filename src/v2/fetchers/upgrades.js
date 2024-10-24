import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API } from '@/routes';

export const fetchReservedStoreItems = async (userId, tenantId, storeId) => {
    try {
        const { data: reservedItems } = await axiosPrivate.post(API.reservedUpgrades, {
            userId, tenantId, storeId
        });

        if (reservedItems.length > 0) {
            const reservedItem = reservedItems[0];
            const expirationTime = reservedItem.expireDate;

            return {
                hasReservation: true,
                expirationTime,
            };
        } else {
            return {
                hasReservation: false,
                expirationTime: null,
            };
        }
    } catch (e) {
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchReservedStoreItems", e });
        }
        return null;
    }
};