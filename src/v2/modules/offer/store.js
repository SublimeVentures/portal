import { create } from "zustand";
import { persist } from "zustand/middleware";

const OFFER_DETAILS_STORE = "OFFER_DETAILS_STORE";

const defaultInitState = {
    offerId: null,
    upgradesUse: null,
};

export const useOfferDetailsStore = create()(
    persist(
        () => ({ ...defaultInitState }),
        { name: OFFER_DETAILS_STORE }
    )
);

export const initStore = ({ offerId, userAllocation }) => {
    const guaranteedUsed = userAllocation?.upgrades?.find((el) => el.id === PremiumItemsENUM.Guaranteed);
    const increasedUsed = userAllocation?.upgrades?.find((el) => el.id === PremiumItemsENUM.Increased);

    useOfferDetailsStore.setState({
        offerId,
        upgradesUse: (guaranteedUsed || increasedUsed) ? { guaranteedUsed, increasedUsed } : null,
    });
};
