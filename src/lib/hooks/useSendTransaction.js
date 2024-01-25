import {
    useAccount,
    useChainId,
    useSimulateContract,
    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi'
import {useEffect} from "react";

function useSendTransaction(isEnabled, method, forceChainId) {
    const chainId = useChainId()
    const { address: account } = useAccount()
    const {name, inputs, contract, abi, confirmations} = method


    const scope = `${account}_trans_${contract}_${name}_${!!inputs ? (inputs[1] || inputs[0]) : "temp"}`
    const finalChainId = forceChainId || chainId

    const simulate = useSimulateContract({
        functionName: name,
        address: contract,
        args: inputs,
        abi: abi,
        blockTag: 'safe',
        chainId: finalChainId,
        scopeKey: scope,
        account: account, //todo: chcekc
        query: {
            enabled: isEnabled,
        },
    })

    const write = useWriteContract()

    const confirmEnabled = write.isSuccess
    const confirm = useWaitForTransactionReceipt({
        confirmations: confirmations,
        hash: write?.data,
        query: {
            enabled: confirmEnabled
        }
    })

    console.log(`useSendTransaction - render ${inputs ? inputs[1].toString() : "tempSend"}`, isEnabled, simulate.isSuccess, !write.isPending, !confirm?.data)

    useEffect(() => {
        console.log(`useSendTransaction - trigger ${inputs ? inputs[1].toString() : "temp"}`, simulate.isSuccess, !write.isPending, !confirm?.isLoading, !confirm?.isPending, !confirm.isFetching, isEnabled )
        if (simulate.isSuccess && !write.isPending && !(confirm.isLoading || confirm.isFetching) && isEnabled ) {
            write.writeContract(simulate.data?.request)
        }
    }, [simulate.isSuccess, isEnabled]);


    return {
        isError: simulate.isError || write.isError || confirm.isError,
        error: simulate.error?.shortMessage || write.error?.shortMessage || confirm.error?.shortMessage,
        isLoading: simulate.isFetching || write.isFetching || confirm.isFetching ||  simulate.isLoading || write.isLoading || confirm.isLoading || write.isPending,
        // isLoading: simulate.isFetching || write.isFetching || confirm.isFetching ||  simulate.isLoading || write.isLoading || confirm.isLoading || confirm.isPending || write.isPending,
        simulate,
        write,
        confirm
    }
}

export default useSendTransaction;
