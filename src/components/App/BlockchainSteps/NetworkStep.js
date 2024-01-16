import {
    blockchainRow,
    statusRow,
    Transaction
} from "@/components/App/BlockchainSteps/config";
import {useEffect} from "react";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";
import {useEnvironmentContext} from "@/components/App/BlockchainSteps/EnvironmentContext";
import {ICONS} from "@/lib/icons";

export default function NetworkStep() {
    const {blockchainProps, stepsIsReady, updateBlockchainProps} = useBlockchainContext();
    const {data, state} = blockchainProps
    const {network: isReady} = stepsIsReady
    const {isFinished, error} = state.network

    const {network: environmentNetwork} = useEnvironmentContext();
    const {switchChain, chainId, name, error: envNetworkError, isLoading: network_isLoading} = environmentNetwork

    const isRightChain = data.requiredNetwork === chainId

    const changeNetwork = () => {
        if (!network_isLoading && !isRightChain) {
            switchChain?.({chainId: data.requiredNetwork})
        }
    }

    useEffect(() => {
        console.log("IQZ :: NETWORK R", isReady, isRightChain, chainId)
        let updates = [
            {path: 'state.network.isError', value: false},
            {path: 'state.network.error', value: false},
            {path: 'state.network.isFinished', value: isRightChain}
        ]
        if (isRightChain) {
            updates.push({path: 'state.network.lock', value: false})
        }
        updateBlockchainProps(updates, "network finished")
    }, [chainId, isRightChain])


    useEffect(() => {
        if (!isReady && !isFinished && !isRightChain) return;
        console.log("IQZ :: NETWORK F", !isReady, !isRightChain, !isFinished)
        changeNetwork()
    }, [isReady])


    useEffect(() => {
        updateBlockchainProps([{path: 'state.network.isLoading', value: network_isLoading}], "network loading")
    }, [network_isLoading])


    useEffect(() => {
        console.log("IQZ :: NETWORK E/L", !!envNetworkError, network_isLoading, !!envNetworkError)
        if (!!envNetworkError || !isRightChain) {
            updateBlockchainProps([
                {path: 'state.network.lock', value: true},
                {path: 'state.network.isReady', value: true},
                {path: 'state.network.isFinished', value: false},
                {path: 'state.network.error', value: envNetworkError}
            ], "network error/loading updates")

        }
    }, [error, network_isLoading, chainId])


    useEffect(() => {
        updateBlockchainProps([
            {
                path: 'result.network',
                value: {
                    chainId,
                    requiredNetwork: data.requiredNetwork,
                    isRightChain
                }
            }
        ], "network update networks")
    }, [chainId])


    console.log("IQZ :: NETWORK SUMM", !network_isLoading, isReady, !isFinished, error,isRightChain,envNetworkError )
    const icon = data.requiredNetwork === 1 ? ICONS.ETH_MONO : (data.requiredNetwork === 137 ? ICONS.MATIC_MONO : ICONS.BSC_MONO )
    const iconPadding = data.requiredNetwork === 137 ?  "p-[6px]" : "p-[3px]"
    if (network_isLoading) {
        return blockchainRow(Transaction.Processing, <>Switching network...</>, icon, iconPadding)
    }
    if (isRightChain) {
        return blockchainRow(Transaction.Executed, <>Connected network:&nbsp;<strong>{name}</strong></>, icon, iconPadding)
    }
    if (!network_isLoading && isReady && !isFinished || error) {
        return blockchainRow(Transaction.Failed, envNetworkError?.shortMessage ? <>Failed to switch network</>: <>Wrong network:&nbsp;<strong>{name}</strong></>, icon, iconPadding, envNetworkError?.shortMessage ? envNetworkError?.shortMessage : "Switched to wrong network", changeNetwork)
    }
    return blockchainRow(Transaction.Waiting, <>Wrong network:&nbsp;<strong>{name}</strong></>, icon, iconPadding)
}

