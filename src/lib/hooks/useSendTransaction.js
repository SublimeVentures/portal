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


    const scope = `${account}_trans_${contract}_${name}_${inputs[1]||inputs[0]}`
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

    console.log("ALL SIMUL", isEnabled,simulate, {
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
            gcTime: 0,
            staleTime: 0
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


    useEffect(() => {
        console.log("BIX :: ALLOWANCE trigger TRANSACTION",simulate.isSuccess, write.isPending, simulate.data )
        if (simulate.isSuccess && !write.isPending) {
            write.writeContract(simulate.data?.request)
        }
    }, [simulate.isSuccess]);


    return {
        simulate,
        write,
        confirm
    }
}

export default useSendTransaction;
