import {erc20ABI, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction} from 'wagmi'
import {getIcon, getStatusColor, Transaction} from "@/components/App/Transactions/TransactionSteps";
import {useEffect, useState} from "react";

export default function AllowanceStep({stepProps}) {
    const {selectedCurrency, isReady, session, amount, isFinished, setFinished, otcContract} = stepProps

    const {config, isSuccess: isSuccessConfig} = usePrepareContractWrite({
        address: selectedCurrency.address,
        abi: erc20ABI,
        functionName: 'approve',
        args: [otcContract, amount * 10 ** selectedCurrency.precision],
        enabled: isReady,
    })

    const {
        isLoading: isLoadingRead,
        isFetching: isFetchingRead,
        isSuccess: isSuccessRead,
        isFetched: isFetchedRead,
        data: allowance
    } = useContractRead(
        {
            address: selectedCurrency.address,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [session.user.address, otcContract],
            watch: isReady && !isFinished,
        }
    )

    const {
        data: transactionData,
        write,
        isError: isErrorWrite,
        isSuccess: isSuccessWrite,
        isLoading: isLoadingWrite,
    } = useContractWrite(config)


    const {isError: isErrorPending,
        data: confirmationData,
        isSuccess: isSuccessPending,
        isLoading: isLoadingPending,
        isFetching: isFetchingPending} = useWaitForTransaction({
        confirmations: 2,
        hash: transactionData?.hash,
    })


    const allowanceHuman = (allowance ? allowance.toNumber() : 0) / 10 ** selectedCurrency.precision
    const isEnoughAllowance = amount <= allowanceHuman
    const amountLocale = Number(amount).toLocaleString()
    const allowanceLocale = Number(allowanceHuman).toLocaleString()

    const setAllowance = (state) => {
        if (!isEnoughAllowance && state === Transaction.Failed) {
            write()
        }
    }

    useEffect(()=>{
        if(isSuccessConfig && !isFinished && isReady) {
                    if(!isEnoughAllowance) {
                        setAllowance(Transaction.Failed)
                    }
        }
    }, [isSuccessConfig, allowance, isReady])

    useEffect(()=>{
        console.log("ERROR THROW ", isErrorWrite || isErrorPending || !isEnoughAllowance)
        setFinished(isEnoughAllowance)
    }, [isErrorWrite, isErrorPending, isEnoughAllowance])

    // console.log("TT :: READ - isSuccessConfig", isSuccessConfig)
    // console.log("TT :: READ - allowance", allowance?.toNumber())
    // console.log("TT :: READ - isReady", isReady)
    // console.log("TT :: READ - isFinished / enabled", isFinished)
    // console.log("TT :: READ - isFinished / watch", isReady && !isFinished)



    const statuses = (state) => {
        switch (state) {
            case Transaction.Waiting: {
                return <>Check allowance</>
            }
            case Transaction.Processing: {
                return <>Getting allowance for ${amountLocale}</>
            }
            case Transaction.Executed: {
                return <>Allowance for ${amountLocale} set successfully </>
            }
            case Transaction.Failed: {
                return <span className="underline">Failed to set allowance for ${amountLocale}</span>
            }
            default: {
                return <>Check allowance</>
            }
        }
    }

    const prepareRow = (state) => {
        return <div className={`flex flex-row items-center ${getStatusColor(state)}`} onClick={() => setAllowance(state)}>
            {getIcon(state)}
            <div>
                {statuses(state)}
                {state !== Transaction.Executed && <div className="text-xs -mt-1">current allowance: ${allowanceLocale}</div>}
            </div>
        </div>
    }
    // console.log("======" )
    // console.log("STATE :: modal " , isReady, isFinished)
    // console.log("STATE :: read " ,!!allowance, isLoadingRead, isFetchingRead, isSuccessRead, isFetchedRead,)
    // console.log("STATE :: write " ,transactionData, isErrorWrite, isSuccessWrite, isLoadingWrite)
    // console.log("STATE :: prep " , isSuccessConfig)
    // console.log("STATE :: confirm " ,confirmationData, isErrorPending, isSuccessPending, isLoadingPending, isFetchingPending)
    // console.log("======" )

    if (isFinished && isEnoughAllowance && isReady) return prepareRow(Transaction.Executed)
    if (!isReady) return prepareRow(Transaction.Waiting)
    if ((isErrorWrite || isErrorPending) && isReady) return prepareRow(Transaction.Failed)
    else return prepareRow(Transaction.Processing)



}

