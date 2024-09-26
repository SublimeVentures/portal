import { Fragment } from "react";
import { flexRender } from "@tanstack/react-table";

import { Card } from "@/v2/components/ui/card";
import { Skeleton } from "@/v2/components/ui/skeleton";

function SkeletonTable({ span = 4, count = 5 }) {
    return (
        <tr>
            <td colSpan={span}>
                <div>
                    {Array.from({ length: count }).map((_, index) => (
                        <Skeleton key={index} className="h-16 mb-4" />
                    ))}
                </div>
            </td>
        </tr>
    );
}

export default function Table({ table, isLoading, colCount = 4 }) {
    return (
        <Card variant="static" className="p-0 flex flex-col h-full">
            <div className="p-2 h-5 rounded-t bg-gradient-to-r from-primary to-primary-600" />

            <div className="py-2 px-4 h-full min-h-96 block-scrollbar overflow-hidden md:overflow-y-auto">
                <table className="table-inline md:table">
                    <thead className="table-head">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th className="table-head-cell" key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                {...{
                                                    className: header.column.getCanSort() ? "cursor-pointer" : "",
                                                    onClick: header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{ asc: " 🔼", desc: " 🔽" }[header.column.getIsSorted()] ?? null}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <SkeletonTable span={colCount} />
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <Fragment key={row.id}>
                                    <tr className="table-body-row group">
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="table-data group-hover:bg-foreground/[.3]"
                                                data-label={cell.column.columnDef.header}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                </Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
