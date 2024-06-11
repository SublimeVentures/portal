import { handleProcessing, handlePending, handleError, handleSuccess } from "../helpers";
import { ICONS } from "@/lib/icons";

export const stepPrerequisite = (state, data) => {
    console.log("BIX :: PREREQUISITE :: step state", state, data);

    const iconPadding = "p-[7px]";
    let result = {};

    if (!data.prerequisite_isReady) {
        result = handlePending({ content: data.params.prerequisiteTextWaiting || "Validate transaction" });
    } else {
        if (state.isFinished) {
            result = handleSuccess({ content: data.params.prerequisiteTextSuccess || "Validation successful" });
        } else if (data.isLoading) {
            result = handleProcessing({ content: data.params.prerequisiteTextProcessing || "Validation processing" });
        } else if (data.isError) {
            result = handleError({
                content: data.params.prerequisiteTextError || "Validation failed",
                text: data?.error,
            });
        } else {
            result = handlePending({ content: data.params.prerequisiteTextWaiting || "Validate transaction" });
        }
    }

    result.icon = ICONS.TICKET;
    result.iconPadding = iconPadding;

    console.log("BIX :: PREREQUISITE :: step state result", result, state, data);

    return result;
};
