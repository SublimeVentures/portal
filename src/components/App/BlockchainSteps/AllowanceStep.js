import {erc20ABI, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction} from 'wagmi'
import {getIcon, getStatusColor, Transaction} from "@/components/App/BlockchainSteps/config";
import {useEffect} from "react";
import {BigNumber} from "bignumber.js";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";

export default function AllowanceStep() {
    const {allowanceState, blockchainProps} = useBlockchainContext();

    const {
        isReady,
        setIsReady,
        isFetched,
        setIsFetched,
        setIsLoading,
        result,
        setResult,
        isFinished,
        setIsFinished,
        setIsError,
        setError,
    } = allowanceState


    const {processingData} = blockchainProps

    const {
        amountAllowance,
        userWallet,
        currency,
        diamond
    } = processingData


    const balance_user = Number(result).toLocaleString()
    const balance_required = Number(amountAllowance).toLocaleString()

    const power = BigNumber(10).pow(currency.precision)
    const amount_bn = BigNumber(amountAllowance).multipliedBy(power)
    const requiredAllowance = amountAllowance ? amount_bn : 0

    const {
        isSuccess: onchain_isSuccess,
        isLoading: onchain_isLoading,
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
            cacheOnBlock: true
        }
    )

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
        if(!isReady) return
        setIsLoading(onchain_isLoading)
        setIsFetched(onchain_isSuccess)
        let allowance_current = 0
        if(onchain_data?.toString() != undefined && currency?.precision) {
            const power = BigNumber(10).pow(currency.precision)
            const balance_currentBN = BigNumber(onchain_data)
            allowance_current = onchain_data ? balance_currentBN.dividedBy(power).toNumber() : 0
        }
        setResult(allowance_current)
        setIsFinished(requiredAllowance <= allowance_current) //todo:

        console.log("IQZ :: ALLOWANCE :: S", requiredAllowance,allowance_current, onchain_isLoading, onchain_isSuccess,onchain_data, allowance_current,balance_required <= allowance_current)
    }, [onchain_isSuccess, onchain_isLoading, onchain_data])


    useEffect(() => {
        if (isReady && prep_isSuccess && !write_isLoading) {
            setIsError(false)
            setError(null)
            if(!isFinished) {
                write_send()
            }
        }
    }, [isReady, prep_isSuccess])


    useEffect(() => {
        if (!!confirmation_data && confirmation_isSuccess) {
            setIsError(false)
            setError(null)
            setIsFinished(true)
            setResult({
                confirmation_isSuccess,
                confirmation_data
            })
        }
    }, [confirmation_data, confirmation_isSuccess])


    useEffect(() => {
        console.log("IQZ :: ALLOWANCE :: ERROR", {
            prep: { prep_isError, prep_error },
            write: { write_isError, write_error },
            confirm: {confirmation_isError, confirmation_error}
        })

        if (!!prep_error || !!write_error || !!confirmation_error) {
            setIsFinished(false)
            setIsReady(false)
            setIsError(!!prep_error || !!write_error || !!confirmation_error || !!onchain_error)
            setError(prep_error || write_error || confirmation_error || onchain_error)
        }
    }, [
        onchain_isError, onchain_error,
        prep_isError, prep_error,
        write_isError, write_error,
        confirmation_isError, confirmation_error
    ])





    const statuses = (state) => {
        switch (state) {
            case Transaction.Waiting: {
                return <>Check allowance</>
            }
            case Transaction.Processing: {
                return <>Confirm allowance in wallet
                    ({currency.isSettlement ? `$${balance_user}` : `${balance_user} ${currency.symbol}`})</>
            }
            case Transaction.Executed: {
                return <>Allowance confirmed
                    ({currency.isSettlement ? `$${balance_user}` : `${balance_user} ${currency.symbol}`}) </>
            }
            case Transaction.Failed: {
                return <span
                    className="underline">Failed to set allowance for {currency.isSettlement ? `$${balance_user}` : `${balance_user} ${currency.symbol}`}</span>
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
                {state !== Transaction.Executed && <div className="text-xs -mt-1">current
                    allowance: {currency.isSettlement ? `$${balance_user}` : `${balance_user} ${currency.symbol}`}</div>}
            </div>
        </div>
    }


    if (isFinished) {
        return prepareRow(Transaction.Executed)
    }
    if ((!!prep_error || !!write_error || !!confirmation_error) && !isFinished) {
        return prepareRow(Transaction.Failed)
    }
    if (!isReady) {
        return prepareRow(Transaction.Waiting)
    } else {
        return prepareRow(Transaction.Processing)
    }


}

