import { useCallback } from "react";
import { useRouter } from "next/router";
import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchNotificationList } from "@/fetchers/notifications.fetcher";
import { mergeNestedArr } from '@/v2/modules/notifications/logic/helpers';

// @TODO
// Refactor when the backend's done
// onEndReached={() => !isFetching && fetchNextPage()}
export default function useNotificationLoader() {
    const router = useRouter();
    const { query } = router;
    const { startDate = '', endDate = null, type = '' } = query;

    const { data, error, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ['notificationList', startDate, endDate, type],
        queryFn: ({ pageParam }) => fetchNotificationList({ page: pageParam, startDate, endDate, type }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            if (lastPage.length === 0) {
              return undefined
            }

            return lastPageParam + 1
          },
          getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
            if (firstPageParam <= 1) {
              return undefined
            }

            return firstPageParam - 1
          },
    })

    const handleInputChange = useCallback((name, value) => {
        router.push({
            pathname: router.pathname,
            query: { ...query, [name]: value },
        });
    }, [router, query]);

    return {
      isLoading: status === "pending",
      isError: status === "error",
      isFetching: isFetching && !isFetchingNextPage,
      notifications: data ? mergeNestedArr(data.pages) : [],
      error,
      getFiltersProps: useCallback(() => ({
          query,
          handleInputChange,
      }), [query, handleInputChange])
    }
};
