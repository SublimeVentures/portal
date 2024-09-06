import { useQuery } from "@tanstack/react-query";
import { fetchStoreItemsOwned } from "@/fetchers/store.fetcher";
import { storeOwnedItemsKeys } from "@/v2/constants";

export const storeOwnedItemsQueryOptions = (query, config) => ({
    queryKey: storeOwnedItemsKeys.storeOwnedItems(query),
    queryFn: () => fetchStoreItemsOwned(query, config),
    staleTime: 1000 * 60 * 5,
});

export default function useStoreOwnedItemsQuery(query, options = {}) {
    return useQuery({
        ...storeOwnedItemsQueryOptions(query),
        ...options,
    });
}
