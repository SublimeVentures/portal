import {erc20ABI, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction} from 'wagmi'
import {getIcon, getStatusColor, Transaction} from "@/components/App/BlockchainSteps/config";
import {useEffect, useState} from "react";
import {BigNumber} from "bignumber.js";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";

export default function AllowanceStep() {
    const [lastAllowance, setLastAllowance] = useState(0);
    const { blockchainProps, stepsIsReady, updateBlockchainProps} = useBlockchainContext();

    const {data, state, result} = blockchainProps

    const {amountAllowance, userWallet, currency, diamond} = data
    const {allowance: isReady} = stepsIsReady
    const {isFinished, isError, isFetched} = state.allowance
    const {isFinished: liquidity_isFinished} = state.liquidity


    const balance_user = Number(result?.allowance?.amount ? result.allowance.amount: 0).toLocaleString()

    const balance_required = Number(amountAllowance).toLocaleString()

    const power = BigNumber(10).pow(currency.precision)
    const amount_bn = BigNumber(amountAllowance).multipliedBy(power)
    const requiredAllowance = amountAllowance ? amount_bn : 0

    const {
        isSuccess: onchain_isSuccess,
        isLoading: onchain_isLoading,
        isFetched: onchain_isFetched,
        data: onchain_data,
        isError: onchain_isError,
        error: onchain_error,
        refetch: onchain_refetch,
    } = useContractRead(
        {
            address: currency.address,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [userWallet, diamond],
            watch: !isFinished,
            enabled: isReady,
            cacheTime:0
        }
    )

    console.log("ONCHAIN DATA", onchain_data, onchain_isSuccess, onchain_isLoading, onchain_isFetched)

    const {
        config: prep_config,
        isSuccess: prep_isSuccess,
        isError: prep_isError,
        error: prep_error,
    } = usePrepareContractWrite({
        address: currency.address,
        abi: erc20ABI,
        functionName: 'approve',
        args: [diamond, requiredAllowance],
        enabled: isReady && !isFinished
    })

    const {
        data: write_data,
        write: write_send,
        isError: write_isError,
        error: write_error,
        isSuccess: write_isSuccess,
        isLoading: write_isLoading
    } = useContractWrite(prep_config)


    const {
        data: confirmation_data,
        isError: confirmation_isError,
        error: confirmation_error,
        isSuccess: confirmation_isSuccess,
        isLoading: confirmation_isLoading,
        isFetching: confirmation_isFetching
    } = useWaitForTransaction({
        confirmations: 2,
        hash: write_data?.hash,
    })


    useEffect(() => {
        console.log("IQZ :: ALLOWANCE :: R", isReady)
        if (!isReady) return
        updateBlockchainProps([
            { path: 'state.allowance.isLoading', value: onchain_isLoading },
            { path: 'state.allowance.isFetched', value: onchain_isSuccess }
        ],"allowance ready")
        setLastAllowance(amountAllowance)
        let allowance_current = 0
        if (onchain_data?.toString() != undefined && currency?.precision) {
            const power = BigNumber(10).pow(currency.precision)
            const balance_currentBN = BigNumber(onchain_data)
            allowance_current = onchain_data ? balance_currentBN.dividedBy(power).toNumber() : 0
        }

        updateBlockchainProps([
            { path: 'result.allowance.amount', value: allowance_current },
            // { path: 'state.allowance.isFinished', value: (amountAllowance <= allowance_current) && allowance_current > 0 }
        ],"allowance fetched")
        console.log("IQZ :: ALLOWANCE :: S2", amountAllowance, allowance_current,  amountAllowance <= allowance_current)
    }, [onchain_isSuccess, onchain_isLoading, onchain_data, isReady])


    useEffect(() => {
        console.log("IQZ :: ALLOWANCE :: WRITE", isReady && prep_isSuccess && !write_isLoading && result?.allowance?.amount !== undefined, isReady, isFinished, prep_isSuccess,!write_isLoading, result?.allowance?.amount !== undefined)
        if (isReady && prep_isSuccess && !write_isLoading && result?.allowance?.amount !== undefined) {
            updateBlockchainProps([
                { path: 'state.allowance.isError', value: false },
                { path: 'state.allowance.error', value: null }
            ], "allowance write start")
            if (!isFinished) {
                write_send()
            }
        }
    }, [isReady, prep_isSuccess, onchain_data,result?.allowance?.amount])


    useEffect(() => {
        if (!!confirmation_data && confirmation_isSuccess) {
            if(result.allowance.amount>=amountAllowance) {
                updateBlockchainProps([
                    { path: 'state.allowance.isError', value: false },
                    { path: 'state.allowance.error', value: null },
                    { path: 'state.allowance.isFinished', value: true },
                    { path: 'result.allowance.confirmation', value: {
                            confirmation_isSuccess,
                            confirmation_data
                        }
                    }
                ], "allowance confirmed on chain")
            } else {
                updateBlockchainProps([
                    { path: 'state.allowance.isError', value: true },
                    { path: 'state.allowance.error', value: "" },
                    { path: 'state.allowance.isFinished', value: false },
                    { path: 'state.allowance.lock', value: true }
                ], "allowance refused onchain")
            }

        }
    }, [confirmation_data, confirmation_isSuccess, result.allowance?.amount])


    useEffect(() => {
        console.log("IQZ :: ALLOWANCE :: ERROR", {
            prep: {prep_isError, prep_error},
            write: {write_isError, write_error},
            confirm: {confirmation_isError, confirmation_error}
        })

        if (!!prep_error || !!write_error || !!confirmation_error) {
            updateBlockchainProps([
                { path: 'state.allowance.isError', value: !!prep_error || !!write_error || !!confirmation_error || !!onchain_error },
                { path: 'state.allowance.error', value: prep_error || write_error || confirmation_error || onchain_error },
                { path: 'state.allowance.isFinished', value: false },
                { path: 'state.allowance.lock', value: true }
            ], "allowance errors")
        }
    }, [
        prep_isError,
        write_isError,
        confirmation_isError,
        onchain_isError,
    ])


    const statuses = (state) => {
        switch (state) {
            case Transaction.Waiting: {
                return <>Check allowance</>
            }
            case Transaction.Processing: {
                return <>Confirm allowance in wallet
                    ({currency.isSettlement ? `$${balance_required}` : `${balance_required} ${currency.symbol}`})</>
            }
            case Transaction.Executed: {
                return <>Allowance confirmed
                    ({currency.isSettlement ? `$${balance_user}` : `${balance_user} ${currency.symbol}`}) </>
            }
            case Transaction.Failed: {
                return <span
                    className="underline">Failed to set allowance for {currency.isSettlement ? `$${lastAllowance}` : `${lastAllowance} ${currency.symbol}`}</span>
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

    if (isFinished) {
        return prepareRow(Transaction.Executed)
    }
    if (isError && !isFinished && liquidity_isFinished) {
        return prepareRow(Transaction.Failed)
    }
    if (!isReady) {
        return prepareRow(Transaction.Waiting)
    } else {
        return prepareRow(Transaction.Processing)
    }
}

