import {
    useNetwork, useSwitchNetwork
} from 'wagmi'
import {
    getIcon,
    getStatusColor,
    Transaction
} from "@/components/App/BlockchainSteps/config";
import {useEffect} from "react";

export default function NetworkStep({stepProps}) {
    const {
        processingData,
        isReady,
        setIsReady,
        isFinished,
        setFinished,
        saveData
    } = stepProps

    const {
        requiredNetwork,
        forcePrecheck
    } = processingData

    const {chain} = useNetwork()
    const {chains, error, isLoading, switchNetwork} = useSwitchNetwork()

    const chainSelected = chains.find(el => el.id === chain?.id);
    const chainDesired = chains.find(el => el.id === requiredNetwork)
    const isRightChain = chainDesired.id === chainSelected.id

    console.log("NetworkStep - debug", isRightChain, isLoading, error)
    const changeNetwork = () => {
        console.log("NetworkStep - trigger", isReady, !isLoading, !isFinished, !isRightChain)

        if (isReady && !isLoading) {
            if (!isRightChain) {
            // if (!isFinished && !isRightChain) {
                setIsReady(true)
                switchNetwork?.(requiredNetwork)
            }
        }
    }

    useEffect(() => {
        changeNetwork()
    }, [isReady])

    useEffect(() => {
        if (isReady && !isLoading) {
            setIsReady(false)
        }
    }, [error])


    useEffect(() => {
        if (isRightChain) {
            setFinished(true)
            if(error) {
                setIsReady(true)
            }
        } else {
            setFinished(false)
            changeNetwork()
        }
    }, [isRightChain])

    useEffect(() => {
        saveData({
            chainSelected,
            chainDesired
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

    if (isLoading) {
        return prepareRow(Transaction.Processing)
    }
    if (isRightChain && isReady || isRightChain && forcePrecheck) {
        return prepareRow(Transaction.Executed)
    }
    if (!isLoading && isReady && !isRightChain || error) {
        return prepareRow(Transaction.Failed)
    }
    if (forcePrecheck) {
        return prepareRow(Transaction.PrecheckFailed)
    } else
        return prepareRow(Transaction.Waiting)

}

