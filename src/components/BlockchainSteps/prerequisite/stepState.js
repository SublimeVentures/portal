import { ICONS } from "@/lib/icons";
import { STEP_STATE } from "../enums";

export const stepPrerequisite = (state, data) => {
    const iconPadding = "p-[7px]";
    let result = {};

    if (!data.prerequisite_isReady) {
        result = {
            state: STEP_STATE.PENDING,
            content: data.params.prerequisiteTextWaiting || "Validate transaction",
        };
    } else {
        if (state.isFinished) {
            result = {
                state: STEP_STATE.SUCCESS,
                content: data.params.prerequisiteTextSuccess || "Validation successful",
            };
        } else if (data.isLoading) {
            result = {
                state: STEP_STATE.PROCESSING,
                content: data.params.prerequisiteTextProcessing || "Validation processing",
            };
        } else if (data.isError) {
            result = {
                state: STEP_STATE.ERROR,
                content: data.params.prerequisiteTextError || "Validation failed",
                error: {
                    text: data?.error,
                    // action: data.refetch
                },
            };
        } else {
            result = {
                state: STEP_STATE.PENDING,
                content: data.params.prerequisiteTextWaiting || "Validate transaction",
            };
        }
    }

    result.icon = ICONS.TICKET;
    result.iconPadding = iconPadding;

    return result;
};
