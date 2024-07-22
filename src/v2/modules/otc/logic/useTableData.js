import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";

import { offersFilters } from "../utils/filters";
import { getOffers, getOffersHistory, getLatestDeals } from "@/v2/fetchers/otc";
import { getOffersColumns, getHistoryColumns, getLatestDealsColumns } from "@/v2/modules/otc/utils/columns";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import useMarket from "@/v2/modules/otc/logic/useMarket";

export default function useTableData(session, showHistory) {
    const { cdn, getCurrencySymbolByAddress, account } = useEnvironmentContext();
    const { userId, wallets } = session;
    const { selectedOtc, currentMarket } = useMarket(userId)

    const [filters, setFilters] = useState({});
    const [offersSorting, setOffersSorting] = useState([]);
    const [historySorting, setHistorySorting] = useState([]);
    const [latestSorting, setLatestSorting] = useState([]);

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

    // const offerColumns = useMemo(
    //     () => getOffersColumns(getCurrencySymbolByAddress, wallets, account, propOffers),
    //     [getCurrencySymbolByAddress, wallets, account],
    // );

    const offerColumns = useMemo(
        () => getOffersColumns(getCurrencySymbolByAddress, wallets, account, session),
        [getCurrencySymbolByAddress, wallets, account, session],
    );

    const historyColumns = useMemo(() => getHistoryColumns(getCurrencySymbolByAddress), [getCurrencySymbolByAddress]);

    const latestColumns = useMemo(() => getLatestDealsColumns(cdn), [cdn]);

    const {
        data: offers,
        isSuccess: offersIsSuccess,
        isLoading: offersIsLoading,
        isError: offersIsError,
        refetch: refetchOffers,
    } = useQuery({
        queryKey: ["otcOffers", selectedOtc, filters, offersSorting[0]?.id, offersSorting[0]?.desc],
        queryFn: () =>
            getOffers({
                otcId: selectedOtc,
                filters,
                sort: offersSorting[0] && {
                    sortId: offersSorting[0].id,
                    sortOrder: offersSorting[0].desc ? "DESC" : "ASC",
                },
            }),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
        enabled: !!selectedOtc,
    });

    const {
        data: history,
        isSuccess: historyIsSuccess,
        isLoading: historyIsLoading,
        isError: historyIsError,
    } = useQuery({
        queryKey: ["otcHistory", currentMarket?.offerId, historySorting[0]?.id, historySorting[0]?.desc],
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
        enabled: showHistory,
    });

    const {
        data: latest,
        isSuccess: latestIsSuccess,
        isLoading: latestIsLoading,
        isError: latestIsError,
    } = useQuery({
        queryKey: ["otcLatestDeals"],
        // queryFn: () => getLatestDeals(),
        queryFn: getLatestDeals,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
    });

    useEffect(() => {
        if (!showHistory) refetchOffers();
    }, [showHistory]);

    const offersTable = useReactTable({
        data: offers ?? [],
        columns: offerColumns,
        state: {
            sorting: offersSorting,
        },
        manualFiltering: true,
        manualSorting: true,
        onSortingChange: setOffersSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const historyTable = useReactTable({
        data: history ?? [],
        columns: historyColumns,
        state: {
            sorting: historySorting,
        },
        manualSorting: true,
        onSortingChange: setHistorySorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const latestTable = useReactTable({
        data: latest ?? [],
        columns: latestColumns,
        state: {
            sorting: latestSorting,
        },
        manualSorting: true,
        onSortingChange: setLatestSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return {
        latest: latestTable,
        offers: offersTable,
        history: historyTable,
        isLoading: offersIsLoading || historyIsLoading || latestIsLoading,
        isSuccess: offersIsSuccess || historyIsSuccess || latestIsSuccess,
        isError: offersIsError || historyIsError || latestIsError,
        filterProps: {
            filters,
            handleToggleFilter,
            handleFilterRemove,
        },
    };
}
