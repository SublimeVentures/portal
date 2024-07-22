import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { getMarkets } from "@/v2/fetchers/otc";

export default function useMarket(USER_ID) {
  const router = useRouter();
  const { market } = router.query;

    const { data: otc = [], isLoading: otcIsLoading } = useQuery({
        queryKey: ["otcMarkets", USER_ID],
        queryFn: () => getMarkets(),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 4 * 60 * 60 * 1000,
        staleTime: 3 * 60 * 60 * 1000,
    });

    const currentMarket = otc?.find((el) => el.slug === market) ?? null;
    const selectedOtc = currentMarket?.otc ?? null;

    return {
        otc,
        currentMarket,
        selectedOtc,
        otcIsLoading,
        length: otc.length,
    }
};
