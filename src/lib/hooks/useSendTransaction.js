import {
    useAccount,
    useChainId,
    useSimulateContract,
    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi'
import { v4 as uuidv4 } from 'uuid';

function useSendTransaction(params) {
    const transactionId = uuidv4();
    const chainId = useChainId()
    const { address: account } = useAccount()
    const {isEnabled, method, forceChainId} = params
    const {name, inputs, contract, abi, confirmations} = method


    const scope = `${account}_trans_${contract}_${name}_${transactionId}`
    const finalChainId = forceChainId || chainId

    // const inputs = useMemo(() => [spender, amount], [spender, amount])
    // const abi = useGetTokenAbi(token, finalChainId)


    const {
        data: simulateData,
        isSuccess: simulateIsSuccess,
        isError: simulateIsError,
        error: simulateError,
    } = useSimulateContract({
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


    const {
        writeContract: write,
        writeContractAsync: writeAsync,
        reset: writeReset,
        data: writeData,
        isError: writeIsError,
        error: writeError,
        isLoading: writeIsLoading,
    } = useWriteContract()


    const {
        data: confirmationData,
        isError: confirmation_isErrorZero,
        error: confirmation_errorZero,
        isSuccess: confirmation_isSuccessZero,
    } = useWaitForTransactionReceipt({
        confirmations: 2,
        hash: writeData,
        query: {
            enabled: isEnabled
        }
    })


    // return {
    //     ...rest,
    //     allowance: useMemo(() => {
    //         if (typeof data !== 'undefined' && !!contract && precision) {
    //             const power = new BigNumber(10).pow(precision);
    //             const currentBalanceBN = new BigNumber(data);
    //             return currentBalanceBN.dividedBy(power).toNumber();
    //         }
    //         return 0
    //     }, [data]),
    // }
}

export default useSendTransaction;
