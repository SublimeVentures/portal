import { createColumnHelper } from "@tanstack/react-table";
import { getFormattedDate, shortenAddress } from "@/v2/lib/helpers";

const columnHelper = createColumnHelper();

const addressColumn = columnHelper.accessor("address", {
    header: "Address",
    cell: (info) => <div className="text-accent">{shortenAddress(info.row.original.address)}</div>,
});
const dateColumn = columnHelper.accessor("date", {
    header: "Date",
    cell: (info) => getFormattedDate(info.row.original.date),
});

const volumeColumn = columnHelper.accessor("volume", {
    header: "Volume",
    cell: (info) => `${info.row.original.volume}$`,
});

const investColumn = columnHelper.accessor("totalInvestment", {
    header: "Total Invest",
    cell: (info) => info.row.original.totalInvestment,
});

const discountColumn = columnHelper.accessor("discount", {
    header: "Discount",
    cell: (info) => `${info.row.original.discount}%`,
});

const rewardsColumn = columnHelper.accessor("rewards", {
    header: "Rewards",
    cell: (info) => `${info.row.original.rewards}%`,
});

export const referalsColumns = [addressColumn, dateColumn, volumeColumn, investColumn, discountColumn, rewardsColumn];
