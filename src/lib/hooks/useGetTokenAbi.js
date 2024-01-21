import {useMemo} from 'react';
import {useChainId} from 'wagmi'
import {usdtAbi} from "../../../abi/usdt.abi";
import {erc20Abi} from 'viem'
import {ETH_USDT} from "@/components/BlockchainInteraction/utils";

function useGetTokenAbi(token, forceChainId) {
    const chainId = useChainId()
    const {contract} = token
    const finalChainId = forceChainId || chainId

    return useMemo(() => {
            if (!!token) {
               return contract.toLowerCase() === ETH_USDT ? usdtAbi : erc20Abi
            }
            return erc20Abi
        }, [contract, finalChainId])
}

export default useGetTokenAbi;
