import {usePrepareContractWrite, useContractWrite, useWaitForTransaction, usePrepareSendTransaction} from 'wagmi'
import {useEffect} from "react";

export const TransactionState = {
    Init: 0,
    Executing: 1,
    Processing: 2,
}

export default function TransactionStep({stepProps}) {
    const {transactionData, account, isReady, setFinished, setIsTransactionLoading, trigger} = stepProps

    const {
        config: configPrep,
        isSuccess: successPrep,
        isError: isErrorPrep
    } = usePrepareContractWrite({
        address: transactionData.address,
        abi: transactionData.abi,
        functionName: transactionData.method,
        args: transactionData.args,
        overrides: {
            from: account,
        },
        enabled: isReady
    })

    const {
        data: txId,
        write: sendTransaction,
        isError: isErrorWrite,
        error: errorWrite,
        isSuccess: isSuccessWrite,
        isLoading: isLoadingWrite
    } = useContractWrite(configPrep)


    const {
        data: transferConfirmed,
        isError: isErrorConfirmed,
        error: errorConfirmed,
        isSuccess:isSuccessConfirmed,
        isLoading: isLoadingConfirmed,
        isFetching: isFetchingConfirmed
    } = useWaitForTransaction({
        confirmations: 2,
        hash: txId?.hash,
    })
    //
    //
    // console.log("======" )
    // console.log("STATE :: isReady " , isReady)
    // console.log("STATE :: successPrep " , successPrep)
    // console.log("STATE :: isErrorPrep " , isErrorPrep)
    // console.log("STATE :: txId " , txId)
    // console.log("STATE :: isErrorWrite " , isErrorWrite)
    // console.log("STATE :: errorWrite " , errorWrite)
    // console.log("STATE :: isSuccessWrite " , isSuccessWrite)
    // console.log("STATE :: isLoadingWrite " , isLoadingWrite)
    // console.log("STATE :: transferConfirmed " , transferConfirmed)
    // console.log("STATE :: isErrorConfirmed " , isErrorConfirmed)
    // console.log("STATE :: errorConfirmed " , errorConfirmed)
    // console.log("STATE :: isSuccessConfirmed " , isSuccessConfirmed)
    // console.log("STATE :: isLoadingConfirmed " , isLoadingConfirmed)
    // console.log("STATE :: isFetchingConfirmed " , isFetchingConfirmed)
    // console.log("======" )


    const disabledButton = !isReady || isLoadingWrite || isLoadingConfirmed || isFetchingConfirmed

    useEffect(()=>{
        setIsTransactionLoading(disabledButton && isReady ? (successPrep ? TransactionState.Executing : TransactionState.Processing ) : TransactionState.Init)
    }, [disabledButton, isReady, successPrep])

    const transfer = () => {
        if(isReady && successPrep) {
            console.log("QQQ :: send transaction")
            sendTransaction()
        }
    }
    useEffect(()=>{
        console.log("QQQ :: trigger", trigger, successPrep, isReady)
        if(trigger) {
            transfer()
        }
    }, [trigger, successPrep])

    useEffect(()=>{
        if(!!transferConfirmed && isSuccessConfirmed) {
            setFinished(true)
            setIsTransactionLoading(TransactionState.Init)
        }
    }, [transferConfirmed, isSuccessConfirmed])


    if(isLoadingWrite || isLoadingConfirmed) {
        setIsTransactionLoading(TransactionState.Processing)
    }

    if(!!errorConfirmed || !!errorWrite) {
        setIsTransactionLoading(TransactionState.Init)
    }

    console.log("errorWrite",errorWrite)
    return (
        <div className={'fullWidth min-h-[25px]'}>
            {!!errorConfirmed || !!errorWrite && <div className={"text-app-error text-center"}>{errorConfirmed}{errorWrite?.message ? errorWrite.message : errorWrite?.cause?.reason.toUpperCase()}</div>}
        </div>
    )
}

