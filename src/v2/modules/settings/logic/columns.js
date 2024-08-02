import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

const addressColumn = columnHelper.accessor("address", {
    header: "Address",
    cell: (info) => info.row.original.address,
});

const dateColumn = columnHelper.accessor("date", {
    header: "Date",
    cell: (info) => info.row.original.address,
});

const volumeColumn = columnHelper.accessor("volume", {
    header: "Volume",
    cell: (info) => info.row.original.address,
});

const investColumn = columnHelper.accessor("totalInvest", {
    header: "Total Invest",
    cell: (info) => info.row.original.address,
});

const discountColumn = columnHelper.accessor("discount", {
    header: "Discount",
    cell: (info) => info.row.original.address,
});

const rewardsColumn = columnHelper.accessor("rewards", {
    header: "Rewards",
    cell: (info) => info.row.original.address,
});

export const referalsColumns = [addressColumn, dateColumn, volumeColumn, investColumn, discountColumn, rewardsColumn];
