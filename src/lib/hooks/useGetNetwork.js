import { useEffect } from "react";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";

function useGetNetwork(isEnabled, requiredNetwork = 0) {
    const { network } = useEnvironmentContext();
    const isValid = network?.chainId === requiredNetwork;
    
    console.log("BIX :: NETWORK_CHECK - render", isValid, network?.chainId, requiredNetwork);
    useEffect(() => {
        if (!isValid && isEnabled) {
            console.log("BIX :: NETWORK_CHECK - switch chain ", !isValid, isEnabled);
            network?.switchChain({ chainId: requiredNetwork });
        }
    }, [isEnabled]);

    return {
        network: network?.name,
        chainId: network?.chainId,
        isValid,
        switchNetwork: network?.switchChain,
        isLoading: network?.isLoading,
        error: network?.error,
    };
};

export default useGetNetwork;
