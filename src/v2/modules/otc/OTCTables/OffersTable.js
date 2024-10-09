import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";

import useMarket from "../logic/useMarket";
import { offerColumns as columns } from "../logic/columns";
import { offersFilters } from "../logic/filters";
import SingleOfferCard from "./SingleOfferCard";
import CardSkeleton from "./CardSkeleton";
import TableFilters from "./TableFilters";
import Table from "@/v2/components/Table/Table";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { getOffers } from "@/v2/fetchers/otc";
import { Card, CardTitle, CardDescription } from "@/v2/components/ui/card";

const Empty = () => {
    return (
        <Card
            variant="static"
            className="flex flex-col items-center justify-center h-full gap-4 text-white p-4 cursor-default"
        >
            <div className="h-full w-full flex flex-col gap-4 justify-center items-center bg-foreground/[0.03] py-10">
                <CardTitle className="text-base md:text-lg font-medium text-foreground">No offers found</CardTitle>
                <CardDescription className="max-w-md text-xs md:text-sm font-light text-foreground/50 text-center">
                    The offers tab is currently empty, but don&rsquo;t worry! This space will fill up as your
                    investments mature and begin to pay out. Sit back, relax, and watch your returns grow over time.
                </CardDescription>
            </div>
        </Card>
    );
};

export default function OffersTable() {
    const { account } = useEnvironmentContext();
    const { currentMarket, isLoading: isMarketLoading } = useMarket();
    const otcId = currentMarket?.otc ?? null;

    const [filters, setFilters] = useState({});
    const [sorting, setSorting] = useState([]);

    const handleToggleFilter = (filterId) => {
        const selectedFilter = offersFilters.find((f) => f.id === filterId).filter;
        setFilters((prev) => {
            const newFilters = { ...prev };
            if (filterId === "only-me") {
                if (newFilters.maker) {
                    delete newFilters.maker;
                } else {
                    newFilters.maker = account.address;
                }
            } else {
                if (newFilters.isSell !== undefined && newFilters.isSell === selectedFilter.isSell) {
                    delete newFilters.isSell;
                } else {
                    newFilters.isSell = selectedFilter.isSell;
                }
            }

            return newFilters;
        });
    };

    const handleFilterRemove = (filterKey) => {
        setFilters((prev) => {
            const newFilters = { ...prev };
            delete newFilters[filterKey];
            return newFilters;
        });
    };

    const { data = [], isLoading: isOffersLoading } = useQuery({
        queryKey: ["otcOffers", otcId, filters, sorting[0]?.id, sorting[0]?.desc],
        queryFn: () =>
            getOffers({
                otcId,
                filters,
                sort: sorting[0] && {
                    sortId: sorting[0].id,
                    sortOrder: sorting[0].desc ? "DESC" : "ASC",
                },
            }),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
        enabled: !!otcId,
    });

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        manualFiltering: true,
        manualSorting: true,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const isLoading = isMarketLoading || isOffersLoading;
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <TableFilters
                filters={filters}
                handleToggleFilter={handleToggleFilter}
                handleFilterRemove={handleFilterRemove}
            />
            <div className="hidden grow overflow-hidden md:block">
                {data.length === 0 && !isLoading ? (
                    <Empty />
                ) : (
                    <Table table={table} isLoading={isLoading} colCount={columns.length} />
                )}
            </div>
            <div className="md:hidden">
                {isLoading ? (
                    <div className="flex flex-col gap-4">
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                    </div>
                ) : (
                    <>
                        {data.length > 0 ? (
                            <ul className="flex flex-col gap-6">
                                {data.map((offer) => (
                                    <li key={offer.offerId}>
                                        <SingleOfferCard currentMarket={currentMarket} offer={offer} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Empty />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
