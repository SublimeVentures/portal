import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { AppLayout } from "@/v2/components/Layout";
import { processServerSideData } from "@/lib/serverSideHelpers";
import PayoutTable, { PayoutTableVariants } from "@/v2/components/App/Vault/PayoutTable";
import routes from "@/routes";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { fetchAllPayouts } from "@/fetchers/payout.fetcher";
import { FilterButton, exclude } from "@/v2/components/App/Vault/InvestmentsFilters";
import {
    DropdownMenu,
    DropdownMenuButton,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuLabelReset,
    DropdownMenuCheckboxItem,
} from "@/v2/components/ui/dropdown-menu";
import FilterAltIcon from "@/v2/assets/svg/filter-alt.svg";
import { UpgradeBanner } from "@/v2/components/App/Vault";

export const usePayoutsInfiniteQuery = (query = {}) => {
    return useInfiniteQuery({
        queryKey: ["payouts", query],
        queryFn: ({ pageParam: offset = 0 }) => {
            return fetchAllPayouts({ ...query, offset });
        },
        getNextPageParam: ({ limit, offset, count }) => {
            const cursor = limit + offset;
            if (cursor < count) {
                return undefined;
            }
            return cursor;
        },
    });
};

const FILTERS = {
    IS_UPCOMING: "isUpcoming",
    IS_PENDING: "isPending",
    Is_SOON: "isSoon",
};

const FILTERS_LABELS = {
    IS_UPCOMING: "Upcoming",
    IS_PENDING: "Pending",
    Is_SOON: "Soon",
};

const Filters = () => {
    const router = useRouter();
    const { query } = router;
    return (
        <div className="flex items-center flex-wrap gap-2 md:gap-4">
            <DropdownMenu>
                <DropdownMenuButton variant="tertiary" icon={FilterAltIcon}>
                    Filters
                </DropdownMenuButton>
                <DropdownMenuContent>
                    <DropdownMenuLabel>
                        Filters
                        <DropdownMenuLabelReset
                            onClick={() => {
                                router.replace({ query: exclude(query, ...Object.values(FILTERS)) });
                            }}
                        >
                            Reset
                        </DropdownMenuLabelReset>
                    </DropdownMenuLabel>
                    {Object.keys(FILTERS).map((key) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={key}
                                checked={query[FILTERS[key]] ? true : false}
                                onCheckedChange={(checked) => {
                                    router.replace({
                                        query: {
                                            ...exclude(query, FILTERS[key]),
                                            ...(checked ? { [FILTERS[key]]: true } : {}),
                                        },
                                    });
                                }}
                            >
                                {FILTERS_LABELS[key]}
                            </DropdownMenuCheckboxItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
            {Object.keys(FILTERS).map((key) => {
                if (query[FILTERS[key]]) {
                    return (
                        <FilterButton
                            key={key}
                            onClick={() => {
                                router.replace({ query: exclude(query, FILTERS[key]) });
                            }}
                        >
                            {FILTERS_LABELS[key]}
                        </FilterButton>
                    );
                }
                return null;
            })}
        </div>
    );
};

function PayoutsPage() {
    const isLargeDesktop = useMediaQuery(breakpoints.xxl);
    const tableVariant = isLargeDesktop ? PayoutTableVariants.vertical : PayoutTableVariants.horizontal;
    const { query } = useRouter();
    const { data: { pages = [] } = {}, isLoading } = usePayoutsInfiniteQuery(query);
    return (
        <div className="flex flex-col gap-5 md:h-full md:gap-13 md:p-13">
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
