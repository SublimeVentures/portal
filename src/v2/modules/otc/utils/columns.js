import { createColumnHelper } from '@tanstack/react-table';
import moment from "moment";

import { NETWORKS } from "@/lib/utils";
import { cn } from "@/lib/cn"

// @todo
import { ButtonIconSize } from "@/components/Button/RoundButton";
import { IoCloseCircleOutline as IconCancel } from "react-icons/io5";
import DynamicIcon from "@/components/Icon";
import { Tooltiper, TooltipType } from "@/components/Tooltip";
import TakeOfferModal from "@/v2/modules/otc/components/TakeOfferModal";
import CancelOfferModal from '@/v2/modules/otc/components/CancelOfferModal';

const columnHelper = createColumnHelper();

const intFilter = (row, id, filterValue) => String(row.original[id]).toLowerCase().startsWith(filterValue.toLowerCase());

const isUserOffer = (userWallets, checkWallet, account) => ({ ok: userWallets.includes(checkWallet), isActive: account?.address === checkWallet });

const isSellColumn = columnHelper.accessor('isSell', {
    header: 'Type',
    cell: info => {
        const isSell = info.getValue();
        return <span className={cn("font-bold", isSell ? "text-destructive" : "text-green-500" )}>{isSell ? "Sell" : "Buy"}</span>
    }
})

const allocationColumn = columnHelper.accessor('amount', {
    header: 'Allocation',
    cell: info => `$${info.getValue().toLocaleString()}`,
    filterFn: intFilter,
})

const priceColumn = columnHelper.accessor('price', {
    header: 'Price',
    cell: info => `$${info.getValue().toLocaleString()}`,
    filterFn: intFilter,
})

const multiplierColumn = columnHelper.accessor('multiplier', {
    header: 'Multiplier',
    cell: (info) => `${info.getValue().toFixed(2)}x`,
    filterFn: intFilter,
})

const chainColumn = (getCurrencySymbolByAddress) => columnHelper.accessor('chain', {
    header: 'Chain',
    cell: (info) => {
      return (
          <span className="flex flex-row flex-1 justify-end gap-2 lg:justify-start">
              <DynamicIcon name={getCurrencySymbolByAddress(info.row.original.currency)} style={ButtonIconSize.hero3} />
              <DynamicIcon name={NETWORKS[info.row.original.chainId]} style={ButtonIconSize.hero3} />
          </span>
      )
    }
})

const actionColumn = (wallets, account, propOffers) => columnHelper.accessor('action', {
    header: 'Action',
    cell: (info) => {
        const ownership = isUserOffer(wallets, info.row.original.maker, account);
        const offerDetails = info.row.original;

        return (
            <div className="flex flex-row justify-end gap-1 lg:justify-start">
                {ownership.ok &&
                    (ownership.isActive ? (
                        <CancelOfferModal {...propOffers} offerDetails={offerDetails} />
                    ) : (
                        <Tooltiper
                            wrapper={
                                <div className="disabled duration-300 hover:text-destructive cursor-pointer">
                                    <IconCancel className="w-6 h-6" />
                                </div>
                            }
                            text="Created from other wallet"
                            type={TooltipType.Error}
                        />
                    )
                )}

                {!ownership.ok && <TakeOfferModal {...propOffers} offerDetails={offerDetails} />}
            </div>
        )
    },
    enableSorting: false,
})

const dateColumn = columnHelper.accessor('date', {
    header: 'Date',
    cell: info => moment(info.row.original.updatedAt).utc().local().format("YYYY-MM-DD"),
    filterFn: intFilter,
})

export const getOffersColumns = (getCurrencySymbolByAddress, wallets, account, propOffers) => {
    return [isSellColumn, allocationColumn, priceColumn, multiplierColumn, chainColumn(getCurrencySymbolByAddress), actionColumn(wallets, account, propOffers)]
}

export const getHistoryColumns = (getCurrencySymbolByAddress) => {
    return [isSellColumn, allocationColumn, priceColumn, multiplierColumn, chainColumn(getCurrencySymbolByAddress), dateColumn]
}
