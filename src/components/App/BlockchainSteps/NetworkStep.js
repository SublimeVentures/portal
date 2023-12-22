import {
    useNetwork, useSwitchNetwork
} from 'wagmi'
import {
    getIcon,
    getStatusColor,
    Transaction
} from "@/components/App/BlockchainSteps/config";
import {useEffect} from "react";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";

export default function NetworkStep() {
    const {blockchainProps, stepsIsReady, updateBlockchainProps} = useBlockchainContext();
    const {data, state} = blockchainProps

    const {requiredNetwork, forcePrecheck} = data
    const {network: isReady} = stepsIsReady
    const {isFinished} = state.network

    const {chain} = useNetwork()
    const {chains, error, isLoading: network_isLoading, switchNetwork} = useSwitchNetwork()
    const chainSelected = chains.find(el => el.id === chain?.id);
    const chainDesired = chains.find(el => el.id === requiredNetwork)
    const isRightChain = chainDesired.id === chainSelected.id

    const changeNetwork = () => {
        if (!network_isLoading && !isRightChain) {
            switchNetwork?.(requiredNetwork)
        }
    }

    useEffect(() => {
        if (!isReady) return;
        console.log("IQZ :: NETWORK R/F", isReady, isRightChain)
        updateBlockchainProps([{path: 'state.network.isFinished', value: isRightChain}], "network finished")
        changeNetwork()
    }, [chain?.id, isReady])

    useEffect(() => {
        updateBlockchainProps([{path: 'state.network.isLoading', value: network_isLoading}], "network loading")
    }, [network_isLoading])


    useEffect(() => {
        console.log("IQZ :: NETWORK E/L", error, network_isLoading)
        let updates = [
            {path: 'state.network.isError', value: !!error},
            {path: 'state.network.error', value: error}
        ]
        if (!!error) {
            updates.push({path: 'state.network.lock', value: true})
            updates.push({path: 'state.network.isFinished', value: false})
        }
        updateBlockchainProps(updates, "network error/loading updates")
    }, [error, network_isLoading])


    useEffect(() => {
        updateBlockchainProps([
            {
                path: 'result.network',
                value: {
                    chainSelected,
                    chainDesired,
                    isRightChain
                }
            }
        ], "network update networks")
    }, [chain?.id])


    const statuses = (state) => {
        switch (state) {
            case Transaction.PrecheckFailed: {
                return <span className="underline">Wrong network {chainSelected.name}</span>
            }
            case Transaction.Waiting: {
                return <>Check connected blockchain</>
            }
            case Transaction.Processing: {
                return <>Switching connected blockchain...</>
            }
            case Transaction.Executed: {
                return <>Connected blockchain: <strong>{chainDesired.name}</strong></>
            }
            case Transaction.Failed: {
                return <span className="underline">Failed to switch to {chainDesired.name}</span>
            }
            default: {
                return <>Check blockchain</>
            }
        }
    }

    const prepareRow = (state) => {
        return <div className={`flex flex-row items-center ${getStatusColor(state)}`} onClick={() => changeNetwork()}>
            {getIcon(state)}
            <div>
                {statuses(state)}
            </div>
        </div>
    }

    if (network_isLoading) {
        return prepareRow(Transaction.Processing)
    }
    if (isFinished && isReady || isFinished && forcePrecheck) {
        return prepareRow(Transaction.Executed)
    }
    if (!network_isLoading && isReady && !isFinished || error) {
        return prepareRow(Transaction.Failed)
    }
    if (forcePrecheck) {
        return prepareRow(Transaction.PrecheckFailed)
    } else
        return prepareRow(Transaction.Waiting)
}

