import { networkReducer, defaultNetworkStep } from "./network";
import { liquidityReducer, defaultLiquidityStep } from "./liquidity/reducer";
import { allowanceReducer, defaultAllowanceStep } from "./allowance";
import { prerequisiteReducer, defaultPrerequisiteStep } from "./prerequisite/reducer";
import { transactionReducer, defaultTransactionStep } from "./transaction/reducer";

export const stepsAction = Object.freeze({
    START: "START",
    RESET: "RESET",
    ERROR: "ERROR",
    SUCCESS: "SUCCESS",
});

export const stepsStatus = Object.freeze({
    IDLE: "IDLE",
    PROCESSING: "PROCESSING",
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
});

export const initialState = {
    status: stepsStatus.IDLE,
    network: defaultNetworkStep,
    liquidity: defaultLiquidityStep,
    allowance: defaultAllowanceStep,
    prerequisite: defaultPrerequisiteStep,
    transaction: defaultTransactionStep,
};

const statusReducer = (state = stepsStatus.IDLE, action) => {
    switch (action.type) {
        case stepsAction.START:
            return stepsStatus.PROCESSING;
        case stepsAction.SUCCESS:
            return stepsStatus.SUCCESS;
        case stepsAction.ERROR:
            return stepsStatus.ERROR;
        case stepsAction.RESET:
            return stepsStatus.IDLE;
        default:
            return state;
    };
};

export const combineReducers = (slices) => (state, action) => {
    return Object.keys(slices).reduce((acc, prop) => {
        return { ...acc, [prop]: slices[prop](acc[prop], action) };
    }, state);
};

export const stepsReducer = combineReducers({
    network: networkReducer,
    liquidity: liquidityReducer,
    allowance: allowanceReducer,
    prerequisite: prerequisiteReducer,
    transaction: transactionReducer,
});

export const mainReducer = (state = initialState, action) => {
    const intermediateState = stepsReducer(state, action);

    return {
        ...intermediateState,
        status: statusReducer(intermediateState.status, action),
    };
};
