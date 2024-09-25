import { handleProcessing, handlePending, handleError, handleSuccess } from "../helpers";

export const stepNetwork = (state, data) => {
    console.log("BIX :: NETWORK :: step state", state, data);
    let result = {};

    if (data.network_isReady) {
        result = handlePending({ 
            content: "Network check", 
            text: "We are currently checking the network status. Please hold on."
        });

        if (state.isFinished) {
            result = handleSuccess({
                content: `Connected to ${state.currentNetwork}`,
                text: "You are now successfully connected to the selected network."
            });
        } else if (data.isLoading) {
            result = handleProcessing({
                content: "Switching network...",
                text: "Please wait while we switch to the selected network."
            });
        } else if (data.error) {
            result = handleError({
                content: "Network switch error", 
                text: data?.error?.shortMessage ?? "An error occurred while switching networks. Please try again later."
            });
        };
    } else {
        result = handlePending();
    };

    console.log("BIX :: NETWORK :: step state result", result, state, data);

    return result;
};

