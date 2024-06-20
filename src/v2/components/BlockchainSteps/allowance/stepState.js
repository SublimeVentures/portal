import { handleProcessing, handlePending, handleError, handleSuccess } from "../helpers";
import { ICONS } from "@/lib/icons";

export const stepAllowance = (state, data) => {
    console.log("BIX :: ALLOWANCE :: step state", state, data);
    let result = {};

    if (!data.allowance_isReady) {
        result = handlePending({ content: "Allowance check" });
    } else {
        if (state.isFinished) {
            result = handleSuccess({ content: "Allowance approved" });
        } else if (data.allowance_set_reset.isLoading || data.allowance_set.isLoading) {
            result = handleProcessing({
                content: `Approving new allowance (${data.token.isSettlement ? `$${data.params.allowance}` : `${data.params.allowance} ${data.token.symbol}`})`,
            });
        } else if (data.isFetching || data.isLoading) {
            result = handleProcessing({ content: "Checking allowance" });
        } else if (data.allowance_set_reset.isError || data.allowance_set.isError || !!data.allowance_method_error) {
            result = handleError({
                content: "Error on setting allowance",
                text: data.allowance_set_reset.error || data.allowance_set.error || data.allowance_method_error,
                action: data.refetch,
            });
        } else if (data.isError) {
            result = handleError({
                content: "Error on checking allowance",
                text: data?.error?.shortMessage || data?.error,
                action: data.refetch,
            });
        } else if (data.allowance_shouldRun) {
            result = handleProcessing({ content: "Checking allowance" });
        } else {
            result = handlePending({ content: "Allowance check" });
        }
    }

    result.icon = ICONS.KEY;
    console.log("BIX :: ALLOWANCE :: step state result", result, state, data);

    return result;
};
