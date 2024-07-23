import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";

import Table from "@/v2/components/Table/Table";
import { getOffersHistory  } from "@/v2/fetchers/otc";
import SingleHistoryCard from "./SingleHistoryCard";
import CardSkeleton from "./CardSkeleton";
import useMarket from "@/v2/modules/otc/logic/useMarket";
import { historyColumns as columns } from "../logic/columns";
import useCurrentView from "../logic/useCurrentView";
import { otcViews } from "../logic/constants";

export default function HistoryTable() {
    const { activeView } = useCurrentView();
    const { currentMarket, isLoading: isMarketLoading } = useMarket();
    const otcId = currentMarket?.otc ?? null;

    const [filters, setFilters] = useState({});
    const [sorting, setSorting] = useState([]);

    const { data = [], isLoading: isHistoryLoading } = useQuery({
        queryKey: ["otcHistory", otcId, filters, sorting[0]?.id, sorting[0]?.desc],
        queryFn: () =>
            getOffersHistory({
                offerId: currentMarket?.offerId,
                filters,
                sort: historySorting[0] && {
                    sortId: historySorting[0].id,
                    sortOrder: historySorting[0].desc ? "DESC" : "ASC",
                },
            }),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 3 * 60 * 1000,
        enabled: activeView === otcViews.HISTORY,
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

    const isLoading = isMarketLoading || isHistoryLoading;
  
    return (
        <div>
            <div className="hidden md:block">
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
