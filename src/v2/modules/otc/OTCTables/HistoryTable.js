import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, getSortedRowModel } from "@tanstack/react-table";

import useMarket from "@/v2/modules/otc/logic/useMarket";
import Table from "@/v2/components/Table/Table";
import { getOffersHistory  } from "@/v2/fetchers/otc";
import SingleHistoryCard from "./SingleHistoryCard";
import CardSkeleton from "./CardSkeleton";
import TableFilters from "./TableFilters";
import { historyColumns as columns } from "../logic/columns";
import useCurrentView from "../logic/useCurrentView";
import { otcViews } from "../logic/constants";

export default function HistoryTable() {
    const { activeView } = useCurrentView();
    const { currentMarket, isLoading: isMarketLoading } = useMarket();
    const offerId = currentMarket?.offerId ?? null;

    const [sorting, setSorting] = useState([]);

    const { data = [], isLoading: isHistoryLoading } = useQuery({
        queryKey: ["otcHistory", offerId, sorting[0]?.id, sorting[0]?.desc],
        queryFn: () =>
            getOffersHistory({
                offerId,
                sort: sorting[0] && {
                    sortId: sorting[0].id,
                    sortOrder: sorting[0].desc ? "DESC" : "ASC",
                },
            }),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 3 * 60 * 1000,
        enabled: activeView === otcViews.history,
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

    const isLoading = isMarketLoading || isHistoryLoading;
  
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <TableFilters />
            <div className="hidden grow overflow-hidden md:block">
                <Table table={table} isLoading={isLoading} colCount={columns.length} />
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
                            <li key={offer.offerId}>
                                <SingleHistoryCard currentMarket={currentMarket}  {...offer} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
