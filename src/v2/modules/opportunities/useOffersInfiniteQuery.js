import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchOfferList } from "@/fetchers/offer.fetcher";

export default function useOffersInfiniteQuery(query = {}) {
    return useInfiniteQuery({
        queryKey: ["offers", query],
        queryFn: ({ pageParam: offset }) => fetchOfferList({ ...query, offset }),
        getNextPageParam: ({ limit, offset, count }) => {
            const cursor = limit + offset;
            const allItems = parseInt(count, 10) ?? 0;

            if (cursor >= allItems) {
                return undefined;
            }

            return cursor;
        },
        select: (data) => {
            return {
                count: data.pages[0]?.count ?? 0,
                pages: data.pages.flatMap((page) => page.rows),
            };
        },
    });
}
