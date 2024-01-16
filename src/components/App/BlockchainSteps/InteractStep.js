import {useEffect} from "react";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";

export default function InteractStep() {
    const {blockchainProps, stepsIsReady, updateBlockchainProps, blockchainRunProcess} = useBlockchainContext();
    const {steps, data, state} = blockchainProps

    const {
        network: checkNetwork,
        liquidity: checkLiquidity,
        allowance: checkAllowance,
        transaction: checkTransaction,
        button: showButton
    } = steps

    const { buttonCustomLock, buttonCustomText, buttonText, buttonIcon} = data
    const {
        network: network_isReady,
        liquidity: liquidity_isReady,
        allowance: allowance_isReady,
        transaction: transaction_isReady,
    } = stepsIsReady

    const {isFinished: network_isFinished} = state.network
    const {isFinished: liquidity_isFinished, isFetched: liquidity_isFetched} = state.liquidity
    const {isFinished: allowance_isFinished, isFetched: allowance_isFetched} = state.allowance
    const {isFinished: transaction_isFinished, isFetched: transaction_isFetched} = state.transaction
    const {lock: buttonFinalLock, text: buttonFinalText} = state.button


    const processButtonState = () => {
        console.log("buttonChecskk",buttonCustomLock, buttonText)
        if (buttonCustomLock) {
                return {
                    text: buttonCustomText,
                    lock: buttonCustomLock,
                }
        }

        if (checkNetwork && network_isReady && !network_isFinished) {
            return {
                text: "Processing.",
                lock: true
            }
        }

        if (checkLiquidity && liquidity_isFetched && liquidity_isReady && !liquidity_isFinished) {
            return {
                text: "Not enough liquidity",
                lock: true
            }
        }

        if (checkAllowance && allowance_isReady && !allowance_isFinished) {
            return {
                text: "Processing..",
                lock: true
            }
        }

        if (checkTransaction && transaction_isReady && !transaction_isFinished) {
            return {
                text: "Processing...",
                lock: true
            }
        }


        return {
            text: buttonText,
            lock: false
        }
    }


    useEffect(() => {
        const {text, lock} = processButtonState()
        console.log("IQZ :: interact set", text, lock, buttonCustomLock)
        updateBlockchainProps([
            {path: 'state.button.lock', value: lock},
            {path: 'state.button.text', value: text}
        ], "button interact")
    }, [
        showButton,
        liquidity_isFetched, liquidity_isReady, liquidity_isFinished,
        network_isReady, network_isFinished,
        allowance_isReady, allowance_isFinished,
        transaction_isReady, transaction_isFinished,
        buttonCustomLock,
    ])

    return (
        <UniButton
            type={ButtonTypes.BASE}
            isWide={true}
            size={'text-sm sm'}
            state={"danger"}
            icon={buttonIcon}
            isDisabled={buttonCustomLock || buttonFinalLock}
            text={buttonCustomText? buttonCustomText: buttonFinalText}
            handler={ () => {
                blockchainRunProcess()
            }}/>
    )

}

