import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import { cn } from "@/lib/cn";

const columnHelper = createColumnHelper();

const intFilter = (row, id, filterValue) =>
    String(row.original[id]).toLowerCase().startsWith(filterValue.toLowerCase());

const idColumn = columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => `${info.getValue().toLocaleString()}`,
});

const carryFee = columnHelper.accessor("carryPercentage", {
    header: "CARRY FEE",
    cell: (info) => `$${info.getValue().toLocaleString()}`,
    filterFn: intFilter,
});

const haircutFee = columnHelper.accessor("haircutPercentage", {
    header: "HAIRCUT FEE",
    cell: (info) => `$${info.getValue().toLocaleString()}`,
    filterFn: intFilter,
});

const payouts = columnHelper.accessor("referralPayouts.length", {
    header: "PAYOUTS",
    cell: (info) => info.getValue(),
    filterFn: intFilter,
});

const referredOn = columnHelper.accessor('createdAt', {
    header: 'REFERRED ON',
    cell: info => info.getValue(),
    filterFn: intFilter,

});

export const referrals = [ idColumn, carryFee, haircutFee, payouts, referredOn ];
