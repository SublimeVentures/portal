import { ICONS } from "@/lib/icons";
import { STEP_STATE } from "../enums";

export const stepAllowance = (state, data) => {
    console.log("BIX :: ALLOWANCE :: step state", state, data);

    const iconPadding = "p-[7px]";
    let result = {};

    if (!data.allowance_isReady) {
        result = {
            state: STEP_STATE.PENDING,
            content: "Allowance check",
        };
    } else {
        if (state.isFinished) {
            result = {
                state: STEP_STATE.SUCCESS,
                content: "Allowance approved",
            };
        } else if (data.allowance_set_reset.isLoading || data.allowance_set.isLoading) {
            result = {
                state: STEP_STATE.PROCESSING,
                content: `Approving new allowance (${data.token.isSettlement ? `$${data.params.allowance}` : `${data.params.allowance} ${data.token.symbol}`})`,
            };
        } else if (data.isFetching || data.isLoading) {
            result = {
                state: STEP_STATE.PROCESSING,
                content: "Checking allowance",
            };
        } else if (data.allowance_set_reset.isError || data.allowance_set.isError || !!data.allowance_method_error) {
            result = {
                state: STEP_STATE.ERROR,
                content: `Error on setting allowance`,
                error: {
                    text: data.allowance_set_reset.error || data.allowance_set.error || data.allowance_method_error,
                    action: data.refetch,
                },
            };
        } else if (data.isError) {
            result = {
                state: STEP_STATE.ERROR,
                content: `Error on checking allowance`,
                error: {
                    text: data?.error?.shortMessage || data?.error,
                    action: data.refetch,
                },
            };
        } else if (data.allowance_shouldRun) {
            result = {
                state: STEP_STATE.PROCESSING,
                content: "Checking allowance",
            };
        } else {
            result = {
                state: STEP_STATE.PENDING,
                content: "Allowance check",
            };
        }
    }

    result.icon = ICONS.KEY;
    result.iconPadding = iconPadding;

    return result;
};
