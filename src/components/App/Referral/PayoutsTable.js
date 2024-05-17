import {
    useReactTable, flexRender, createColumnHelper, getCoreRowModel, getPaginationRowModel, getSortedRowModel
} from '@tanstack/react-table';
import { Fragment, useMemo, useState } from "react";
import TableActions from './TableActions';

const PayoutsTable = ({ dataProp }) => {
    const data = useMemo(() => dataProp, [dataProp]);

    const [sorting, setSorting] = useState([])

    const columnHelper = createColumnHelper();

    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: 'ID',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('currencySymbol', {
                header: 'Currency',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('totalAmount', {
                header: 'Total Amount',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('createdAt', {
                header: 'Created At',
                cell: info => info.getValue(),
            }),
        ],
        []
    );

    const Table = ({
        data,
        columns,
    }) => {
        const table = useReactTable({
            data,
            columns,
            state: {
                sorting,
            },
            columnResizeMode: 'onChange',
            columnResizeDirection: 'ltr',
            onSortingChange: setSorting,
            getCoreRowModel: getCoreRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
        })

        return (
            <div className="p-2 w-full overflow-x-auto">
                <div className="h-2" />
                <h4 className='text-xl mb-4'>Payouts</h4>
                <table>
                    <thead className="bg-navy-2">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="font-bold text-sm text-left sm:py-4 sm:px-2 border"
                                        {...{
                                            style: {
                                                width: header.getSize(),
                                            },
                                        }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : (
                                                <div
                                                    {...{
                                                        className: header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: ' 🔼',
                                                        desc: ' 🔽',
                                                    }[header.column.getIsSorted()] ?? null}
                                                </div>
                                            )}

                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <Fragment key={`payout-${row.id}`}>
                                <tr className='border'>
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            className="group border text-sm px-5 py-3 relative text-left sm:py-4 overflow-hidden truncate"
                                            {...{
                                                style: {
                                                    width: cell.column.getSize(),
                                                },
                                            }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            </Fragment>
                        )
                        )}
                    </tbody>
                </table>
                <div className="h-2" />
                <TableActions table={table} />
            </div>
        )
    }


    return (
        <Table
            {...{
                data,
                columns,
            }}
        />
    );
};

export default PayoutsTable;
