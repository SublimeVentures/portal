import { useMemo} from 'react';
import {useAccount, useReadContract, useWatchBlocks, useChainId} from 'wagmi'
import { erc20Abi } from 'viem'
import BigNumber from "bignumber.js";

function useTokenBalance(params) {
    const chainId = useChainId()
    const { address: account } = useAccount()
    const {isCheckActive, contract, forceChainId} = params

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
                enabled: isCheckActive,
                staleTime: 1_000,
            },
        }
    )


    useWatchBlocks({
        enabled: isCheckActive,
        onBlock(block) {
            console.log('New block', block.number)
            refetch()
        },
    })

    return {
        ...rest,
        balance: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : new BigNumber(0)), [data]),
    }
}

export default useTokenBalance;
