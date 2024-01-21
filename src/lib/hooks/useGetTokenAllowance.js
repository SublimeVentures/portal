import {useMemo} from 'react';
import {useAccount, useChainId, useReadContract, useWatchBlocks} from 'wagmi'
import {erc20Abi} from 'viem'
import BigNumber from "bignumber.js";

function useGetTokenBalance(params) {
    const chainId = useChainId()
    const { address: account } = useAccount()
    const {isEnabled, contract, precision, forceChainId} = params

    const scope = `${account}_liq_${contract}`

    const finalChainId = forceChainId || chainId
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
            blockTag: 'safe',
            chainId: finalChainId,
            scopeKey: scope,
            query: {
                enabled: isEnabled,
                staleTime: 1_000,
            },
        }
    )

    useWatchBlocks({
        enabled: isEnabled,
        onBlock(block) {
            console.log('New block', block.number)
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
            return new BigNumber(0)
        }, [data]),
    }
}

export default useGetTokenBalance;
