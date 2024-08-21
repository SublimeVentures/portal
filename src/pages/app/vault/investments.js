import { useQuery } from "@tanstack/react-query";
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
import { fetchVault } from "@/fetchers/vault.fetcher";

const VIEW_TYPES = {
    LIST: "list",
    GRID: "grid",
};

const VIEWS = [VIEW_TYPES.GRID, VIEW_TYPES.LIST];

const fetchInvestments = async (query) => {
    const data = await fetchVault(query);
    return data?.rows || [];
};

export const useInvestments = (query) =>
    useQuery({
        queryKey: ["investments", query],
        queryFn: () => fetchInvestments(query),
    });

const loadingInvestments = Array.from({ length: 10 }, (_, index) => ({ slug: index }));

function InvestmentsPage() {
    const router = useRouter();
    const { view = VIEW_TYPES.GRID, ...query } = router.query;
    const { data: investments = loadingInvestments, isLoading } = useInvestments(query);

    return (
        <>
            <Metadata title="My Investments" />
            <InvestmentsFilters
                className="md:flex-initial"
                investments={investments}
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
                <div className="grow overflow-y-auto lg:-mx-5 lg:px-5 lg:pr-3 lg:-mt-4 lg:pt-4 lg:pb-4 3xl:-mx-8 3xl:pl-8 3xl:pr-6 3xl:-mt-2 3xl:pt-2 3xl:pb-4">
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
