import { handleProcessing, handlePending, handleError, handleSuccess } from "../helpers";
import { ICONS } from "@/lib/icons";

export const stepNetwork = (state, data) => {
    console.log("BIX :: NETWORK :: step state", state, data);

    const iconPadding = data.params.requiredNetwork === 137 ? "p-[6px]" : "p-[3px]";
    let result = {};

    if (state.isFinished) {
        result = handleSuccess({ content: `Connected network: ${state.currentNetwork}` });
    } else if (data.isLoading) {
        result = handleProcessing({ content: "Switching network..." });
    } else if (data.error) {
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

    console.log("BIX :: NETWORK :: step state result", result, state, data);

    return result;
};
