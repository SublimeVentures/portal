import { handleProcessing, handlePending, handleError, handleSuccess } from "../helpers";

export const stepAllowance = (state, data) => {
    console.log("BIX :: ALLOWANCE :: step state", state, data);
    let result = {};
    
    if (data.allowance_isReady) {
        result = handlePending({ 
            content: "Checking allowance", 
            text: "We are currently verifying your allowance status. Please wait a moment." 
        });

        if (state.isFinished) {
            result = handleSuccess({ 
                content: "Allowance approved", 
                text: "Your transaction allowance has been successfully approved." 
            });
        } else if (data.allowance_set_reset.isLoading || data.allowance_set.isLoading) {
            result = handleProcessing({
                content: `Approving new allowance (${data.token.isSettlement ? `$${data.params.allowance}` : `${data.params.allowance} ${data.token.symbol}`})`,
                text: "Please wait while the new allowance is being approved."
            });
        } else if (data.isFetching || data.isLoading) {
            result = handleProcessing({ 
                content: "Checking allowance", 
                text: "We are checking the current allowance. Please hold on." 
            });
        } else if (data.allowance_set_reset.isError || data.allowance_set.isError || !!data.allowance_method_error) {
            result = handleError({
                content: "Error setting allowance",
                text: data.allowance_set_reset.error ?? data.allowance_set.error ?? data.allowance_method_error ?? "An error occurred while setting the allowance. Please try again.",
                action: data.refetch,
            });
        } else if (data.isError) {
            result = handleError({
                content: "Error checking allowance",
                text: data?.error?.shortMessage ?? data?.error ?? "An error occurred while checking the allowance. Please try again.",
                action: data.refetch,
            });
        } else if (data.allowance_shouldRun) {
            result = handleProcessing({ 
                content: "Rechecking allowance", 
                text: "We are rechecking your allowance. Please wait a moment." 
            });
        };
    } else {
        result = handlePending();
    }
    
    console.log("BIX :: ALLOWANCE :: step state result", result, state, data);

    return result;
};
