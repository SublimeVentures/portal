import { useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import usePhaseInvestment from "@/v2/hooks/usePhaseInvestment";
import { fetchOfferAllocation, fetchOfferDetails } from "@/fetchers/offer.fetcher";
import { fetchUserInvestment } from "@/fetchers/vault.fetcher";
import { fetchStoreItemsOwned } from "@/fetchers/store.fetcher";
import { useOfferDetailsStore } from "@/v2/modules/offer/store";
import { offersKeys, userInvestmentsKeys } from "@/v2/constants";

export function useOfferDetailsQuery() {
    const router = useRouter();
    const { slug } = router.query;

    const { error, refetch, ...data } = useQuery({
        queryKey: offersKeys.offerDetails(slug),
        queryFn: () => fetchOfferDetails(slug),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 30 * 60 * 1000,
        staleTime: 15 * 60 * 1000,
    });

    useEffect(() => {
        try {
            if (error) {
                refetch().then(() => {
                    if (error) {
                        throw Error("Offer details fetch fail");
                    }
                });
            }
        } catch (error) {
            router.push(PAGE.Opportunities);
        }
    }, [error, refetch]);

    return data;
}

export function useOfferAllocationQuery() {
    const router = useRouter();
    const { offerId } = useOfferDetailsStore();
    const { isClosed } = usePhaseInvestment();

    const { error, refetch, ...data } = useQuery({
        queryKey: offersKeys.offerAllocation(offerId),
        queryFn: () => fetchOfferAllocation(offerId),
        refetchOnMount: false,
        refetchOnWindowFocus: true,
        refetchInterval: isClosed ? false : 15000,
        enabled: Boolean(offerId),
    });

    useEffect(() => {
        try {
            if (error) {
                refetch().then(() => {
                    if (error) {
                        throw Error("Offer allocations fetch fail");
                    }
                });
            }
        } catch (error) {
            router.push(PAGE.Opportunities);
        }
    }, [error, refetch]);

    return data;
}

export function useUserAllocationQuery() {
    const { offerId } = useOfferDetailsStore();
    const { isClosed } = usePhaseInvestment();

    const { error, refetch, ...data } = useQuery({
        queryKey: userInvestmentsKeys.userAllocation(offerId),
        queryFn: () => fetchUserInvestment(offerId),
        refetchOnMount: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 15 * 1000,
        refetchOnWindowFocus: !isClosed,
        enabled: Boolean(offerId),
    });

    useEffect(() => {
        try {
            if (error) {
                refetch().then(() => {
                    if (error) {
                        throw Error("User allocations fetch fail");
                    }
                });
            }
        } catch (error) {
            router.push(PAGE.Opportunities);
        }
    }, [error, refetch]);

    return data;
}

// @TODO - Create fetch SSR
export function useUserPremiumQuery() {
    const { error, refetch, ...data } = useQuery({
        queryKey: userInvestmentsKeys.premiumOwned(),
        queryFn: fetchStoreItemsOwned,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 5 * 60 * 1000,
    });

    return data;
}
