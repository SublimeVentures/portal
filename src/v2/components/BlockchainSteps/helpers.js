import { STEP_STATE } from "./enums";

export const handleError = ({ content, text, action = () => {} }) => ({
    state: STEP_STATE.ERROR,
    content,
    error: {
        text,
        action,
    },
});

export const handleProcessing = ({ content }) => ({ state: STEP_STATE.PROCESSING, content });

export const handlePending = ({ content }) => ({ state: STEP_STATE.PENDING, content });

export const handleSuccess = ({ content }) => ({ state: STEP_STATE.SUCCESS, content });

export const countSteps = (steps) => {
    const stepsNames = ["network", "liquidity", "allowance", "transaction"];
    return stepsNames.reduce((acc, stepName) => {
        if (steps[stepName]) {
            if (stepName === "transaction") {
                return acc + 2;
            }

            return acc + 1;
        }

        return acc;
    }, 0);
};
