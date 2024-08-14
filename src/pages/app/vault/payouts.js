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
        <div className="flex flex-col gap-5 md:gap-9 md:py-9 3xl:pt-12 md:px-12 3xl:px-19 grow overflow-hidden">
            <Header title="Payouts">
                <Filters />
            </Header>
            <PayoutTable variant={tableVariant} isLoading={isLoading} pages={pages} className="grow overflow-hidden" />
        </div>
    );
}

PayoutsPage.getLayout = (page) => <AppLayout title="Vault Payouts">{page}</AppLayout>;

export const getServerSideProps = async ({ req, res }) => await processServerSideData(req, res, routes.App);

export default PayoutsPage;
