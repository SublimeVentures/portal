import {usePrepareContractWrite, useContractWrite, useWaitForTransaction} from 'wagmi'
import {useEffect} from "react";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";
import {getIcon, getStatusColor, Transaction} from "@/components/App/BlockchainSteps/config";

export default function TransactionStep() {
    const { transactionState, blockchainProps } = useBlockchainContext();

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
    } = transactionState

    const {processingData} = blockchainProps


    const {
        userWallet,
        transactionData
    } = processingData


    const {
        config: prep_config,
        isSuccess: prep_isSuccess,
        isError: prep_isError,
        error: prep_error,
    } = usePrepareContractWrite({
        address: transactionData.address,
        abi: transactionData.abi,
        functionName: transactionData.method,
        args: transactionData.args,
        overrides: {
            from: userWallet,
        },
        cacheTime:0,
        enabled: isReady
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
        console.log("IQZ :: TRANSACTION :: SEND", isReady, prep_isSuccess, write_isLoading)
        if (isReady && prep_isSuccess && !write_isLoading) {
            setIsError(false)
            setError(null)
            write_send()
        }
    }, [prep_isSuccess, isReady])

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
        console.log("IQZ :: TRANSACTION :: ERROR", {
            prep: { prep_isError, prep_error },
            write: { write_isError, write_error },
            confirm: {confirmation_isError, confirmation_error}
        })

        if (!!prep_error || !!write_error || !!confirmation_error) {
            setIsFinished(false)
            setIsReady(false)
            setIsError(!!prep_error || !!write_error || !!confirmation_error)
            setError(prep_error || write_error || confirmation_error)
        }
    }, [
        prep_isError, prep_error,
        write_isError, write_error,
        confirmation_isError, confirmation_error
    ])


    const statuses = (state) => {
        switch (state) {
            case Transaction.Waiting: {
                return <>Transfer funds</>
            }
            case Transaction.Processing: {
                return <>{confirmation_isLoading ? "Processing transaction" : "Confirm transaction in wallet"}</>
            }
            case Transaction.Executed: {
                return <>Executed</>
            }
            case Transaction.Failed: {
                return <span className="underline">Transaction failed</span>
            }
            default: {
                return <>Transfer funds</>
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

    if (isFinished) return prepareRow(Transaction.Executed)
    if ((!!prep_error || !!write_error || !!confirmation_error) && !isFinished) return prepareRow(Transaction.Failed)
    if (!isReady) return prepareRow(Transaction.Waiting)
    return prepareRow(Transaction.Processing)
}

