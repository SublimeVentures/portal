import { useReducer, useCallback } from "react";

export const ACTIONS = {
    SET_AMOUNT: "SET_AMOUNT",
    SET_MULTIPLIER: "SET_MULTIPLIER",
};

const defaultState = {
    amount: 0,
    price: 0,
    multiplier: 20,
};

const calculatePrice = (multiplier, amount) => {
    const value = ((amount * multiplier - amount) * 95) / 100;
    return Number(Math.max(value, 0).toFixed(2));
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_AMOUNT: {
            const amount = action.payload;
            const price = calculatePrice(state.multiplier, amount);

            return { ...state, amount, price };
        }
        case ACTIONS.SET_MULTIPLIER: {
            const increment = action.payload;
            const newMultiplier = state.multiplier + (increment ? 5 : -5);
            const clampedMultiplier =  Math.max(5, Math.round(newMultiplier / 5) * 5);
            const price = calculatePrice(clampedMultiplier, state.amount);

            return { ...state, multiplier: clampedMultiplier, price };
        }
        default:
            return state;
    };
};

export default function useCalculate() {
    const [state, dispatch] = useReducer(reducer, defaultState);

    const handleAmountChange = useCallback((evt) => {
        let payload = evt.target.value;
        payload = payload.replace(/^0+/, '') || '0';
        dispatch({ type: ACTIONS.SET_AMOUNT, payload });
    }, []);

    const handleMultiplierChange = useCallback((payload) => {
        dispatch({ type: ACTIONS.SET_MULTIPLIER, payload });
    }, []);

    return {
        state,
        handleAmountChange,
        handleMultiplierChange,
    };
};
