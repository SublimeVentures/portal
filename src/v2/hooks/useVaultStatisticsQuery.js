import { useQuery } from "@tanstack/react-query";
import { fetchVaultStats } from "@/fetchers/vault.fetcher";
import { vaultKeys } from "@/v2/constants";

export const vaultStatisticsQueryOptions = (query, config) => ({
    queryKey: vaultKeys.vaultStats(query),
    queryFn: () => fetchVaultStats(query, config),
    staleTime: 1000 * 60 * 5,
});

export default function useVaultStatisticsQuery(query, options) {
    return useQuery({ ...vaultStatisticsQueryOptions(query), ...options });
}
