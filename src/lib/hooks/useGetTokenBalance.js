import {useMemo} from 'react';
import { useReadContract, useWatchBlocks} from 'wagmi'
import {erc20Abi} from 'viem'
import BigNumber from "bignumber.js";

function useGetTokenBalance(isEnabled, token, chainId, account, skipStep) {
    if(!token || skipStep) return
    const {contract, precision} = token

    const scope = `${account}_liq_${contract}`

    const finalAccount = account || '0x'


    const {
        refetch,
        data,
        ...rest
    } = useReadContract(
        {
            functionName: 'balanceOf',
            address: contract,
            args: [finalAccount],
            abi: erc20Abi,
            blockTag: 'latest',
            chainId: chainId,
            scopeKey: scope,
            query: {
                enabled: isEnabled,
                staleTime: 5_000,
            },
        }
    )

    useWatchBlocks({
        enabled: isEnabled,
        onBlock(block) {
            console.log('BIX :: New block', block.number)
            refetch()
        },
    })


    return {
        ...rest,
        balance: useMemo(() => {
            if (typeof data !== 'undefined') {
                const power = new BigNumber(10).pow(precision);
                const currentBalanceBN = new BigNumber(data);
                return currentBalanceBN.dividedBy(power).toNumber();
            }
            return 0
        }, [data]),
    }
}

export default useGetTokenBalance;
