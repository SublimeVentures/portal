import { STEPS_ACTIONS } from "../enums";

export const defaultPrerequisiteStep = {
    isFinished: false,
    lock: true,
    method: null,
    extra: null,
};

export const prerequisiteAction = Object.freeze({
    SET_PREREQUISITE: "SET_PREREQUISITE",
    RESET_PREREQUISITE: "RESET_PREREQUISITE",
});

export function prerequisiteReducer(state, action) {
    const { type, payload } = action;

    switch (type) {
        case STEPS_ACTIONS.START:
            return { ...state, lock: false };
        case STEPS_ACTIONS.RESET:
            return { ...defaultPrerequisiteStep };
        case prerequisiteAction.SET_PREREQUISITE:
            return {
                ...state,
                method: payload?.method,
                extra: payload?.extra,
                error: payload?.error,
                isFinished: payload?.isFinished,
            };
        case prerequisiteAction.RESET_PREREQUISITE:
            return {
                ...defaultPrerequisiteStep,
            };
        default:
            return state;
    }
}
