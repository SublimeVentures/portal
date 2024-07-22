import { useEffect } from "react";
import { useRouter } from "next/router";
import { dehydrate, useQuery } from "@tanstack/react-query";

import { fetchOffers } from "@/fetchers/otc.fetcher"
import { fetchVault } from "@/fetchers/vault.fetcher";
import { getMarkets, getMarketsSsr } from "@/v2/fetchers/otc";
import { queryClient } from "@/lib/queryCache";
import { processServerSideData } from "@/lib/serverSideHelpers";
import OTCMarket from "@/v2/modules/otc/OTCMarket";
import { AppLayout, Metadata } from "@/v2/components/Layout";
import Empty from "@/components/App/Empty";
import Loader from "@/components/App/Loader";
import routes from "@/routes";

import useMarket from "@/v2/modules/otc/logic/useMarket";

export default function AppOtc({ session }) {
    const { otcIsLoading, length } = useMarket(session.userId);

    // const { data: otc = [], isLoading: otcIsLoading } = useQuery({
    //     queryKey: ["otcMarkets", USER_ID],
    //     queryFn: () => getMarkets(),
    //     refetchOnMount: false,
    //     refetchOnWindowFocus: false,
    //     cacheTime: 4 * 60 * 60 * 1000,
    //     staleTime: 3 * 60 * 60 * 1000,
    // });

    // const currentMarket = otc?.find((el) => el.slug === market) ?? null;

    // const { data: vault, isLoading: vaultIsLoading, isSuccess: vaultIsSuccess, refetch: refetchVault } = useQuery({
    //     queryKey: ["userVault", USER_ID],
    //     queryFn: fetchVault,
    //     refetchOnMount: false,
    //     refetchOnWindowFocus: false,
    //     cacheTime: 0,
    //     staleTime: 0,
    // });

    // const currentMarket = otc?.find((el) => el.slug === market) ?? null;
    // const selectedOtc = currentMarket?.otc ?? null;

    // const { data: offers = [], isLoading: offersIsLoading, isSuccess: offersIsSuccess, refetch: refetchOffers, ...rest } = useQuery({
    //     queryKey: ["otcOffers", selectedOtc],
    //     queryFn: () => fetchOffers(selectedOtc),
    //     refetchOnMount: true,
    //     refetchOnWindowFocus: true,
    //     cacheTime: 0,
    //     staleTime: 0,
    //     // enabled: !!currentMarket?.offerId,
    // });

    // console.log('data', offers, offersIsLoading, offersIsSuccess, rest)

    // todo - remove and fetch laltest deals
    // useEffect(() => {
    //     if (!currentMarket && otc && otc[0]?.slug) router.push(`${routes.OTC}/?market=${otc[0].slug}`, undefined, { shallow: true });
    // }, [otc, currentMarket]);
    
    // zwraca: {count: 1, rows: Array(1)}
    // const haveAllocation = (vault && currentMarket) ? vault.rows.find((el) => el.offer.id === currentMarket.offerId) : null;
    // console.log('haveAllocation', haveAllocation, vault.rows[0].offer.id, currentMarket.offerId)
    // console.log('offers', selectedOtc, offers, otc, offers)
    // const haveAllocation = null

    // console.log(offers)
    
    // const propOffers = {
    //     // refetchOffers,
    //     // refetchVault,
    //     // vault,
    //     // offersIsSuccess,
    //     // vaultIsSuccess,
    //     // offers,
    //     currentMarket,
    //     session,
    //     // allocation: haveAllocation,
    // };

    // if (otcIsLoading || vaultIsLoading || !currentMarket) {
    if (otcIsLoading) {
        return (
            <>
                <Metadata title="Loading" />
                <Loader />
            </>
        );
    }

    if (length === 0) {
        return (
            <div className="col-span-12 max-h-[40vh]">
                <Metadata title="OTC Market" />
                <Empty />
            </div>
        );
    }

    return <OTCMarket session={session} />
}

export const getServerSideProps = async ({ req, res }) => {
    const customLogicCallback = async (account, token) => {
        const userId = account?.userId;

        await queryClient.prefetchQuery({
            queryKey: ["otcMarkets", userId],
            queryFn: () => getMarketsSsr(token),
        });

        return {
            additionalProps: {
                dehydratedState: dehydrate(queryClient),
            },
        };
    };

    return await processServerSideData(req, res, routes.OTC, customLogicCallback);
};


AppOtc.getLayout = function (page) {
    return <AppLayout title="OTC Market">{page}</AppLayout>;
};
