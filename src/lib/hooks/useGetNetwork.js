import {  useEffect} from 'react';
import {useEnvironmentContext} from "@/components/App/BlockchainSteps/EnvironmentContext";

function useGetNetwork(isEnabled, requiredNetwork) {
    const {network} = useEnvironmentContext();
    const isValid = network?.chainId === requiredNetwork

    console.log("BIX :: NETWORK_CHECK - render", isValid, network?.chainId, requiredNetwork)
    useEffect(() => {
        console.log("BIX :: NETWORK_CHECK - switch chain ", !isValid,isEnabled )
        if(!isValid && isEnabled) {
            network?.switchChain({chainId: requiredNetwork})
        }
    }, [isEnabled])


    return {
        network: network?.name,
        chainId: network?.chainId,
        isValid,
        switchNetwork: network?.switchChain,
        isLoading: network?.isLoading,
        error: network?.error
    };
}

export default useGetNetwork;
