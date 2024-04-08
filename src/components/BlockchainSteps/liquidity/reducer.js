import { stepsAction } from "../reducer";

export const defaultLiquidityStep = {
    isFinished: false,
    lock: true,
    balance: 0
};

export const liquidityAction = Object.freeze({
    SET_LIQUIDITY: "SET_LIQUIDITY",
    RESET_LIQUIDITY: "RESET_LIQUIDITY",
})

export function liquidityReducer(state, action) {
    const { type, payload } = action;

    switch (type) {
        case stepsAction.START:
            return { ...state, lock: false };
        case stepsAction.RESET:
            return { ...defaultLiquidityStep };
        case liquidityAction.SET_LIQUIDITY:
            return { ...state, balance: payload.balance, isFinished: payload.isFinished };
        case liquidityAction.RESET_LIQUIDITY:
            return { ...defaultLiquidityStep }
        default:
            return state;
    }
}
