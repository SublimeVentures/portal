import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAllPayouts } from "@/fetchers/payout.fetcher";

const usePayoutsInfiniteQuery = (query = {}) => {
    return useInfiniteQuery({
        queryKey: ["payouts", query],
        queryFn: ({ pageParam: offset = 0 }) => {
            return fetchAllPayouts({ ...query, offset });
        },
        getNextPageParam: ({ limit, offset, count }) => {
            const cursor = limit + offset;
            if (cursor < count) {
                return undefined;
            }
            return cursor;
        },
    });
};

export default usePayoutsInfiniteQuery;
