import { ICONS } from "@/lib/icons";
import { NetworkEnum } from "@/v2/lib/network";
import { handleProcessing, handlePending, handleError, handleSuccess } from "../helpers";

export const stepNetwork = (state, data) => {
    console.log("BIX :: NETWORK :: step state", state, data);
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
        data.params.requiredNetwork === NetworkEnum.eth
            ? ICONS.ETH_MONO
            : data.params.requiredNetwork === NetworkEnum.matic
              ? ICONS.MATIC_MONO
              : ICONS.BSC_MONO;

    console.log("BIX :: NETWORK :: step state result", result, state, data);

    return result;
};
