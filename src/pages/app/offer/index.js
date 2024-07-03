import { dehydrate, useQuery, useInfiniteQuery } from "@tanstack/react-query";

import { processServerSideData } from "@/lib/serverSideHelpers";
import { queryClient } from "@/lib/queryCache";
import { cacheOptions } from "@/v2/helpers/query";
import { fetchOfferList, fetchOfferStats } from "@/fetchers/offer.fetcher";
import { AppLayout } from "@/v2/components/Layout";
import { Metadata } from "@/v2/components/Layout";
import Opportunities from "@/v2/modules/opportunities/Opportunities"
import Empty from "@/components/App/Empty";
import Loader from "@/components/App/Loader";
import routes from "@/routes";

const PAGE_LIMIT = 6;

const fetchOffers = async ({ pageParam }) => await fetchOfferList(pageParam, PAGE_LIMIT);

export default function AppOpportunities({ session }) {
    const { tenantId: TENANT_ID, partnerId: PARTNER_ID } = session;

    const { data: statsList, isLoading: isStatsLoading, isError: isStatsError } = useQuery({
        queryKey: ["offerStats", TENANT_ID, PARTNER_ID],
        queryFn: fetchOfferStats,
        ...cacheOptions,
    });

    const { data: offersList, isLoading: isOffersLoading, isError: isOffersError, error, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ["offerList", TENANT_ID, PARTNER_ID],
        queryFn: fetchOffers,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 0,
        ...cacheOptions,
    });

    const offers = offersList?.pages.flatMap(page => page.offers) ?? [];
    const stats = statsList ?? {};

    console.log('offers', offersList)

    if (isOffersLoading || isStatsLoading) {
        return (
            <div className="col-span-12 max-h-[40vh]">
                <Metadata title="Loading" />
                <Loader />
            </div>
        );
    }

    if (!offers.length || isOffersError || isStatsError) {
        return (
            <div className="col-span-12 max-h-[40vh]">
                <Metadata title="Opportunities" />
                <Empty />
            </div>
        );
    }
    
    return <Opportunities offers={offers} stats={stats} infiniteLoaderOpts={{ isFetchingNextPage, hasNextPage, fetchNextPage }}/>
}

export const getServerSideProps = async ({ req, res }) => {
    const customLogicCallback = async (account) => {
        const { tenantId: TENANT_ID, partnerId: PARTNER_ID } = account;
        await queryClient.prefetchQuery(["offerList", TENANT_ID, PARTNER_ID], fetchOfferList);
        await queryClient.prefetchQuery(["offerStats", TENANT_ID, PARTNER_ID], fetchOfferStats);
        
        return {
            additionalProps: {
                dehydratedState: dehydrate(queryClient),
            },
        };
    };

    return await processServerSideData(req, res, routes.Opportunities, customLogicCallback);
};

AppOpportunities.getLayout = (page) => <AppLayout title="Opportunities">{page}</AppLayout>;
