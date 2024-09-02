import { useRouter } from "next/router";
import { AppLayout } from "@/v2/components/Layout";
import { processServerSideData } from "@/lib/serverSideHelpers";
import PayoutTable, { PayoutTableVariants } from "@/v2/components/App/Vault/PayoutTable";
import routes from "@/routes";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import Filters from "@/v2/modules/payouts/Filters";
import usePayoutsInfiniteQuery from "@/v2/modules/payouts/usePayoutsInfiniteQuery";
import Header from "@/v2/components/App/Upgrades/Header";

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
                bannerClassName="hidden sm:block"
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

export const getServerSideProps = async ({ req, res }) => await processServerSideData(req, res, routes.App);

export default PayoutsPage;
