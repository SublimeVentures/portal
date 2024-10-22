import { useReducer, useCallback } from "react";

export const ACTIONS = {
    SET_AMOUNT: "SET_AMOUNT",
    SET_MULTIPLIER: "SET_MULTIPLIER",
};

const defaultState = {
    amount: 0,
    price: 0,
    total: 0,
    multiplier: 10,
};

const calculatePrice = (multiplier, amount, fee) => {
    if (amount === 0 || Number(amount) === 0) return 0;
    const totalAmount = amount * multiplier;
    const feeAmount = (totalAmount * fee) / totalAmount;
    const value = totalAmount - feeAmount;

    return Number(Math.max(value, 0).toFixed(2));
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_AMOUNT: {
            const { amount, fee } = action.payload;
            const price = calculatePrice(state.multiplier, amount, fee);
            const total = amount * state.multiplier ?? 0;

            return { ...state, amount, price, total, fee };
        }
        case ACTIONS.SET_MULTIPLIER: {
            const { amount, fee } = action.payload;
            const newMultiplier = state.multiplier + (amount ? 5 : -5);
            const clampedMultiplier = Math.max(5, Math.round(newMultiplier / 5) * 5);
            const price = calculatePrice(clampedMultiplier, state.amount, fee);
            const total = state.amount * clampedMultiplier ?? 0;

            return { ...state, multiplier: clampedMultiplier, price, total, fee };
        }
        default:
            return state;
    }
}

export default function useCalculate(fee) {
    const [state, dispatch] = useReducer(reducer, defaultState);

    const handleAmountChange = useCallback(
        (evt) => {
            let amount = evt.target.value;
            amount = amount.replace(/^0+/, "") || "0";
            dispatch({ type: ACTIONS.SET_AMOUNT, payload: { amount, fee } });
        },
        [fee],
    );

    const handleMultiplierChange = useCallback(
        (payload) => {
            dispatch({ type: ACTIONS.SET_MULTIPLIER, payload: { amount: payload, fee } });
        },
        [fee],
    );

    return {
        state,
        handleAmountChange,
        handleMultiplierChange,
    };
}
