import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "@/v2/fetchers/news.fetcher";
import { newsKeys } from "@/v2/constants";

export const newsQueryOptions = (query, config) => ({
    queryKey: newsKeys.news(query),
    queryFn: () => fetchNews(query, config),
    staleTime: 1000 * 60 * 5,
});

export default function useNewsQuery(query, options) {
    return useQuery({ ...newsQueryOptions(query), ...options });
}
