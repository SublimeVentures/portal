import { useMemo } from "react";
import { useReadContract, useWatchBlocks } from "wagmi";
import { erc20Abi } from "viem";
import BigNumber from "bignumber.js";

function useGetTokenBalance(isEnabled, token, chainId, account, liquidity, skipStep) {
    const { contract, precision } = token;

    const scope = `${account}_liq_${contract}`;

    const finalAccount = account || "0x";

    const { data, isError, refetch, ...rest } = useReadContract({
        functionName: "balanceOf",
        address: contract,
        args: [finalAccount],
        abi: erc20Abi,
        blockTag: "latest",
        chainId: chainId,
        scopeKey: scope,
        query: {
            enabled: isEnabled,
            staleTime: 5_000,
        },
    });

    const balance = useMemo(() => {
        if (typeof data !== "undefined") {
            const power = new BigNumber(10).pow(precision);
            const currentBalanceBN = new BigNumber(data);
            return currentBalanceBN.dividedBy(power).toNumber();
        }
        return 0;
    }, [data, precision]);

    // The step got stuck in continuous refetch(), added !isError and balance check so now user have to manually reset
    useWatchBlocks({
        enabled: !isError && isEnabled && balance > liquidity,
        onBlock(block) {
            console.log("BIX :: New block", block.number);
            refetch();
        },
    });

    if (skipStep) return;

    return {
        ...rest,
        isError,
        balance,
    };
}

export default useGetTokenBalance;
