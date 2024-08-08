import { useCallback } from "react";
import { useRouter } from "next/router";
import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchNotificationList } from "@/fetchers/notifications.fetcher";

export default function useNotificationInfiniteLoader() {
    const router = useRouter();
    const { query } = router;

    const {
        data: { pages = [] } = [],
        isLoading,
        isFetching,
        isError,
        error,
        hasNextPage,
        fetchNextPage,
        fetchPreviousPage,
    } = useInfiniteQuery({
        queryKey: ["notifications", query],
        queryFn: ({ pageParam: offset = 6 }) => {
            return fetchNotificationList({ ...query, offset });
        },
        getNextPageParam: ({ limit, offset, count }) => {
            const cursor = limit + offset;
            const allItems = parseInt(count, 10) ?? 0

            if (cursor >= allItems) return undefined;

            return cursor;
        },
        getPreviousPageParam: ({ offset, limit }) => {
            if (offset <= 0) return undefined;
            const newOffset = offset - limit;

            return newOffset;
        },
        select: data => ({ pages: data.pages.flatMap((page) => page.rows) }),
    });

    const handleInputChange = useCallback((name, value) => {
        router.push({
            pathname: router.pathname,
            query: { ...query, [name]: value },
        });
    }, [router, query]);

    return {
        data: pages,
        isLoading,
        isError,
        isFetching,
        error,
        hasNextPage,
        fetchNextPage,
        getFiltersProps: useCallback(() => ({
            query,
            handleInputChange,
            fetchPreviousPage,
        }), [query, handleInputChange])
    };
};
