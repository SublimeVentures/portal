
const DEFAULT_STEP_STATE = {
    isFinished: false,
    lock: true
}

const DEFAULT_NETWORK = {
    ...DEFAULT_STEP_STATE,
    currentNetwork: "",
    chainId: null,
}
const DEFAULT_LIQUIDITY = {
    ...DEFAULT_STEP_STATE,
    balance: 0
}
const DEFAULT_ALLOWANCE = {
    ...DEFAULT_STEP_STATE,
    current: 0
}
const DEFAULT_PREREQUISITE = {
    ...DEFAULT_STEP_STATE,
    error: null,
    method: null,
}
const DEFAULT_TRANSACTION = {
    ...DEFAULT_STEP_STATE,
    txID: 0,
}


export const initialState = {
    network: {
        ...DEFAULT_NETWORK,
    },
    liquidity: {
        ...DEFAULT_LIQUIDITY,
    },
    allowance: {
        ...DEFAULT_ALLOWANCE,
    },
    prerequisite: {
        ...DEFAULT_PREREQUISITE,
    },
    transaction: {
        ...DEFAULT_TRANSACTION,
    }
};

export function reducer(state, action) {
    switch (action.type) {
        case 'SET_NETWORK':
            console.log("SET_NETWORK", state, action)
            return {
                ...state,
                network: {
                    ...state.network,
                    currentNetwork: action.payload.network,
                    isFinished: action.payload.isFinished
                }
            };
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
                allowance: {
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
                    method: action.payload?.method,
                    isFinished: action.payload?.isFinished,
                    error: action.payload?.error
                }
            };
        case 'SET_TRANSACTION':
            console.log("SET_TRANSACTION", state, action)
            return {
                ...state,
                transaction: {
                    ...state.transaction,
                    method: action.payload?.method,
                    isFinished: action.payload?.isFinished,
                    error: action.payload?.error
                }
            };
        case 'START':
            console.log("START_STATE-DISPACTCH", state, action.payload)
            return {
                ...initialState,
                network: {
                    ...state.network,
                    lock: false,
                },
                liquidity: {
                    ...state.liquidity,
                    lock: false,
                },
                allowance: {
                    ...state.allowance,
                    lock: false,
                },
                prerequisite: {
                    ...state.prerequisite,
                    lock: false,
                },
                transaction: {
                    ...state.transaction,
                    lock: false,
                }
            };
        case 'RESET_NETWORK':
            return {
                ...state,
                network: {
                    ...DEFAULT_NETWORK
                },
            };
        case 'RESET_LIQUIDITY':
            return {
                ...state,
                liquidity: {
                    ...DEFAULT_LIQUIDITY
                },
            };
        case 'RESET_ALLOWANCE':
            return {
                ...state,
                allowance: {
                    ...DEFAULT_ALLOWANCE
                },
            };
        case 'RESET_TRANSACTION':
            return {
                ...state,
                prerequisite: {
                    ...DEFAULT_PREREQUISITE
                },
                transaction: {
                    ...DEFAULT_TRANSACTION
                },
            };
        case 'RESET':
            return {
                ...initialState
            };
        default:
            return state;
    }
}
