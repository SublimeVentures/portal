import { useRouter } from "next/router";
import { AppLayout } from "@/v2/components/Layout";
import { processServerSideData } from "@/lib/serverSideHelpers";
import PayoutTable, { PayoutTableVariants } from "@/v2/components/App/Vault/PayoutTable";
import routes from "@/routes";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { UpgradeBanner } from "@/v2/components/App/Vault";
import Filters from "@/v2/modules/payouts/Filters";
import usePayoutsInfiniteQuery from "@/v2/modules/payouts/usePayoutsInfiniteQuery";

function PayoutsPage() {
    const isLargeDesktop = useMediaQuery(breakpoints.xxl);
    const tableVariant = isLargeDesktop ? PayoutTableVariants.vertical : PayoutTableVariants.horizontal;
    const { query } = useRouter();
    const { data: { pages = [] } = {}, isLoading } = usePayoutsInfiniteQuery(query);
    return (
        <div className="flex flex-col gap-5 md:h-full md:gap-9 md:px-19 md:pt-9 md:pb-12">
            <header className="flex md:items-center md:gap-5">
                <h1 className="text-white text-2xl">Payouts</h1>
                <Filters />
                <UpgradeBanner className="hidden ml-auto 2xl:block" />
            </header>
            <PayoutTable variant={tableVariant} isLoading={isLoading} pages={pages} />
        </div>
    );
}

PayoutsPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export const getServerSideProps = async ({ req, res }) => await processServerSideData(req, res, routes.App);

export default PayoutsPage;
