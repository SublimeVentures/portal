import { useEffect, useState } from "react";

import { STEP_STATE } from "@/components/BlockchainSteps/enums";

function useBlockchainButton(steps, state, params, extraState) {
    const [result, setResult] = useState({ text: "", lock: true });

    const processButtonState = () => {
        console.log("BIX :: BUTTON STATE", steps, extraState);

        if (params.buttonCustomLock) {
            return {
                text: params.buttonCustomText,
                lock: params.buttonCustomLock,
            };
        }
        if (steps.network && extraState?.stepNetwork?.state === STEP_STATE.PROCESSING) {
            return {
                text: "Analysing checkpoints",
                lock: true,
            };
        }
        if (steps.liquidity && extraState?.stepLiquidity?.state === STEP_STATE.PROCESSING) {
            return {
                text: "Analysing checkpoints",
                lock: true,
            };
        }
        if (steps.allowance && extraState?.stepAllowance?.state === STEP_STATE.PROCESSING) {
            return {
                text: "Analysing checkpoints",
                lock: true,
            };
        }
        if (steps.prerequisite && extraState?.stepPrerequisite?.state === STEP_STATE.PROCESSING) {
            return {
                text: "Analysing checkpoints",
                lock: true,
            };
        }
        if (steps.transaction && extraState?.stepTransaction?.state === STEP_STATE.PROCESSING) {
            return {
                text: "Analysing checkpoints",
                lock: true,
            };
        }

        return {
            text: params.buttonText,
            lock: false,
        };
    };

    useEffect(() => {
        const buttonState = processButtonState();

        if (buttonState.lock || state.status === STEP_STATE.PENDING) {
            setResult(buttonState);
        } else {
            const timeoutId = setTimeout(() => {
                const currentState = processButtonState();
                if (!currentState.lock) {
                    setResult(currentState);
                }
            }, 1500);

            return () => clearTimeout(timeoutId);
        }
    }, [
        extraState.stepNetwork?.state,
        extraState.stepLiquidity?.state,
        extraState?.stepAllowance?.state,
        extraState?.stepPrerequisite?.state,
        extraState?.stepTransaction?.state,
    ]);

    useEffect(() => {
        const buttonState = processButtonState();
        setResult(buttonState);
    }, []);

    useEffect(() => {
        const buttonState = processButtonState();
        setResult(buttonState);
    }, [params.buttonCustomLock]);

    return {
        buttonIcon: params.buttonIcon,
        buttonLock: result.lock,
        buttonText: result.text,
    };
};

export default useBlockchainButton;
