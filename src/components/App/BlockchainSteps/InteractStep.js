import {useEffect, useState} from "react";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";

export default function InteractStep() {
    const {
        blockchainRunProcess,
        blockchainProps,
        networkState,
        allowanceState,
        liquidityState,
        transactionState,
        buttonState
    } = useBlockchainContext();

    const {
        checkLiquidity,
        checkAllowance,
        checkNetwork,
        checkTransaction,

        showButton,
        buttonData
    } = blockchainProps

    const {
        isReady: network_isReady,
        isFinished: network_isFinished,
        setLock: network_setLock
    } = networkState

    const {
        isFetched: liquidity_isFetched,
        isReady: liquidity_isReady,
        isFinished: liquidity_isFinished,
        setLock: liquidity_setLock
    } = liquidityState

    const {
        isFetched: allowance_isFetched,
        isReady: allowance_isReady,
        isFinished: allowance_isFinished,
        setLock: allowance_setLock
    } = allowanceState

    const {
        isFetched: transaction_isFetched,
        isReady: transaction_isReady,
        isFinished: transaction_isFinished,
        setLock: transaction_setLock
    } = transactionState

    const {
        buttonLock,
        setButtonLock,
        buttonText,
        setButtonText
    } = buttonState


    const processButtonState = () => {
        if(!showButton) return {};

        if(buttonData?.customLock) {
            if(buttonData?.customLockParams.length>0) {
                for(let i=0; i<buttonData?.customLockParams.length; i++ ){
                    if(buttonData?.customLockParams[i].check) {
                        return {
                            text: buttonData?.customLockParams[i]?.error ? buttonData?.customLockParams[i]?.error : "Processing...",
                            lock: buttonData?.customLockParams[i].check
                        }

                    }
                }
            }
        }

        if(checkNetwork && network_isReady && !network_isFinished) {
            return {
                text: "Processing...",
                lock: true
            }
        }

        if(checkLiquidity && liquidity_isFetched && liquidity_isReady && !liquidity_isFinished) {
            return {
                text: "Not enough liquidity",
                lock: true
            }
        }

        if(checkAllowance && allowance_isReady && !allowance_isFinished) {
            return {
                text: "Processing...",
                lock: true
            }
        }

        if(checkTransaction && transaction_isReady && !transaction_isFinished) {
            return {
                text: "Processing...",
                lock: true
            }
        }

        return {
            text: buttonData.text,
            lock: false
        }
    }

    useEffect(() => {
        console.log("IQZ :: INTERACT NETWORK", network_isReady, network_isFinished,)
        const {text, lock} = processButtonState()
        setButtonLock(lock)
        setButtonText(text)
    }, [
        showButton,
        liquidity_isFetched, liquidity_isReady, liquidity_isFinished,
        network_isReady, network_isFinished,
        allowance_isReady, allowance_isFinished,
        transaction_isReady, transaction_isFinished,
    ])

    return(
       <UniButton
            type={ButtonTypes.BASE}
            isWide={true}
            size={'text-sm sm'}
            text={buttonText}
            state={"danger"}
            icon={buttonData.icon}
            isDisabled={buttonLock}
            handler={() => {
                buttonData?.buttonFn ? buttonData?.buttonFn() : blockchainRunProcess()
            }}/>
    )

}

