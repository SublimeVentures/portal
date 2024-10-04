import { STEPS_STATE } from "./enums";

export const handleError = ({ content, text, action = () => {} }) => ({
    state: STEPS_STATE.ERROR,
    content,
    text,
    error: {
        action,
    },
});

export const handleProcessing = (content) => ({ state: STEPS_STATE.PROCESSING, ...content });

export const handlePending = (content) => ({ state: STEPS_STATE.PENDING, ...content });

export const handleSuccess = (content) => ({ state: STEPS_STATE.SUCCESS, ...content });

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
    const statePriority = [STEPS_STATE.ERROR, STEPS_STATE.PROCESSING, STEPS_STATE.PENDING, STEPS_STATE.SUCCESS];

    for (const priority of statePriority) {
        const stepKeys = Object.keys(steps);

        for (const key in stepKeys) {
            if (steps[stepKey].state === priority) {
                const { content, text } = steps[key];

                if (!content && !text) {
                    continue;
                }

                return { content, text };
            }
        }
    }

    return defaultState;
};
