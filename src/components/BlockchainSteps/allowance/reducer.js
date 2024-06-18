import { stepsAction } from "../reducer";

export const defaultAllowanceStep = {
    isFinished: false,
    lock: true,
    current: 0,
    executing: false,
};

export const allowanceAction = Object.freeze({
    SET_ALLOWANCE: "SET_ALLOWANCE",
    SET_ALLOWANCE_SET: "SET_ALLOWANCE_SET",
    RESET_ALLOWANCE: "RESET_ALLOWANCE",
});

export function allowanceReducer(state, action) {
    const { type, payload } = action;

    switch (type) {
        case stepsAction.START:
            return { ...state, lock: false };
        case stepsAction.RESET:
            return { ...defaultAllowanceStep };
        case allowanceAction.SET_ALLOWANCE:
            return { ...state, current: payload.current, isFinished: payload.isFinished };
        case allowanceAction.SET_ALLOWANCE_SET:
            return { ...state, executing: payload };
        case allowanceAction.RESET_ALLOWANCE:
            return { ...defaultAllowanceStep };
        default:
            return state;
    }
}
