import { STEPS_ACTIONS } from "../enums";

export const defaultTransactionStep = {
    isFinished: false,
    lock: true,
    txID: 0,
};

export const transactionAction = Object.freeze({
    SET_TRANSACTION: "SET_TRANSACTION",
    RESET_TRANSACTION: "RESET_TRANSACTION",
});

export function transactionReducer(state, action) {
    const { type } = action;

    switch (type) {
        case STEPS_ACTIONS.START:
            return { ...state, lock: false };
        case STEPS_ACTIONS.RESET:
            return { ...defaultTransactionStep };
        case transactionAction.SET_TRANSACTION:
            return {
                ...state,
                isFinished: !!action.result,
                txID: action.result,
            };
        case transactionAction.RESET_TRANSACTION:
            return {
                ...defaultTransactionStep,
            };
        default:
            return state;
    }
}
