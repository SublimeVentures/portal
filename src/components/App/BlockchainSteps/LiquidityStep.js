import {useReadContract} from 'wagmi'
import {BigNumber} from "bignumber.js";
import {blockchainRow, Transaction} from "@/components/App/BlockchainSteps/config";
import {useEffect} from "react";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";
import { erc20Abi } from 'viem'
import {useEnvironmentContext} from "@/components/App/BlockchainSteps/EnvironmentContext";
import {ICONS} from "@/lib/icons";
import {usdtAbi} from "../../../../abi/usdt.abi";

export default function LiquidityStep() {
    const {activeChainCurrency, network} = useEnvironmentContext();
    const { blockchainProps, stepsIsReady, updateBlockchainProps} = useBlockchainContext();
    const {data, state} = blockchainProps
    const { account, currency, liquidity} = data
    const {liquidity: isReady} = stepsIsReady
    const {isFinished, isFetched} = state.liquidity
    const balance_required = Number(liquidity).toLocaleString()

    const currencyData = activeChainCurrency[currency]
    const abi = (currencyData?.symbol === 'USDT' && network?.chainId === 1) ? usdtAbi : erc20Abi
    const {
        isSuccess: onchain_isSuccess,
        isLoading: onchain_isLoading,
        isPending: onchain_isPending,
        data: onchain_data,
        isError: onchain_isError,
        error: onchain_error,
        refetch: onchain_refetch,
    } = useReadContract(
        {
            address: currencyData?.address,
            abi: abi,
            functionName: 'balanceOf',
            args: [account],
            enabled: isReady,
        }
    )

    useEffect(() => {
        console.log("IQZ :: LIQUIDITY :: R", isReady, stepsIsReady)

        if(!isReady || isFinished) return
        updateBlockchainProps([
            { path: 'state.liquidity.isLoading', value: onchain_isLoading },
            { path: 'state.liquidity.isFetched', value: onchain_isSuccess }
        ], "liquidty loading")
        let balance_user = 0
        if(onchain_data?.toString() != undefined) {
            const power = BigNumber(10).pow(currencyData.precision)
            const currentBalanceBN = BigNumber(onchain_data)
            balance_user = onchain_data ? currentBalanceBN.dividedBy(power).toNumber() : 0

        }
        updateBlockchainProps([
            { path: 'result.liquidity', value: balance_user },
            { path: 'state.liquidity.isFinished', value: liquidity <= balance_user }
        ], "liquidity fetched onchain")
        console.log("IQZ :: LIQUIDITY :: S", onchain_isLoading, onchain_isSuccess,onchain_data, balance_user,liquidity <= balance_user)

    }, [onchain_isSuccess, onchain_isLoading, onchain_data, isReady])


    useEffect(() => {
        console.log("IQZ :: LIQUIDITY :: E", onchain_isError, onchain_error)
        updateBlockchainProps([
            { path: 'state.liquidity.isError', value: onchain_isError },
            { path: 'state.liquidity.error', value: liquidity <= onchain_error }
        ], "liquidty error onchain")
    }, [onchain_isError, onchain_error])


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
