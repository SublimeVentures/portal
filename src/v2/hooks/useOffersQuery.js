import { useQuery } from "@tanstack/react-query";
import { fetchOfferList } from "@/fetchers/offer.fetcher";
import { offersKeys } from "@/v2/constants";

export const offersQueryOptions = (query, config) => ({
    queryKey: offersKeys.offers(query),
    queryFn: () => fetchOfferList(query, config),
    staleTime: 1000 * 60 * 5,
});

export default function useOffersQuery(query, options = {}) {
    return useQuery({
        ...offersQueryOptions(query),
        ...options,
    });
}
