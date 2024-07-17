import { useMemo } from "react";
import { useReadContract } from "wagmi";
import BigNumber from "bignumber.js";
import abi from "../../../abi/genericStaking.abi.json";

function useGetStakeRequirements(isEnabled, owner, diamond, partnerId, chainId) {
    if (!diamond || !partnerId) return;

    const scope = `${owner}_getStake`;

    const { refetch, data, ...rest } = useReadContract({
        functionName: "getRequirements",
        address: diamond,
        args: [partnerId],
        abi,
        blockTag: "latest",
        chainId: chainId,
        scopeKey: scope,
        query: {
            enabled: isEnabled,
            gcTime: 60_000,
            staleTime: 15_000,
        },
    });

    return {
        ...rest,
        refetch,
        stakeSize: useMemo(() => {
            if (typeof data !== "undefined" && !!diamond && !!data?.stakeSize) {
                return data.stakeSize.map((size) => new BigNumber(size).toNumber());
            }
            return [];
        }, [data]),
        stakeLength: useMemo(() => {
            if (typeof data !== "undefined" && !!diamond && !!data?.length) {
                return data.length.map((length) => new BigNumber(length).toNumber());
            }
            return [];
        }, [data]),
        stakeWithdraw: useMemo(() => {
            if (typeof data !== "undefined" && !!diamond && !!data?.withdrawWindow) {
                return data.withdrawWindow.map((window) => new BigNumber(window).toNumber());
            }
            return [];
        }, [data]),
    };
}

export default useGetStakeRequirements;
