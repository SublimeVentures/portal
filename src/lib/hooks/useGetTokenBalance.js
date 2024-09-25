import { useMemo } from "react";
import { useReadContract, useWatchBlocks } from "wagmi";
import { erc20Abi } from "viem";
import BigNumber from "bignumber.js";

function useGetTokenBalance(isEnabled, token, chainId, account, skipStep) {
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

    // Added !isError, because when an error occurred in useReadContract, the steps got stuck in continuous
    // refetch(), now user have to manually reset
    useWatchBlocks({
        enabled: !isError && isEnabled,
        onBlock(block) {
            console.log("BIX :: New block", block.number);
            refetch();
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

    if (skipStep) return;

    return {
        ...rest,
        isError,
        balance,
    };
}

export default useGetTokenBalance;
