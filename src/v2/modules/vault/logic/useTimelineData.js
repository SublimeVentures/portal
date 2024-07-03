import { useQuery } from "@tanstack/react-query";

import { fetchNotificationList } from "@/fetchers/notifications.fetcher";

const options = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  cacheTime: 5 * 60 * 1000,
  staleTime: 3 * 60 * 1000,
}

export default function useTimelineData(offerId) {
    const { data, isLoading, isSuccess } = useQuery({
        queryKey: ["offerNotificationList", offerId],
        queryFn: () => fetchNotificationList({ offerId }),
        ...options,
    });

    return {
        notifications: data,
        isLoading,
        isSuccess,
    };
}
