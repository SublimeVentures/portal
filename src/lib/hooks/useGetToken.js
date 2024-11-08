import { useMemo } from "react";
import useGetTokenAbi from "@/lib/hooks/useGetTokenAbi";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";

function useGetToken(address) {
    // const { currencies } = useEnvironmentContext();

    const currencies = {
        "0xBcf4b6EaD5e44A1FbcF58f8F55906d88290bC1c6": {
            chainId: 84532,
            contract: "0xBcf4b6EaD5e44A1FbcF58f8F55906d88290bC1c6",
            isSettlement: true,
            isStaking: true,
            isStore: false,
            name: "Based",
            precision: 18,
            symbol: "BASED",
        },
    };

    const token = currencies[address] || { contract: "" };
    const abi = useGetTokenAbi(token, token?.chainId);

    return useMemo(() => {
        return {
            ...token,
            abi,
        };
    }, [address]);
}

export default useGetToken;
