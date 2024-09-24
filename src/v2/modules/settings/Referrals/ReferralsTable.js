import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import Table from "@/v2/components/Table/Table";
import { referalsColumns as columns } from "@/v2/modules/settings/logic/columns";

let mockedReferals = [
    {
        id: 1,
        address: "x758878978978978977987897987897897897899201",
        date: 1722851860008,
        volume: 800,
        totalInvestment: 2,
        discount: 10,
        rewards: 1,
    },
    {
        id: 1,
        address: "x758878978978978977987897987897897897899201",
        date: 1722851860008,
        volume: 800,
        totalInvestment: 2,
        discount: 10,
        rewards: 1,
    },
    {
        id: 1,
        address: "x758878978978978977987897987897897897899201",
        date: 1722851860008,
        volume: 800,
        totalInvestment: 2,
        discount: 10,
        rewards: 1,
    },
    {
        id: 1,
        address: "x758878978978978977987897987897897897899201",
        date: 1722851860008,
        volume: 800,
        totalInvestment: 2,
        discount: 10,
        rewards: 1,
    },
    {
        id: 1,
        address: "x758878978978978977987897987897897897899201",
        date: 1722851860008,
        volume: 800,
        totalInvestment: 2,
        discount: 10,
        rewards: 1,
    },
    {
        id: 1,
        address: "x758878978978978977987897987897897897899201",
        date: 1722851860008,
        volume: 800,
        totalInvestment: 2,
        discount: 10,
        rewards: 1,
    },
    {
        id: 1,
        address: "x758878978978978977987897987897897897899201",
        date: 1722851860008,
        volume: 800,
        totalInvestment: 2,
        discount: 10,
        rewards: 1,
    },
    {
        id: 1,
        address: "x758878978978978977987897987897897897899201",
        date: 1722851860008,
        volume: 800,
        totalInvestment: 2,
        discount: 10,
        rewards: 1,
    },
    {
        id: 1,
        address: "x758878978978978977987897987897897897899201",
        date: 1722851860008,
        volume: 800,
        totalInvestment: 2,
        discount: 10,
        rewards: 1,
    },
    {
        id: 1,
        address: "x758878978978978977987897987897897897899201",
        date: 1722851860008,
        volume: 800,
        totalInvestment: 2,
        discount: 10,
        rewards: 1,
    },
];

export default function ReferalsTable() {
    const [sorting, setSorting] = useState([]);

    const table = useReactTable({
        data: mockedReferals,
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

    return (
        <div className="h-full">
            <Table table={table} isLoading={false} colCount={columns.length} />
        </div>
    );
}
