import { ICONS } from "@/lib/icons";
import { STEP_STATE } from "../enums";

export const stepTransaction = (state, data) => {
    const iconPadding = "p-[7px]";
    let result = {};

    if (!data.transaction_isReady) {
        result = {
            state: STEP_STATE.PENDING,
            content: "Send transaction",
        };
    } else {
        if (state.isFinished) {
            result = {
                state: STEP_STATE.SUCCESS,
                content: "Transaction confirmed",
            };
        } else if (data.isFetching || data.isLoading) {
            result = {
                state: STEP_STATE.PROCESSING,
                content: "Sending transaction",
            };
        } else if (data.isError) {
            result = {
                state: STEP_STATE.ERROR,
                content: `Error on sending transaction`,
                error: {
                    text: data?.error,
                },
            };
        } else {
            result = {
                state: STEP_STATE.PENDING,
                content: "Send transaction",
            };
        }
    }

    result.icon = ICONS.ROCKET;
    result.iconPadding = iconPadding;

    return result;
};