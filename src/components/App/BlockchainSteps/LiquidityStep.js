import {erc20ABI, useContractRead} from 'wagmi'
import {BigNumber} from "bignumber.js";
import {getIcon, getStatusColor, Transaction} from "@/components/App/BlockchainSteps/config";
import {useEffect} from "react";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";
import usdtAbi from "../../../../abi/usdt.abi.json";


export default function LiquidityStep() {
    const { blockchainProps, stepsIsReady, updateBlockchainProps} = useBlockchainContext();
    const {data, state, result} = blockchainProps

    const {amount, userWallet, currency, chain} = data
    const {liquidity: isReady} = stepsIsReady
    const {isFinished, isFetched} = state.liquidity
    const balance_user = Number(result?.liquidity ? result.liquidity : 0).toLocaleString()
    const balance_required = Number(amount).toLocaleString()

    const {
        isSuccess: onchain_isSuccess,
        isLoading: onchain_isLoading,
        data: onchain_data,
        isError: onchain_isError,
        error: onchain_error,
        refetch: onchain_refetch
    } = useContractRead(
        {
            address: currency.address,
            abi: currency.symbol === 'USDT' ? usdtAbi : erc20ABI,
            functionName: 'balanceOf',
            args: [userWallet],
            watch: !isFinished,
            enabled: isReady,
        }
    )


    useEffect(() => {
        console.log("IQZ :: LIQUIDITY :: R", isReady, stepsIsReady)

        if(!isReady) return
        updateBlockchainProps([
            { path: 'state.liquidity.isLoading', value: onchain_isLoading },
            { path: 'state.liquidity.isFetched', value: onchain_isSuccess }
        ])
        let balance_user = 0
        if(onchain_data?.toString() != undefined && currency?.precision) {
            const power = BigNumber(10).pow(currency.precision)
            const currentBalanceBN = BigNumber(onchain_data)
            balance_user = onchain_data ? currentBalanceBN.dividedBy(power).toNumber() : 0

        }
        updateBlockchainProps([
            { path: 'result.liquidity', value: balance_user },
            { path: 'state.liquidity.isFinished', value: amount <= balance_user }
        ])
        console.log("IQZ :: LIQUIDITY :: S", onchain_isLoading, onchain_isSuccess,onchain_data, balance_user,amount <= balance_user)

    }, [onchain_isSuccess, onchain_isLoading, onchain_data, isReady])


    useEffect(() => {
        console.log("IQZ :: LIQUIDITY :: E", onchain_isError, onchain_error)
        if(onchain_isError || onchain_error){
            // refetch()
        }
        updateBlockchainProps([
            { path: 'state.liquidity.isError', value: onchain_isError },
            { path: 'state.liquidity.error', value: amount <= onchain_error }
        ])
    }, [onchain_isError, onchain_error])


    const statuses = (state) => {
        switch (state) {
            case Transaction.Waiting: {
                return <>Liquidity check</>
            }
            case Transaction.Processing: {
                return <>Checking account funds</>
            }
            case Transaction.Executed: {
                return <>Availability of funds confirmed (${balance_user})</>
            }
            case Transaction.Failed: {
                return <span className="underline">Wallet doesn't hold {balance_required} {currency?.symbol}</span>
            }
            default: {
                return <>Check allowance</>
            }
        }
    }

    const prepareRow = (state) => {
        return <div className={`flex flex-row items-center ${getStatusColor(state)}`}>
            {getIcon(state)}
            <div>
                {statuses(state)}
            </div>
        </div>
    }

    if (isFinished && isReady) return prepareRow(Transaction.Executed)
    if (!isReady) return prepareRow(Transaction.Waiting)
    if (isFetched && !isFinished) return prepareRow(Transaction.Failed)
    return prepareRow(Transaction.Processing)
};
