import {
    useAccount,
    useChainId,
    useSimulateContract,
    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi'
import {useEffect, useState} from "react";
import {STEP_STATE} from "@/components/BlockchainInteraction/StepsState";

function useBlockchainButton(steps, state, params, extraState) {
    const [result, setResult] = useState({
        text: "",
        lock: true,
    });

    const processButtonState = () => {
        // if (params.buttonCustomLock) {
        //     return {
        //         text: params.buttonCustomText,
        //         lock: params.buttonCustomLock,
        //     }
        // }
        //

        console.log("BIX :: BUTTON STATE - liq", steps.liquidity)
        console.log("BIX :: BUTTON STATE - liq2", extraState.stepLiquidity.state)
        if (steps.liquidity && extraState.stepLiquidity.state === STEP_STATE.PROCESSING) {
            return {
                text: "Processing.",
                lock: true
            }
        }
        //
        // if (checkLiquidity && liquidity_isFetched && liquidity_isReady && !liquidity_isFinished) {
        //     return {
        //         text: "Not enough liquidity",
        //         lock: true
        //     }
        // }
        //
        // if (checkAllowance && allowance_isReady && !allowance_isFinished) {
        //     return {
        //         text: "Processing..",
        //         lock: true
        //     }
        // }
        //
        // if (checkTransaction && transaction_isReady && !transaction_isFinished) {
        //     return {
        //         text: "Processing...",
        //         lock: true
        //     }
        // }
        //
        //
        return {
            text: params.buttonText,
            lock: false
        }
    }



    useEffect(() => {
        const buttonState = processButtonState()
        console.log("BIX :: BUTTON STATE",buttonState )

        setResult(buttonState)
    }, [
        extraState.stepLiquidity.state
    ]);



    return {
        buttonIcon: params.buttonIcon,
        buttonLock: result.lock,
        buttonText: result.text
    }
}

export default useBlockchainButton;
