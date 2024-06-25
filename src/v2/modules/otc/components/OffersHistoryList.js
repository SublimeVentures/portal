import { Fragment } from "react";
import { flexRender } from '@tanstack/react-table';

import SkeletonTable from "../components/SkeletonTable";

export default function OffersHistoryList({ data }) {
    const { history: table, isLoading } = data;

    return (
        <div className="p-4">
            <table className="table-inline lg:table">
                <thead className="table-head">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th className="table-head-cell" key={header.id}>
                                    {header.isPlaceholder ? null : (
                                        <div>
                                            {flexRender( header.column.columnDef.header, header.getContext() )}
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {isLoading 
                        ? <SkeletonTable /> 
                        : table.getRowModel().rows.map(row => (
                        <Fragment key={row.id}>
                            <tr className="table-body-row"> 
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="table-data" data-label={cell.column.columnDef.header}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                            <div className='h-3' />
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
