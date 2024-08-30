import { STEP_STATE } from "./enums";

export const handleError = ({ content, text, action = () => {} }) => ({
    state: STEP_STATE.ERROR,
    content,
    text,
    error: {
        action,
    },
});

export const handleProcessing = (content) => ({ state: STEP_STATE.PROCESSING, ...content });

export const handlePending = (content) => ({ state: STEP_STATE.PENDING, ...content });

export const handleSuccess = (content) => ({ state: STEP_STATE.SUCCESS, ...content });

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

const defaultState = Object.freeze({
    content: "Analyser Tool",
    text: "This will guide you through each step for a seamless purchase",
});

export const getTextContent = (steps) => {
    const state = { content: "", text: "" };

    for (const stepKey in steps) {
        if (steps.hasOwnProperty(stepKey)) {
            const step = steps[stepKey];

            if (step.state === STEP_STATE.ERROR) {
                return { content: step.content, text: step.text };
            }

            if (step.state === STEP_STATE.PROCESSING) {
                state.content = step.content;
                state.text = step.text;
            }

            if (step.state === STEP_STATE.SUCCESS && !state.content) {
                state.content = step.content;
                state.text = step.text;
            }
        }
    }

    if (!state.content && !state.text) return defaultState;

    return state;
};
