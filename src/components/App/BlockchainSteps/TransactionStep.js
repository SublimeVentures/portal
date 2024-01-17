import {
    useSimulateContract,
    useWriteContract, useWaitForTransactionReceipt
} from 'wagmi'
import {useEffect} from "react";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";
import {blockchainRow, Transaction} from "@/components/App/BlockchainSteps/config";
import {ICONS} from "@/lib/icons";

export default function TransactionStep() {
    const {blockchainProps, stepsIsReady, updateBlockchainProps} = useBlockchainContext();
    const {data, state} = blockchainProps
    const {error: errorPrerequisite} = state.prerequisite

    const {transactionMethod, transactionReady} = data
    const {transaction: isReady} = stepsIsReady
    const {isFinished, isError, error} = state.transaction

    console.log("TRANSACTION IS ENABLED?", isReady)
    const {
        data: prep_config,
        isSuccess: prep_isSuccess,
        isError: prep_isError,
        error: prep_error,
    } = useSimulateContract({
        address: transactionMethod.address,
        abi: transactionMethod.abi,
        functionName: transactionMethod.method,
        args: transactionMethod.args,
        scopeKey: 'foo1',
        enabled: isReady
    })


    const {
        data: write_data,
        writeContract: write_send,
        isError: write_isError,
        error: write_error,
        isSuccess: write_isSuccess,
        isLoading: write_isLoading,
        isPending: write_Pending
    } = useWriteContract()


    const {
        data: confirmation_data,
        isError: confirmation_isError,
        error: confirmation_error,
        isSuccess: confirmation_isSuccess,
        isLoading: confirmation_isLoading,
        isFetching: confirmation_isFetching
    } = useWaitForTransactionReceipt({
        confirmations: 2,
        hash: write_data,
    })



    useEffect(() => {
        console.log("IQZ :: TRANSACTION :: SEND", isReady, prep_isSuccess, write_isLoading)
        if (isReady && prep_isSuccess && !write_isLoading && transactionReady) {
            updateBlockchainProps([
                { path: 'state.transaction.isError', value: false },
                { path: 'state.transaction.error', value: null }
            ], "transaction write")
            write_send(prep_config?.request)
        }
    }, [prep_isSuccess, isReady, transactionMethod.method, transactionReady])

    useEffect(() => {
        console.log("IQZ :: TRANSACTION - success - confirmation_data, confirmation_isSuccess",confirmation_data, confirmation_isSuccess)
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
            ],"transaction succesfully ocnfirmed")
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
            ], "transaction errored")
        }
    }, [
        prep_isError, prep_error,
        write_isError, write_error,
        confirmation_isError, confirmation_error
    ])

    console.log("IQZ :: TRANACTION UI status", isFinished, isError, isReady)


    const iconPadding = "p-[7px]"

    if (isFinished) {
        return blockchainRow(Transaction.Executed, <>Executed</>, ICONS.ROCKET, iconPadding)
    }
    if (isError && !isFinished || errorPrerequisite) {
        return blockchainRow(Transaction.Failed, <>Transaction failed</>, ICONS.ROCKET, iconPadding, error.shortMessage || errorPrerequisite)
    }
    if (!isReady) {
        return blockchainRow(Transaction.Waiting, <>Send transaction</>, ICONS.ROCKET, iconPadding)
    }
    return blockchainRow(Transaction.Processing, <>{confirmation_isLoading ? "Processing transaction" : "Confirm transaction in wallet"}</>, ICONS.ROCKET, iconPadding)

}

