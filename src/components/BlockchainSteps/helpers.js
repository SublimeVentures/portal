import { STEP_STATE } from "./enums";

export const handleError = ({ content, text, action = () => {} }) => ({
    state: STEP_STATE.ERROR,
    content,
    error: {
        text,
        action
    }
});

export const handleProcessing = ({ content }) => ({ state: STEP_STATE.PROCESSING, content });

export const handlePending = ({ content }) => ({ state: STEP_STATE.PENDING, content });

export const handleSuccess = ({ content }) => ({ state: STEP_STATE.SUCCESS, content });
