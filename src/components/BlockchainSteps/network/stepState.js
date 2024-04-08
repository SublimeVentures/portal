import { ICONS } from "@/lib/icons";
import { STEP_STATE } from '../enums'

export const stepNetwork = (state, data) => {
    const iconPadding = data.params.requiredNetwork === 137 ? "p-[6px]" : "p-[3px]";

    let result = {};
    if (state.isFinished) {
        result = {
            state: STEP_STATE.SUCCESS,
            content: `Connected network: ${state.currentNetwork}`,
        };
    } else if (data.isLoading) {
        result = {
            state: STEP_STATE.PROCESSING,
            content: "Switching network...",
        };
    } else if (!!data.error) {
        result = {
            state: STEP_STATE.ERROR,
            content: `Error switching network`,
            error: {
                text: data?.error?.shortMessage,
            },
        };
    } else {
        result = {
            state: STEP_STATE.PENDING,
            content: "Network check",
        };
    }
    result.icon =
        data.params.requiredNetwork === 1
            ? ICONS.ETH_MONO
            : data.params.requiredNetwork === 137
              ? ICONS.MATIC_MONO
              : ICONS.BSC_MONO;
    result.iconPadding = iconPadding;

    return result;
};
