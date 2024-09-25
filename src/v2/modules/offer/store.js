import { create } from "zustand";
import { persist } from "zustand/middleware";

import { PremiumItemsENUM } from "@/lib/enum/store";
import { userInvestmentState } from "@/lib/investment";
import usePhaseInvestment from "@/v2/hooks/usePhaseInvestment";

const OFFER_DETAILS_STORE = "OFFER_DETAILS_STORE";

const defaultAllocation = {
    allocationUser_max: 0,
    allocationUser_min: 0,
    allocationUser_left: 0,
    allocationUser_invested: 0,
    allocationOffer_left: 0,
    allocationUser_guaranteed: 0,
    offer_isProcessing: false,
    offer_isSettled: false,
};

const defaultInitState = {
    offerId: null,
    upgradesUse: null,
    allocationData: defaultAllocation,
};

export const useOfferDetailsStore = create()(
    persist(
        (set) => ({
            ...defaultInitState,
            setOfferDetails: (offerDetails) => set((state) => {
                if (
                    state.offerId !== offerDetails.offerId ||
                    state.upgradesUse !== offerDetails.upgradesUse ||
                    JSON.stringify(state.allocationData) !== JSON.stringify(offerDetails.allocationData)
                ) {
                    return offerDetails;
                }
                
                return state;
            }),
        }),
        { name: OFFER_DETAILS_STORE }
    ),
);

export const initStore = ({ session, offer, allocation, userAllocation }) => {
    const { phaseCurrent } = usePhaseInvestment();

    const guaranteedUsed = userAllocation?.upgrades?.find((el) => el.id === PremiumItemsENUM.Guaranteed);
    const increasedUsed = userAllocation?.upgrades?.find((el) => el.id === PremiumItemsENUM.Increased);
    const upgradesUse = (guaranteedUsed || increasedUsed) ? { guaranteedUsed, increasedUsed } : null;

    const allocationData = userInvestmentState(
        session,
        offer,
        phaseCurrent,
        upgradesUse,
        userAllocation?.invested?.total,
        allocation || {}
    );

    const { setOfferDetails } = useOfferDetailsStore.getState();

    const newOfferDetails = {
        offerId: offer.id,
        partnerId: session.partnerId,
        upgradesUse,
        allocationData,
    };

    setOfferDetails(newOfferDetails);
};