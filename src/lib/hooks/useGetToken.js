import { useMemo } from 'react';
import useGetTokenAbi from "@/lib/hooks/useGetTokenAbi";

function useGetToken(address) {
    const LIST_CURRENCY =
    {
        "0xdAC17F958D2ee523a2206206994597C13D831ec7": {
            "name": "Tether USD",
            "symbol": "USDT",
            "precision": 6,
            "isSettlement": true,
            "isStore": null,
            "isStaking": null,
            "chainId": 1,
            "contract": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
        },
        "0x55d398326f99059fF775485246999027B3197955": {
            "name": "Tether USD",
            "symbol": "USDT",
            "precision": 18,
            "isSettlement": true,
            "isStore": null,
            "isStaking": null,
            "chainId": 56,
            "contract": "0x55d398326f99059fF775485246999027B3197955"
        }
    }

    const token = LIST_CURRENCY[address]
    const abi = useGetTokenAbi(token, token.chainId)

    return useMemo(() => {
        return {
            ...token,
            abi,
        };
    }, [address]);
}

export default useGetToken;
