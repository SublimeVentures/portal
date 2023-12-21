import {usePrepareContractWrite, useContractWrite, useWaitForTransaction} from 'wagmi'
import {useEffect} from "react";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";
import {getIcon, getStatusColor, Transaction} from "@/components/App/BlockchainSteps/config";

export default function TransactionStep() {
    const {blockchainProps, stepsIsReady, updateBlockchainProps} = useBlockchainContext();
    const {data, state} = blockchainProps

    const {userWallet, transaction} = data
    const {transaction: isReady} = stepsIsReady
    const {isFinished, isError} = state.transaction

    const {
        config: prep_config,
        isSuccess: prep_isSuccess,
        isError: prep_isError,
        error: prep_error,
    } = usePrepareContractWrite({
        address: transaction.method.address,
        abi: transaction.method.abi,
        functionName: transaction.method.method,
        args: transaction.method.args,
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
        if (isReady && prep_isSuccess && !write_isLoading && transaction.method.method) {
            updateBlockchainProps([
                { path: 'state.transaction.isError', value: false },
                { path: 'state.transaction.error', value: null }
            ])
            write_send()
        }
    }, [prep_isSuccess, isReady, transaction.method.method])

    useEffect(() => {
        if (!!confirmation_data && confirmation_isSuccess) {
            updateBlockchainProps([
                { path: 'state.transaction.isError', value: false },
                { path: 'state.transaction.error', value: null },
                { path: 'state.transaction.isFinished', value: true },
                { path: 'result.transaction', value: {
                        confirmation_isSuccess,
                        confirmation_data
                    }
                }
            ])
        }
    }, [confirmation_data, confirmation_isSuccess])

    useEffect(() => {
        console.log("IQZ :: TRANSACTION :: ERROR", {
            prep: { prep_isError, prep_error },
            write: { write_isError, write_error },
            confirm: {confirmation_isError, confirmation_error}
        })

        if (!!prep_error || !!write_error || !!confirmation_error) {
            updateBlockchainProps([
                { path: 'state.transaction.isError', value: !!prep_error || !!write_error || !!confirmation_error },
                { path: 'state.transaction.error', value: prep_error || write_error || confirmation_error },
                { path: 'state.transaction.isFinished', value: false },
                { path: 'state.transaction.lock', value: true },
                { path: 'state.allowance.lock', value: true }
            ])
        }
    }, [
        prep_isError, prep_error,
        write_isError, write_error,
        confirmation_isError, confirmation_error
    ])


    const statuses = (state) => {
        switch (state) {
            case Transaction.Waiting: {
                return <>Send transaction</>
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
                return <>Send transaction</>
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
    if (isError && !isFinished) return prepareRow(Transaction.Failed)
    if (!isReady) return prepareRow(Transaction.Waiting)
    return prepareRow(Transaction.Processing)
}

