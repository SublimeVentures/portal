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
    const {networkState, blockchainProps} = useBlockchainContext();
    const {
        isReady,
        setIsReady,
        isFetched,
        setIsFetched,
        setIsLoading,
        result,
        setResult,
        isFinished,
        setIsFinished,
        setIsError,
        setError,
    } = networkState

    const {processingData} = blockchainProps

    const {
        requiredNetwork,
        forcePrecheck
    } = processingData

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
        console.log("IQZ :: NETWORK R/F", isReady, isRightChain)
        if (!isReady) return;
        setIsFinished(isRightChain)
        changeNetwork()
    }, [chain?.id, isReady])

    useEffect(() => {
        setIsLoading(network_isLoading)
    }, [network_isLoading])


    useEffect(() => {
        console.log("IQZ :: NETWORK E/L", error, network_isLoading)
        setIsError(!!error)
        setError(error)
        if(!!error) {
            setIsReady(false)
        }
    }, [error, network_isLoading])


    useEffect(() => {
        setResult({
            chainSelected,
            chainDesired,
            isRightChain
        })
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

