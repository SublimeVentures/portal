import {useEffect} from "react";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";

export default function InteractStep() {
    const {blockchainProps, stepsIsReady, updateBlockchainProps, blockchainRunProcess, blockchainRunProcessDirect} = useBlockchainContext();
    const {steps, data, state} = blockchainProps

    const {
        network: checkNetwork,
        liquidity: checkLiquidity,
        allowance: checkAllowance,
        transaction: checkTransaction,
        button: showButton
    } = steps
    const {button: buttonData} = data
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
    const {lock: buttonLock, text: buttonText} = state.button


    const processButtonState = () => {
        if (!showButton) return {};

        if (buttonData.customLockState) {
                return {
                    text: buttonData.customLockText,
                    lock: buttonData.customLockState,
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
            text: buttonData.text,
            lock: false
        }
    }

    const mapToResult = (inputArray) => {
        return inputArray.map(item => {
            return {
                path: `data.transaction.params.${item.param}`,
                value: item.value
            };
        });
    };


    const button = async () => {
        if (buttonData?.buttonFn) {
            const newParams = await buttonData.buttonFn()
            if (Array.isArray(newParams)) {
                const result = mapToResult(newParams);
                updateBlockchainProps(result)
            } else {
                if (newParams.ok) {
                    const result = mapToResult(newParams.update);
                    updateBlockchainProps(result)
                    blockchainRunProcess()
                } else {

                }
            }
        } else {
            blockchainRunProcess()
        }

    }

    useEffect(() => {
        const {text, lock} = processButtonState()

        updateBlockchainProps([
            {path: 'state.button.lock', value: lock},
            {path: 'state.button.text', value: text}
        ])
    }, [
        showButton,
        liquidity_isFetched, liquidity_isReady, liquidity_isFinished,
        network_isReady, network_isFinished,
        allowance_isReady, allowance_isFinished,
        transaction_isReady, transaction_isFinished,
    ])

    return (
        <UniButton
            type={ButtonTypes.BASE}
            isWide={true}
            size={'text-sm sm'}
            state={"danger"}
            icon={buttonData.icon}
            isDisabled={buttonData.customLockState || buttonLock}
            text={buttonData.customLockText ? buttonData.customLockText : buttonText}
            handler={async () => {
                await button()
            }}/>
    )

}

