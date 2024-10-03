import { networkReducer, defaultNetworkStep } from "./network";
import { liquidityReducer, defaultLiquidityStep } from "./liquidity/reducer";
import { allowanceReducer, defaultAllowanceStep } from "./allowance";
import { prerequisiteReducer, defaultPrerequisiteStep } from "./prerequisite/reducer";
import { transactionReducer, defaultTransactionStep } from "./transaction/reducer";

import { STEPS_STATE, STEPS_ACTIONS } from "./enums";

export const initialState = {
    status: STEPS_STATE.PENDING,
    network: defaultNetworkStep,
    liquidity: defaultLiquidityStep,
    allowance: defaultAllowanceStep,
    prerequisite: defaultPrerequisiteStep,
    transaction: defaultTransactionStep,
};

const statusReducer = (state = STEPS_STATE.PENDING, action) => {
    switch (action.type) {
        case STEPS_ACTIONS.START:
            return STEPS_STATE.PROCESSING;
        case STEPS_ACTIONS.SUCCESS:
            return STEPS_STATE.SUCCESS;
        case STEPS_ACTIONS.ERROR:
            return STEPS_STATE.ERROR;
        case STEPS_ACTIONS.RESET:
            return STEPS_STATE.PENDING;
        default:
            return state;
    }
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
