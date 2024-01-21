import {useMemo} from 'react';
import { useChainId, useReadContract} from 'wagmi'
import BigNumber from "bignumber.js";
import useGetTokenAbi from "@/lib/hooks/useGetTokenAbi";

function useGetTokenAllowance(isEnabled, token, owner, spender, forceChainId) {
    const chainId = useChainId()
    const {contract, precision} = token

    const scope = `${owner}_allowance_${contract}`

    const finalChainId = forceChainId || chainId

    const inputs = useMemo(() => [owner, spender], [owner, spender])
    const abi = useGetTokenAbi(token, finalChainId)

    const {
        data,
        ...rest
    } = useReadContract(
        {
            functionName: 'allowance',
            address: contract,
            args: inputs,
            abi,
            blockTag: 'safe',
            chainId: finalChainId,
            scopeKey: scope,
            query: {
                enabled: isEnabled,
                gcTime: 15_000,
                staleTime: 1_000
            },
        }
    )

    return {
        ...rest,
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
