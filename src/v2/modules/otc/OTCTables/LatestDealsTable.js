import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";

import { latestDealsColumns as columns } from "../logic/columns";
import TableFilters from "./TableFilters";
import CardSkeleton from "./CardSkeleton";
import SingleLatestDealsCard from "./SingleLatestDealsCard";
import useMarket from "@/v2/modules/otc/logic/useMarket";
import Table from "@/v2/components/Table/Table";
import { getLatestDeals } from "@/v2/fetchers/otc";

export default function LatestDealsTable() {
    const { isLoading: isMarketLoading } = useMarket();
    const [sorting, setSorting] = useState([]);

    const { data = [], isLoading: isLatestLoading } = useQuery({
        queryKey: ["otcLatestDeals", sorting[0]?.id, sorting[0]?.desc],
        queryFn: () =>
            getLatestDeals({
                sort: sorting[0] && {
                    sortId: sorting[0].id,
                    sortOrder: sorting[0].desc ? "DESC" : "ASC",
                },
            }),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
    });

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        manualSorting: true,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const isLoading = isMarketLoading || isLatestLoading;

    return (
        <div className="relative flex flex-col h-full">
            <h3 className="mb-4 text-white xl:hidden">Latest deals</h3>
            <div className="hidden grow overflow-hidden md:block">
                <Table table={table} isLoading={isMarketLoading || isLatestLoading} colCount={columns.length} />
            </div>

            <div className="md:hidden">
                {isLoading ? (
                    <div className="flex flex-col gap-4">
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                    </div>
                ) : (
                    <ul className="flex flex-col gap-6">
                        {data.map((offer) => (
                            <li key={offer.id}>
                                <SingleLatestDealsCard {...offer} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
