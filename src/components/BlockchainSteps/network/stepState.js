import { ICONS } from "@/lib/icons";
import { handleProcessing, handlePending, handleError, handleSuccess } from "../helpers";

export const stepNetwork = (state, data) => {
    const iconPadding = data.params.requiredNetwork === 137 ? "p-[6px]" : "p-[3px]";
    let result = {};

    if (state.isFinished) {
        result = handleSuccess({ content: `Connected network: ${state.currentNetwork}` });
    } else if (data.isLoading) {
        result = handleProcessing({ content: "Switching network..." });
    } else if (!!data.error) {
        result = handleError({ content: "Error switching network", text: data?.error?.shortMessage });
    } else {
        result = handlePending({ content: "Network check" });
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
