import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import Table from "@/v2/components/Table/Table";
import { referalsColumns as columns } from "@/v2/modules/settings/logic/columns";

export default function ReferalsTable() {
    const data = [];
    const [sorting, setSorting] = useState([]);

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

    return (
        <div className="hidden overflow-hidden md:block h-full">
            <Table table={table} isLoading={false} colCount={columns.length} />
        </div>
    );
}
