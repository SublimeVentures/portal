import { useQuery } from "@tanstack/react-query";
import { fetchVault } from "@/fetchers/vault.fetcher";
import { vaultKeys } from "@/v2/constants";

const fetchInvestments = async (query, config) => {
    const data = await fetchVault(query, config);
    return data?.rows || [];
};

export const investmentsQueryOptions = (query, config) => ({
    queryKey: vaultKeys.vault(query),
    queryFn: () => fetchInvestments(query, config),
    staleTime: 1000 * 60 * 5,
});

export default function useInvestmentsQuery(query, options) {
    return useQuery({ ...investmentsQueryOptions(query), ...options });
}
