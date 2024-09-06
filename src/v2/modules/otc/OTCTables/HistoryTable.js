import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, getSortedRowModel } from "@tanstack/react-table";

import { historyColumns as columns } from "../logic/columns";
import useCurrentView from "../logic/useCurrentView";
import { otcViews } from "../logic/constants";
import SingleHistoryCard from "./SingleHistoryCard";
import CardSkeleton from "./CardSkeleton";
import TableFilters from "./TableFilters";
import useMarket from "@/v2/modules/otc/logic/useMarket";
import Table from "@/v2/components/Table/Table";
import { getOffersHistory } from "@/v2/fetchers/otc";
import { Card, CardTitle, CardDescription } from "@/v2/components/ui/card";

const Empty = () => {
    return (
        <Card variant="static" className="flex flex-col items-center justify-center h-full gap-4 text-white p-4">
            <div className="h-full w-full flex flex-col gap-4 justify-center items-center bg-foreground/[0.03] py-10">
                <CardTitle className="text-base md:text-lg font-medium text-foreground">
                    No offers history found
                </CardTitle>
                <CardDescription className="max-w-md text-xs md:text-sm font-light text-foreground/50 text-center">
                    The offers history is currently empty, but don't worry! This space will fill up as your investments
                    mature and begin to pay out. Sit back, relax, and watch your returns grow over time.
                </CardDescription>
            </div>
        </Card>
    );
};

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
                                        <SingleHistoryCard currentMarket={currentMarket} {...offer} />
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
