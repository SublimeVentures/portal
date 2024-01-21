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
            "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
        }
    }

    const token = useMemo(() => LIST_CURRENCY[address], [address])
    const abi = useMemo(() => useGetTokenAbi(token, token.chainId), [token?.chainId])

    return {
        token,
        abi
    }
}

export default useGetToken;
