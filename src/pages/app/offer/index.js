import { dehydrate, useQuery } from "@tanstack/react-query";
import { authTokenName } from "@/lib/authHelpers";
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
    const metaData = {
        title: "Opportunities",
        description:
            "Explore all the latest opportunities in the cryptocurrency space. Discover investment prospects, emerging projects, and innovative startups shaping the future of blockchain technology.",
    };

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
                <Metadata {...metaData} />
                <Loader />
            </div>
        );
    }

    if (!pages.length || isOffersError || isStatsError) {
        return (
            <div className="col-span-12 max-h-[40vh]">
                <Metadata {...metaData} />
                <Empty />
            </div>
        );
    }

    return (
        <>
            <Metadata
                title="Opportunities"
                description="Explore all the latest opportunities in the cryptocurrency space. Discover investment prospects, emerging projects, and innovative startups shaping the future of blockchain technology."
            />
            <Opportunities
                offers={pages}
                stats={stats}
                count={count}
                infiniteLoaderOpts={{ isFetchingNextPage, hasNextPage, fetchNextPage }}
            />
        </>
    );
}

export const getServerSideProps = async ({ req, res }) => {
    const customLogicCallback = async (account, token) => {
        const { tenantId: TENANT_ID, partnerId: PARTNER_ID } = account;
        const config = {
            headers: {
                Cookie: `${authTokenName}=${token}`,
            },
        };
        await queryClient.prefetchQuery({
            queryKey: offersKeys.queryOffersVc({ TENANT_ID, PARTNER_ID }),
            queryFn: () => fetchOfferList(null, config),
        });
        await queryClient.prefetchQuery({
            queryKey: offersKeys.queryOffersStats({ TENANT_ID, PARTNER_ID }),
            queryFn: () => fetchOfferStats(null, config),
        });

        return {
            additionalProps: {
                dehydratedState: dehydrate(queryClient),
            },
        };
    };

    return await processServerSideData(req, res, routes.Opportunities, customLogicCallback);
};

AppOpportunities.getLayout = (page) => <AppLayout title="Opportunities">{page}</AppLayout>;
