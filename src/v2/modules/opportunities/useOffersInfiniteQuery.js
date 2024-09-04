import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchOfferList } from "@/fetchers/offer.fetcher";
import { offersKeys } from "@/v2/constants";

export default function useOffersInfiniteQuery(query = {}) {
    return useInfiniteQuery({
        queryKey: offersKeys.queryOffersVc(query),
        queryFn: ({ pageParam: offset = 0 }) => fetchOfferList({ ...query, offset }),
        getNextPageParam: ({ limit, offset, count }) => {
            const cursor = limit + offset;
            const allItems = parseInt(count, 10) ?? 0;

            if (cursor >= allItems) {
                return undefined;
            }

            return cursor;
        },
        select: (data) => ({ pages: data.pages.flatMap((page) => page.rows) }),
    });
}
