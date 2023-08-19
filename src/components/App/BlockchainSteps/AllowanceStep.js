import {erc20ABI, useContractRead, usePrepareContractWrite, useContractWrite, useWaitForTransaction} from 'wagmi'
import {getIcon, getStatusColor, Transaction} from "@/components/App/BlockchainSteps/config";
import {useEffect} from "react";
import {BigNumber} from "ethers";
import {TransactionState} from "@/components/App/BlockchainSteps/TransactionStep";

export default function AllowanceStep({stepProps}) {
    const {currencyAddress, currencyPrecision, currencySymbol, allowanceFor, isReady, account, amount, isFinished, setFinished, setIsTransactionLoading, isStablecoin} = stepProps

    const power = BigNumber.from(10).pow(currencyPrecision)
    const amount_bn = BigNumber.from(amount).mul(power)
    const requiredAllowance = amount ? amount_bn : 0
    const {config, isSuccess: isSuccessConfig, isError} = usePrepareContractWrite({
        address: currencyAddress,
        abi: erc20ABI,
        functionName: 'approve',
        args: [allowanceFor, requiredAllowance],
        enabled: isReady && !isFinished,
    })

    const {
        isLoading: isLoadingRead,
        isFetching: isFetchingRead,
        isSuccess: isSuccessRead,
        isFetched: isFetchedRead,
        data: allowance
    } = useContractRead(
        {
            address: currencyAddress,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [account, allowanceFor],
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


    const allowance_bn = BigNumber.from(allowance ? allowance : 0).div(power)
    const allowanceHuman = (allowance ? allowance_bn.toNumber() : 0)
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
        setFinished(isEnoughAllowance)
    }, [isErrorWrite, isErrorPending, isEnoughAllowance])

    useEffect(()=>{
        console.log("allowance", isFinished, isEnoughAllowance, isReady)
            // if (isFinished && isEnoughAllowance && isReady) { //todo: test - this is old version
            if (isFinished && isEnoughAllowance) {
                setIsTransactionLoading(TransactionState.Init)
            } else if ((isErrorWrite || isErrorPending) && isReady) {
                setIsTransactionLoading(TransactionState.Init)
            } else {
                setIsTransactionLoading(TransactionState.Processing)
            }
    }, [isFinished, isEnoughAllowance, isReady])

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
                return <>Getting allowance for {isStablecoin ? `$${amountLocale}`: `${amountLocale} ${currencySymbol}`}</>
            }
            case Transaction.Executed: {
                return <>Allowance confirmed ({isStablecoin ? `$${amountLocale}`: `${amountLocale} ${currencySymbol}`}) </>
            }
            case Transaction.Failed: {
                return <span className="underline">Failed to set allowance for {isStablecoin ? `$${amountLocale}`: `${amountLocale} ${currencySymbol}`}</span>
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
                {state !== Transaction.Executed && <div className="text-xs -mt-1">current allowance: {isStablecoin ? `$${allowanceLocale}`: `${allowanceLocale} ${currencySymbol}`}</div>}
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

    if (isFinished && isEnoughAllowance && isReady) {
        // setIsTransactionLoading(TransactionState.Init)
        return prepareRow(Transaction.Executed)
    }
    if (!isReady) {
        return prepareRow(Transaction.Waiting)
    }
    if ((isErrorWrite || isErrorPending) && isReady) {
        // setIsTransactionLoading(TransactionState.Init)
        return prepareRow(Transaction.Failed)
    }
    else {
        // setIsTransactionLoading(TransactionState.Processing)
        return prepareRow(Transaction.Processing)
    }



}

