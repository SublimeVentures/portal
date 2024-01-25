import {useEffect, useState} from "react";
import {STEP_STATE} from "@/components/BlockchainInteraction/StepsState";

function useBlockchainButton(steps, state, params, extraState) {
    const [result, setResult] = useState({
        text: "",
        lock: true,
    });

    const processButtonState = () => {
        console.log("BIX :: BUTTON STATE", steps, extraState)
        if (params.buttonCustomLock) {
            return {
                text: params.buttonCustomText,
                lock: params.buttonCustomLock,
            }
        }
        if (steps.network && extraState.stepNetwork.state === STEP_STATE.PROCESSING) {
            return {
                text: "Processing.",
                lock: true
            }
        }
        if (steps.liquidity && extraState.stepLiquidity.state === STEP_STATE.PROCESSING) {
            return {
                text: "Processing..",
                lock: true
            }
        }
        if (steps.allowance && extraState.stepAllowance.state === STEP_STATE.PROCESSING) {
            return {
                text: "Processing...",
                lock: true
            }
        }
        if (steps.transaction && extraState.stepTransaction.state === STEP_STATE.PROCESSING) {
            return {
                text: "Processing....",
                lock: true
            }
        }

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
        params.buttonCustomLock,
        extraState.stepNetwork.state,
        extraState.stepLiquidity.state,
        extraState.stepAllowance.state,
        extraState.stepTransaction.state,
    ]);

    return {
        buttonIcon: params.buttonIcon,
        buttonLock: result.lock,
        buttonText: result.text
    }
}

export default useBlockchainButton;
