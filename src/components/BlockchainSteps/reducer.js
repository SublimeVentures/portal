import { networkReducer, defaultNetworkStep } from "./network";
import { liquidityReducer, defaultLiquidityStep } from "./liquidity/reducer";
import { allowanceReducer, defaultAllowanceStep } from "./allowance";
import { prerequisiteReducer, defaultPrerequisiteStep } from "./prerequisite/reducer";
import { transactionReducer, defaultTransactionStep } from "./transaction/reducer";

export const stepsAction = Object.freeze({
    START: "START",
    RESET: "RESET",
})

export const initialState = {
    network: defaultNetworkStep,
    liquidity: defaultLiquidityStep,
    allowance: defaultAllowanceStep,
    prerequisite: defaultPrerequisiteStep,
    transaction: defaultTransactionStep,
}

export const combineReducers = slices => (state, action) => {
    return Object.keys(slices).reduce((acc, prop) => {
        return { ...acc, [prop]: slices[prop](acc[prop], action)};
    }, state);
};

export const stepsReducer = combineReducers({
    network: networkReducer,
    liquidity: liquidityReducer,
    allowance: allowanceReducer,
    prerequisite: prerequisiteReducer,
    transaction: transactionReducer,
});
