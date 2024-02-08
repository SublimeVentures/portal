import { useMemo } from 'react';
import useGetTokenAbi from "@/lib/hooks/useGetTokenAbi";
import {useEnvironmentContext} from "@/lib/context/EnvironmentContext";

function useGetToken(address) {
    const { currencies} = useEnvironmentContext();

    const token = currencies[address] || {contract:""}
    const abi = useGetTokenAbi(token, token?.chainId)

    return useMemo(() => {
        return {
            ...token,
            abi,
        };
    }, [address]);
}

export default useGetToken;
