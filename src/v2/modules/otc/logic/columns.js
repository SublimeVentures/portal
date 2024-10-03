import Image from "next/image";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";
import { IoCloseCircleOutline as IconCancel } from "react-icons/io5";

import TakeOfferModal from "../Modals/TakeOfferModal";
import CancelOfferModal from "../Modals/CancelOfferModal";
import { useSession } from "../logic/store";
import { DynamicIcon, DynamicIconGroup } from "@/v2/components/ui/dynamic-icon";
import { Button } from "@/v2/components/ui/button";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { NETWORKS } from "@/lib/utils";
import { cn } from "@/lib/cn";
import { routes } from "@/v2/routes";

// @todo - refactor old components
import { Tooltiper, TooltipType } from "@/components/Tooltip";

const columnHelper = createColumnHelper();

const intFilter = (row, id, filterValue) =>
    String(row.original[id]).toLowerCase().startsWith(filterValue.toLowerCase());

const isUserOffer = (userWallets, checkWallet, account) => ({
    ok: userWallets.includes(checkWallet),
    isActive: account?.address === checkWallet,
});

const isSellColumn = columnHelper.accessor("isSell", {
    header: "Type",
    cell: (info) => {
        const isSell = info.getValue();
        return (
            <span className={cn("text-base", isSell ? "text-error" : "text-success")}>{isSell ? "Sell" : "Buy"}</span>
        );
    },
});

const allocationColumn = columnHelper.accessor("amount", {
    header: "Allocation",
    cell: (info) => `$${info.getValue().toLocaleString()}`,
    filterFn: intFilter,
});

const priceColumn = columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => `$${info.getValue().toLocaleString()}`,
    filterFn: intFilter,
});

const multiplierColumn = columnHelper.accessor("multiplier", {
    header: "Multiplier",
    cell: (info) => `${info.getValue().toFixed(2)}x`,
    filterFn: intFilter,
});

const dateColumn = columnHelper.accessor("updatedAt", {
    header: "Date",
    cell: (info) => moment(info.getValue()).utc().local().format("YYYY-MM-DD"),
    filterFn: intFilter,
});

const detailsColumn = columnHelper.accessor("details", {
    header: "Details",
    cell: (info) => {
        const slug = info.row.original.slug;

        return (
            <Button asChild size="small" variant="accent" className="w-full">
                <Link href={`${routes.Opportunities}/${slug}`}>Details</Link>
            </Button>
        );
    },
    enableSorting: false,
});

const chainColumn = columnHelper.accessor("chain", {
    header: "Chain",
    cell: (info) => {
        const { getCurrencySymbolByAddress } = useEnvironmentContext();
        return (
            <DynamicIconGroup>
                <DynamicIcon name={getCurrencySymbolByAddress(info.row.original.currency)} />
                <DynamicIcon name={NETWORKS[info.row.original.chainId]} />
            </DynamicIconGroup>
        );
    },
    enableSorting: false,
});

const marketColumn = columnHelper.accessor("name", {
    header: "Market",
    cell: (info) => {
        const { cdn } = useEnvironmentContext();
        const slug = info.row.original.slug;

        return (
            <span className="flex items-center gap-2">
                <Image src={`${cdn}/research/${slug}/icon.jpg`} className="rounded" alt={slug} width={30} height={30} />
                {info.getValue()}
            </span>
        );
    },
    enableSorting: false,
});

const actionColumn = columnHelper.accessor("action", {
    header: "Action",
    cell: (info) => {
        const { wallets } = useSession();
        const { account } = useEnvironmentContext();

        const ownership = isUserOffer(wallets, info.row.original.maker, account);
        const offerDetails = info.row.original;

        return (
            <div className="flex flex-row justify-end gap-1 lg:justify-stretch">
                {ownership.ok &&
                    (ownership.isActive ? (
                        <CancelOfferModal offerDetails={offerDetails} className="w-full" />
                    ) : (
                        <Tooltiper
                            wrapper={
                                <div className="disabled duration-300 hover:text-error cursor-pointer">
                                    <IconCancel className="w-6 h-6" />
                                </div>
                            }
                            text="Created from other wallet"
                            type={TooltipType.Error}
                        />
                    ))}

                {!ownership.ok && <TakeOfferModal offerDetails={offerDetails} className="w-full" />}
            </div>
        );
    },
    enableSorting: false,
});

export const offerColumns = [isSellColumn, allocationColumn, priceColumn, multiplierColumn, chainColumn, actionColumn];

export const historyColumns = [isSellColumn, allocationColumn, priceColumn, multiplierColumn, chainColumn, dateColumn];

export const latestDealsColumns = [marketColumn, isSellColumn, multiplierColumn, dateColumn, detailsColumn];
