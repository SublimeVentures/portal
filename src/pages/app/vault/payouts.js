import { useRouter } from "next/router";
import { dehydrate } from "@tanstack/react-query";
import { AppLayout } from "@/v2/components/Layout";
import { processServerSideData } from "@/lib/serverSideHelpers";
import PayoutTable, { PayoutTableVariants } from "@/v2/components/App/Vault/PayoutTable";
import routes from "@/routes";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import Filters from "@/v2/modules/payouts/Filters";
import usePayoutsInfiniteQuery, { payoutsInfiniteQueryOptions } from "@/v2/hooks/usePayoutsInfiniteQuery";
import Header from "@/v2/components/App/Upgrades/Header";
import { authTokenName } from "@/lib/authHelpers";
import { queryClient } from "@/lib/queryCache";

function PayoutsPage() {
    const isLargeDesktop = useMediaQuery(breakpoints.xxl);
    const tableVariant = isLargeDesktop ? PayoutTableVariants.vertical : PayoutTableVariants.horizontal;
    const { query } = useRouter();
    const { data: { pages = [] } = {}, isLoading } = usePayoutsInfiniteQuery(query);
    return (
        <>
            <Header
                title="Payouts"
                className="mb-4 lg:mb-0"
                bannerClassName="hidden sm:flex lg:hidden 2xl:flex"
                count={pages[0]?.count ?? 0}
            >
                <Filters />
            </Header>
            <PayoutTable
                variant={tableVariant}
                isLoading={isLoading}
                pages={pages}
                className="grow lg:overflow-hidden lg:mb-6 3xl:mb-14"
            />
        </>
    );
}

PayoutsPage.getLayout = (page) => <AppLayout title="Vault Payouts">{page}</AppLayout>;

export const getServerSideProps = async ({ req, res, query }) =>
    await processServerSideData(req, res, routes.App, async (account, token) => {
        const config = {
            headers: {
                Cookie: `${authTokenName}=${token}`,
            },
        };
        await queryClient.prefetchInfiniteQuery(payoutsInfiniteQueryOptions(query, config));
        const dehydratedState = dehydrate(queryClient);
        return {
            additionalProps: {
                dehydratedState,
            },
        };
    });

export default PayoutsPage;
