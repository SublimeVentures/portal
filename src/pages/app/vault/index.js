import { dehydrate } from "@tanstack/react-query";
import { AppLayout, Metadata } from "@/v2/components/Layout";
import { processServerSideData } from "@/lib/serverSideHelpers";
import routes from "@/routes";
import { authTokenName } from "@/lib/authHelpers";
import { queryClient } from "@/lib/queryCache";
import Investments, { INVESTMENTS_QUERY } from "@/v2/modules/vault/Investments";
import Announcements, { OFFERS_QUERY } from "@/v2/modules/vault/Announcements";
import Payouts, { PAYOUTS_QUERY } from "@/v2/modules/vault/Payouts";
import Statistics from "@/v2/modules/vault/Statistics";
import UpgradeBanner from "@/v2/components/App/Vault/UpgradeBanner";
import { newsQueryOptions } from "@/v2/hooks/useNewsQuery";
import { offersQueryOptions } from "@/v2/hooks/useOffersQuery";
import { investmentsQueryOptions } from "@/v2/hooks/useInvestmentsQuery";
import { vaultStatisticsQueryOptions } from "@/v2/hooks/useVaultStatisticsQuery";
import { storeOwnedItemsQueryOptions } from "@/v2/hooks/useStoreOwnedItemsQuery";
import { payoutsInfiniteQueryOptions } from "@/v2/hooks/usePayoutsInfiniteQuery";

export const getServerSideProps = async ({ req, res }) => {
    return await processServerSideData(req, res, routes.App, async (account, token) => {
        const config = {
            headers: {
                Cookie: `${authTokenName}=${token}`,
            },
        };
        await queryClient.prefetchQuery(vaultStatisticsQueryOptions(null, config));
        await queryClient.prefetchQuery(investmentsQueryOptions(INVESTMENTS_QUERY, config));
        const news = await queryClient.prefetchQuery(newsQueryOptions(null, config));
        await queryClient.prefetchQuery({ ...offersQueryOptions(OFFERS_QUERY, config), disabled: !news });
        await queryClient.prefetchQuery(storeOwnedItemsQueryOptions(null, config));
        await queryClient.prefetchInfiniteQuery(payoutsInfiniteQueryOptions(PAYOUTS_QUERY, config));
        const dehydratedState = dehydrate(queryClient);
        return {
            additionalProps: {
                dehydratedState,
            },
        };
    });
};

function IndexPage() {
    return (
        <>
            <Metadata title="Vault" />
            <div className="grow lg:overflow-y-auto lg:-mx-4 lg:px-4 lg:pb-6 3xl:pb-12">
                <div className="3xl:h-full 3xl:min-h-[888px] flex flex-col gap-8 lg:grid lg:grid-cols-10 lg:gap-8 3xl:gap-x-13 3xl:gap-y-10 3xl:grid-cols-6 3xl:grid-rows-9">
                    <Statistics className="md:col-span-3 3xl:col-span-2 3xl:row-span-4" />
                    <Investments className="md:col-span-7 3xl:col-span-4 3xl:row-span-4" />
                    <div className="flex flex-col gap-8 md:col-span-10 3xl:col-span-6 md:grid md:grid-cols-subgrid 3xl:grid-rows-1 3xl:gap-9 3xl:overflow-hidden 3xl:row-span-5">
                        <Announcements className="md:col-span-5 3xl:col-span-2 md:order-1 3xl:order-1" />
                        <UpgradeBanner className="md:col-span-5 3xl:col-span-1 3xl:mt-9 md:order-2 3xl:order-3" />
                        <Payouts className="md:col-span-10 3xl:col-span-3 flex flex-col md:order-3 3xl:order-2" />
                    </div>
                </div>
            </div>
        </>
    );
}

IndexPage.getLayout = (page) => <AppLayout title="Vault Dashboard">{page}</AppLayout>;

export default IndexPage;
