import { useQuery } from "@tanstack/react-query";
import { fetchVault } from "@/fetchers/vault.fetcher";
import { vaultKeys } from "@/v2/constants";

const fetchInvestments = async (query, config) => {
    return await fetchVault(query, config);
};

export const investmentsQueryOptions = (query, config) => ({
    queryKey: vaultKeys.vault(query),
    queryFn: () => fetchInvestments(query, config),
});

export default function useInvestmentsQuery(query, options) {
    return useQuery({ ...investmentsQueryOptions(query), ...options });
}
