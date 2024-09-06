import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAllPayouts } from "@/fetchers/payout.fetcher";
import { payoutsKeys } from "@/v2/constants";

export const payoutsInfiniteQueryOptions = (query, config) => ({
    queryKey: payoutsKeys.payouts(query),
    queryFn: ({ pageParam: offset }) => fetchAllPayouts({ ...query, offset }, config),
    initialPageParam: 0,
    getNextPageParam: ({ limit, offset, count }) => {
        const cursor = limit + offset;
        if (cursor < count) {
            return undefined;
        }
        return cursor;
    },
    staleTime: 1000 * 60 * 5,
});

export default function usePayoutsInfiniteQuery(query, options = {}) {
    return useInfiniteQuery({
        ...payoutsInfiniteQueryOptions(query),
        ...options,
    });
}
