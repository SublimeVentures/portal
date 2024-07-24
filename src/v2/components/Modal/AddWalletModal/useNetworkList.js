import { useQuery } from "@tanstack/react-query";

import { getNetwork } from "@/v2/fetchers/network";

export const useNetworkList = () => {
    return useQuery({
        queryKey: ["networkList"],
        queryFn: getNetwork,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
    });
};
