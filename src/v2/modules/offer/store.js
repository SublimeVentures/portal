import { create } from "zustand";
import { persist } from "zustand/middleware";

const OFFER_DETAILS_STORE = "OFFER_DETAILS_STORE";

const defaultInitState = {
    // offerId: null,
    // userId: null,
    // tenantId: null,
    // isAllocationRefetchEnabled: false,
    // isExtraQueryEnabled: false,
    // offerIsClosed: false,
    // phaseDetails: null,
    // guaranteedUsed: null,
    // increasedUsed: null,
};

export const useOfferDetailsStore = create()(
    persist(
        () => ({ ...defaultInitState }),
        { name: OFFER_DETAILS_STORE }
    )
);

// export const setInitialData = ({ offerId, userId, tenantId }) => useOfferDetailsStore.setState({ offerId, userId, tenantId })

