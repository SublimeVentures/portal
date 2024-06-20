import { useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { fetchVault } from "@/fetchers/vault.fetcher";
import { getMarkets } from "@/v2/fetchers/otc";
import { queryClient } from "@/lib/queryCache";
import { processServerSideData } from "@/lib/serverSideHelpers";
import OTCMarket from "@/v2/modules/otc/OTCMarket";
import { AppLayout, Metadata } from "@/v2/components/Layout";
import Empty from "@/components/App/Empty";
import Loader from "@/components/App/Loader";
import routes from "@/routes";

export default function AppOtc({ session }) {
    const router = useRouter();
    const { market } = router.query;
    const { userId: USER_ID } = session;

    // const [isMakeModalOpen, setIsMakeModalOpen] = useState(false);
    // const [isMakeModalOpen2, setIsMakeModalOpen2] = useState(false);

    const { data: otc, isLoading: otcIsLoading, isSuccess: otcIsSuccess } = useQuery({
        queryKey: ["otcMarkets", USER_ID],
        queryFn: () => getMarkets(),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 4 * 60 * 60 * 1000,
        staleTime: 3 * 60 * 60 * 1000,
    });

    const { data: vault, isLoading: vaultIsLoading, isSuccess: vaultIsSuccess, refetch: refetchVault } = useQuery({
        queryKey: ["userVault", USER_ID],
        queryFn: fetchVault,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 0,
        staleTime: 0,
    });

    const currentMarket = otc?.find((el) => el.slug === market) ?? null;

    const { data: offers, isLoading: offersIsLoading, isSuccess: offersIsSuccess, refetch: refetchOffers } = useQuery({
        queryKey: ["otcOffers", currentMarket?.otc],
        queryFn: () => fetchOffers(currentMarket?.otc),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        cacheTime: 0,
        staleTime: 0,
        enabled: !!currentMarket?.offerId,
    });
    
    // TODO: Move to hook, create prop getters
    const haveAllocation = vault && currentMarket ? vault.find((el) => el.id === currentMarket.offerId) : null;
    // const { offers, vault, currentMarket: currentMarket2, session, refetchOffers, offersIsSuccess, vaultIsSuccess, table } = propOffers;
    // const makeOfferProps = { allocation: haveAllocation };

    const propOffers = {
        refetchOffers,
        refetchVault,
        vault,
        offersIsSuccess,
        vaultIsSuccess,
        offers,
        currentMarket,
        session,
        allocation: haveAllocation,
    };

    useEffect(() => {
        if (!currentMarket && otc && otc[0]?.slug) router.push(`${routes.OTC}/?market=${otc[0].slug}`, undefined, { shallow: true });
    }, [otc, currentMarket]);

    if (otcIsLoading || vaultIsLoading || !currentMarket) {
        return (
            <>
                <Metadata title="Loading" />
                <Loader />
            </>
        );
    }

    if (otc.length === 0) {
        return (
            <div className="col-span-12 max-h-[40vh]">
                <Metadata title="OTC Market" />
                <Empty />
            </div>
        );
    }

    return <OTCMarket session={session} otc={otc} vault={vault} currentMarket={currentMarket} propOffers={propOffers} />
}

export const getServerSideProps = async ({ req, res }) => {
    await queryClient.prefetchQuery("otcMarkets", () => getMarkets(req.headers.cookie));
    return await processServerSideData(req, res, routes.OTC);
};

AppOtc.getLayout = function (page) {
    return <AppLayout title="OTC Market">{page}</AppLayout>;
};
