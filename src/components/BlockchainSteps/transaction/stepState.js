import { ICONS } from "@/lib/icons";
import { handleProcessing, handlePending, handleError, handleSuccess } from "../helpers";

export const stepTransaction = (state, data) => {
    console.log("BIX :: TRANSITION :: step state", state, data);

    const iconPadding = "p-[7px]";
    let result = {};

    if (!data.transaction_isReady) {
        result = handlePending({ content: "Send transaction" });
    } else {
        if (state.isFinished) {
            result = handleSuccess({ content: "Transaction confirmed" })
        } else if (data.isFetching || data.isLoading) {
            result = handleProcessing({ content: "Sending transaction" })
        } else if (data.isError) {
            result = handleError({ content: "Error on sending transaction", text: data?.error });
        } else {
            result = handlePending({ content: "Send transaction" });
        }
    }

    result.icon = ICONS.ROCKET;
    result.iconPadding = iconPadding;

    console.log("BIX :: TRANSITION :: step state result", result, state, data);

    return result;
};
