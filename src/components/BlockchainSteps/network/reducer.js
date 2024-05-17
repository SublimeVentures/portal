import { stepsAction } from "../reducer";

export const defaultNetworkStep = {
    isFinished: false,
    lock: true,
    currentNetwork: "",
    chainId: null,
};

export const networkAction = Object.freeze({
    SET_NETWORK: "SET_NETWORK",
    RESET_NETWORK: "RESET_NETWORK",
})

export function networkReducer(state, action) {
    const { type, payload } = action;

    switch (type) {
        case stepsAction.START:
            return { ...state, lock: false };
        case stepsAction.RESET:
            return { ...defaultNetworkStep };
        case networkAction.SET_NETWORK:
            return { ...state, currentNetwork: payload.network, isFinished: payload.isFinished };
        case networkAction.RESET_NETWORK:
            return { ...defaultNetworkStep }
        default:
            return state;
    }
}
