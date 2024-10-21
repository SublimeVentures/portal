import { useRouter } from "next/router";
import { AppLayout, Metadata } from "@/v2/components/Layout";
import {
    InvestmentsList,
    InvestmentsFilters,
    EmptyInvestmentsEnhanced,
    InvestmentsGrid,
} from "@/v2/components/App/Vault";
import { processServerSideData } from "@/lib/serverSideHelpers";
import routes from "@/routes";
import useInvestmentsQuery from "@/v2/hooks/useInvestmentsQuery";

const VIEW_TYPES = {
    LIST: "list",
    GRID: "grid",
};

const VIEWS = [VIEW_TYPES.GRID, VIEW_TYPES.LIST];

const loadingInvestments = Array.from({ length: 10 }, (_, index) => ({ id: index }));

function InvestmentsPage() {
    const router = useRouter();
    const { view = VIEW_TYPES.GRID, ...query } = router.query;
    const { data: { rows: investments = loadingInvestments, count } = { rows: [], count: 0 }, isLoading } =
        useInvestmentsQuery(query);

    return (
        <>
            <Metadata title="My Investments" />
            <InvestmentsFilters
                className="sm:flex-initial mb-4 lg:mb-0"
                count={count}
                views={VIEWS}
                query={{ view, ...query }}
                onChange={(query) => {
                    router.replace({ query });
                }}
            />
            {investments?.length <= 0 && !isLoading ? (
                <div className="md:flex-auto md:pb-13">
                    <EmptyInvestmentsEnhanced />
                </div>
            ) : (
                <div className="grow lg:overflow-y-auto lg:-mx-5 lg:px-5 lg:pr-3 lg:-mt-4 lg:pt-4 lg:pb-4 3xl:-mx-8 3xl:pl-8 3xl:pr-6 3xl:-mt-2 3xl:pt-2 3xl:pb-4">
                    {view === VIEW_TYPES.LIST && <InvestmentsList investments={investments} isLoading={isLoading} />}
                    {view === VIEW_TYPES.GRID && <InvestmentsGrid investments={investments} isLoading={isLoading} />}
                </div>
            )}
        </>
    );
}

InvestmentsPage.getLayout = (page) => <AppLayout title="Vault Investments">{page}</AppLayout>;

export const getServerSideProps = async ({ req, res }) => await processServerSideData(req, res, routes.App);

export default InvestmentsPage;
