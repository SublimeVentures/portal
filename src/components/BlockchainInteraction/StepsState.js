import {useReadContract} from 'wagmi'
import {BigNumber} from "bignumber.js";
import {blockchainRow, Transaction} from "@/components/App/BlockchainSteps/config";
import {useEffect} from "react";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";
import { erc20Abi } from 'viem'
import {useEnvironmentContext} from "@/components/App/BlockchainSteps/EnvironmentContext";
import {ICONS} from "@/lib/icons";
import {usdtAbi} from "../../../../abi/usdt.abi";

const STEP_STATES = () => {

}

export default function LiquidityStep({state, data}) {
    const state = STEP_STATES()

    const iconPadding = "p-[7px]"

    if (isFinished && isReady) {
        return blockchainRow(Transaction.Executed, <>Availability of funds confirmed</>, ICONS.SEARCH, iconPadding)
    }
    if (!isReady) {
        return blockchainRow(Transaction.Waiting, <>Liquidity check</>, ICONS.SEARCH, iconPadding)
    }
    if (isFetched && !isFinished) {
        return blockchainRow(Transaction.Failed, <>Wallet doesn't hold {balance_required} {currencyData?.symbol}</>, ICONS.SEARCH, iconPadding, "Balance too low", onchain_refetch)
    }
    return blockchainRow(Transaction.Processing, <>Checking account funds</>, ICONS.SEARCH, iconPadding)
};
