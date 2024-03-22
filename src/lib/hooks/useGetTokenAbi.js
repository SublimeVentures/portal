import { useMemo } from "react";
import { useChainId } from "wagmi";
import { erc20Abi } from "viem";
import { usdtAbi } from "../../../abi/usdt.abi";
import { ETH_USDT } from "@/components/BlockchainSteps/utils";

function useGetTokenAbi(token, forceChainId) {
    const chainId = useChainId();
    const { contract } = token;
    const finalChainId = forceChainId || chainId;

    return useMemo(() => {
        if (!!token) {
            console.log(
                "TOKEN_STTING",
                contract,
                ETH_USDT,
                contract.toLowerCase() === ETH_USDT.toLowerCase() ? "USDT abi" : "regular erc20abi",
            );
            return contract.toLowerCase() === ETH_USDT.toLowerCase() ? usdtAbi : erc20Abi;
        }
        return erc20Abi;
    }, [contract, finalChainId]);
}

export default useGetTokenAbi;
