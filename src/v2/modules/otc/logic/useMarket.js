import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { useSession } from "../logic/store";
import { getMarkets } from "@/v2/fetchers/otc";

export default function useMarket() {
    const { userId: USER_ID, partnerOtcFee } = useSession();
    const router = useRouter();
    const { market } = router.query;

    const { data: markets = [], isLoading } = useQuery({
        queryKey: ["otcMarkets", USER_ID],
        queryFn: () => getMarkets(),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 4 * 60 * 60 * 1000,
        staleTime: 3 * 60 * 60 * 1000,
    });

    const currentMarket = markets?.find((el) => el.slug === market) ?? null;

    const marketsCount = markets?.length;

    const handleResetMarket = () => {
        const { market, ...restQuery } = router.query;
        router.replace(
            {
                pathname: router.pathname,
                query: restQuery,
            },
            undefined,
            { shallow: true },
        );
    };

    return {
        markets,
        marketsCount,
        currentMarket,
        isLoading,
        handleResetMarket,
        partnerOtcFee,
    };
}
