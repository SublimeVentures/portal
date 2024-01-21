
const DEFAULT_STEP_STATE = {
    isFinished: false,
    isProcessing: false,
    isError: false,
    error: false,
    lock: true
}

export const initialState = {
    liquidity: {
        ...DEFAULT_STEP_STATE,
        balance: 0
    },
    allowance: {
        ...DEFAULT_STEP_STATE,
        current: 0
    },
    prerequisite: {
        ...DEFAULT_STEP_STATE,
        result: {}
    }
};

export function reducer(state, action) {
    switch (action.type) {
        case 'SET_LIQUIDITY':
            return {
                ...state,
                liquidity: {
                    ...state.liquidity,
                    balance: action.payload.balance,
                    isFinished: action.payload.isFinished
                }
            };
        case 'SET_ALLOWANCE':
            return {
                ...state,
                liquidity: {
                    ...state.allowance,
                    current: action.payload.current,
                    isFinished: action.payload.isFinished
                }
            };
        case 'SET_PREREQUISITE':
            return {
                ...state,
                prerequisite: {
                    ...state.prerequisite,
                    result: action.result,
                    isFinished: action.result?.ok
                }
            };
        default:
            return state;
    }
}
