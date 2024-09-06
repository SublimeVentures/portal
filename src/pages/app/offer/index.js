import { dehydrate, useQuery } from "@tanstack/react-query";

import { processServerSideData } from "@/lib/serverSideHelpers";
import { queryClient } from "@/lib/queryCache";
import { cacheOptions } from "@/v2/helpers/query";
import { fetchOfferList, fetchOfferStats } from "@/fetchers/offer.fetcher";
import { AppLayout, Metadata } from "@/v2/components/Layout";
import Opportunities from "@/v2/modules/opportunities/Opportunities";
import useOffersInfiniteQuery from "@/v2/modules/opportunities/useOffersInfiniteQuery";
import Empty from "@/components/App/Empty";
import Loader from "@/components/App/Loader";
import routes from "@/routes";

import { offersKeys } from "@/v2/constants";

export default function AppOpportunities({ session }) {
    const { tenantId: TENANT_ID, partnerId: PARTNER_ID } = session;

    const {
        data,
        isLoading: isOffersLoading,
        isError: isOffersError,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useOffersInfiniteQuery();

    const { pages = [], count } = data || {};

    const {
        data: stats = {},
        isLoading: isStatsLoading,
        isError: isStatsError,
    } = useQuery({
        queryKey: offersKeys.queryOffersStats({ TENANT_ID, PARTNER_ID }),
        queryFn: fetchOfferStats,
        ...cacheOptions,
    });

    if (isOffersLoading || isStatsLoading) {
        return (
            <div className="col-span-12 max-h-[40vh]">
                <Metadata title="Loading" />
                <Loader />
            </div>
        );
    }

    if (!pages.length || isOffersError || isStatsError) {
        return (
            <div className="col-span-12 max-h-[40vh]">
                <Metadata title="Opportunities" />
                <Empty />
            </div>
        );
    }

    return (
        <Opportunities
            offers={pages}
            stats={stats}
            count={count}
            infiniteLoaderOpts={{ isFetchingNextPage, hasNextPage, fetchNextPage }}
        />
    );
}

export const getServerSideProps = async ({ req, res }) => {
    const customLogicCallback = async (account) => {
        const { tenantId: TENANT_ID, partnerId: PARTNER_ID } = account;
        
        await queryClient.prefetchQuery(offersKeys.queryOffersVc({ TENANT_ID, PARTNER_ID }), fetchOfferList);
        await queryClient.prefetchQuery(offersKeys.queryOffersStats({ TENANT_ID, PARTNER_ID }), fetchOfferStats);

        return {
            additionalProps: {
                dehydratedState: dehydrate(queryClient),
            },
        };
    };

    return await processServerSideData(req, res, routes.Opportunities, customLogicCallback);
};

AppOpportunities.getLayout = (page) => <AppLayout title="Opportunities">{page}</AppLayout>;
