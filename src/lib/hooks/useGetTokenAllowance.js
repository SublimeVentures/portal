import {useMemo} from 'react';
import {useReadContract, useWatchBlocks} from 'wagmi'
import BigNumber from "bignumber.js";
import useGetTokenAbi from "@/lib/hooks/useGetTokenAbi";

function useGetTokenAllowance(isEnabled, token, owner, spender, chainId, skipStep) {
    if(!token || skipStep) return;

    const {contract, precision} = token

    const scope = `${owner}_allowance_${contract}`

    const inputs = useMemo(() => [owner, spender], [owner, spender])
    const abi = useGetTokenAbi(token, chainId)

    const {
        refetch,
        data,
        ...rest
    } = useReadContract(
        {
            functionName: 'allowance',
            address: contract,
            args: inputs,
            abi,
            blockTag: 'latest',
            chainId: chainId,
            scopeKey: scope,
            query: {
                enabled: isEnabled,
                gcTime: 1_000,
                staleTime: 1_000
                // gcTime: 0,
                // staleTime: 0
            },
        }
    )

    useWatchBlocks({
        enabled: isEnabled,
        onBlock(block) {
            console.log('BIX :: ALLOWANCE CHECK : New block', block.number)
            refetch()
        },
    })

    return {
        ...rest,
        refetch,
        allowance: useMemo(() => {
            if (typeof data !== 'undefined' && !!contract && precision) {
                const power = new BigNumber(10).pow(precision);
                const currentBalanceBN = new BigNumber(data);
                return currentBalanceBN.dividedBy(power).toNumber();
            }
            return 0
        }, [data]),
    }
}

export default useGetTokenAllowance;
