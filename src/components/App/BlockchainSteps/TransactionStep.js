import {usePrepareContractWrite, useContractWrite, useWaitForTransaction} from 'wagmi'
import {useEffect} from "react";


export default function TransactionStep({stepProps}) {
    // console.log("STATE :: T -================")

    const {
        processingData,
        isReady,
        setIsReady,
        isFinished,
        setFinished,
        saveData
    } = stepProps

    const {
        amount,
        amountAllowance,
        userWallet,
        currency,
        diamond,
        transactionData
    } = processingData


    const {
        config: configPrep,
        isSuccess: successPrep,
        isError: isErrorPrep,
        error: errorPrep,
    } = usePrepareContractWrite({
        address: transactionData.address,
        abi: transactionData.abi,
        functionName: transactionData.method,
        args: transactionData.args,
        overrides: {
            from: userWallet,
        },
        enabled: isReady
    })

    // console.log("STATE :: T - usePrepareContractWrite", {successPrep, isErrorPrep})

    const {
        data: txId,
        write: sendTransaction,
        isError: isErrorWrite,
        error: errorWrite,
        isSuccess: isSuccessWrite,
        isLoading: isLoadingWrite
    } = useContractWrite(configPrep)

    // console.log("STATE :: T - useContractWrite", {txId, isErrorWrite, errorWrite, isSuccessWrite, isLoadingWrite})

    const {
        data: transferConfirmed,
        isError: isErrorConfirmed,
        error: errorConfirmed,
        isSuccess: isSuccessConfirmed,
        isLoading: isLoadingConfirmed,
        isFetching: isFetchingConfirmed
    } = useWaitForTransaction({
        confirmations: 2,
        hash: txId?.hash,
    })

    // console.log("STATE :: T - useWaitForTransaction", {
    //     transferConfirmed,
    //     isErrorConfirmed,
    //     errorConfirmed,
    //     isSuccessConfirmed,
    //     isLoadingConfirmed,
    //     isFetchingConfirmed
    // })


    const disabledButton = !isReady || isLoadingWrite || isLoadingConfirmed || isFetchingConfirmed
    const transfer = () => {
        if (isReady && successPrep) {
            sendTransaction()
        }
    }

    useEffect(() => {
        // console.log("STATE :: T - setIsTransactionLoading?", {disabledButton, isReady, successPrep})
        // setIsTransactionLoading(disabledButton && isReady ? (successPrep ? TransactionState.Executing : TransactionState.Processing) : TransactionState.Init)
    }, [disabledButton, isReady, successPrep])


    useEffect(() => {
        // console.log("QQQ :: trigger", trigger, successPrep, isReady)
        // if (trigger) {
            transfer()
        // }
    // }, [trigger, successPrep])
    }, [successPrep, isReady])

    useEffect(() => {
        if (!!transferConfirmed && isSuccessConfirmed) {
            setFinished(true)
            saveData({
                transferConfirmed,
                txId
            })
            // setIsTransactionLoading(TransactionState.Init)
        }
    }, [transferConfirmed, isSuccessConfirmed])

    useEffect(() => {
        // if (isLoadingWrite || isLoadingConfirmed) {
        //     setIsTransactionLoading(TransactionState.Processing)
        // }
        // console.log("ERRORS", errorConfirmed, errorWrite, errorPrep, errorPrep?.cause)

        if (!!errorConfirmed || !!errorWrite || !!errorPrep) {
            setFinished(false)
            setIsReady(false)
            // setIsTransactionLoading(TransactionState.Init)
        }
    // }, [isLoadingWrite, isLoadingConfirmed, errorConfirmed, errorWrite])
    }, [errorConfirmed, errorWrite, errorPrep])

    // console.log("STATE :: T - errorConfirmed",errorConfirmed)
    // console.log("STATE :: T - errorWrite",errorWrite ? Object.keys(errorWrite) : 0, errorWrite?.shortMessage, errorWrite?.metaMessages, errorWrite?.message, errorWrite?.cause)
    // console.log("STATE :: T - errorWrite",errorWrite)
    return (
        <div className={'fullWidth min-h-[25px]'}>
            {!!errorConfirmed || !!errorWrite || !!errorPrep && <div className={"text-app-error text-center"}>
                {errorConfirmed}
                {errorWrite?.shortMessage ? errorWrite.shortMessage : errorWrite?.cause?.reason.toUpperCase()}
                {errorPrep?.shortMessage ? errorPrep.shortMessage : errorPrep?.cause?.reason.toUpperCase()}
            </div>
            }
        </div>
    )
}

