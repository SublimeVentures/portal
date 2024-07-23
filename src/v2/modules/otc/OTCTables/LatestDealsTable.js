import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";

import Table from "@/v2/components/Table/Table";
import { getLatestDeals  } from "@/v2/fetchers/otc";
import CardSkeleton from "./CardSkeleton";
import useMarket from "@/v2/modules/otc/logic/useMarket";
import { latestDealsColumns as columns } from "../logic/columns";
import SingleLatestDealsCard from "./SingleLatestDealsCard";

export default function LatestDealsTable() {
    const { currentMarket, isLoading: isMarketLoading } = useMarket();
    const otcId = currentMarket?.otc ?? null;

    const [filters, setFilters] = useState({});
    const [sorting, setSorting] = useState([]);
    
    const { data = [], isLoading: isLatestLoading } = useQuery({
        queryKey: ["otcLatestDeals", filters, sorting[0]?.id, sorting[0]?.desc],
        queryFn: getLatestDeals,
        //         getOffers({
        //             otcId,
        //             filters,
        //             sort: sorting[0] && {
        //                 sortId: sorting[0].id,
        //                 sortOrder: sorting[0].desc ? "DESC" : "ASC",
        //             },
        //         }),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
        enabled: !otcId,
    });

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        // manualFiltering: true,
        manualSorting: true,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        // getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const isLoading = isMarketLoading || isLatestLoading;
  
    return (
        <div>
            <div className="hidden md:block">
                <Table table={table} isLoading={isMarketLoading || isLatestLoading} colCount={columns.length} />
            </div>
            
            <div className="md:hidden">
                {isLoading? (
                    <div className="flex flex-col gap-4">
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                    </div>
                ) : (
                    <ul className="flex flex-col gap-6">
                        {data.map(offer => (
                            <li key={offer.id}>
                                <SingleLatestDealsCard {...offer} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
