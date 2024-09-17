import { handleProcessing, handlePending, handleError, handleSuccess } from "../helpers";

export const stepTransaction = (state, data) => {
    console.log("BIX :: TRANSITION :: step state", state, data);
    let result = {};

    if (!data.transaction_isReady) {
        result = handlePending({
            content: "Preparing transaction",
            text: "We are setting up your transaction. Please wait a moment.",
        });
    } else {
        if (state.isFinished) {
            result = handleSuccess({
                content: "Transaction confirmed",
                text: "Your transaction has been successfully confirmed.",
            });
        } else if (data.isFetching || data.isLoading) {
            result = handleProcessing({
                content: "Sending transaction",
                text: "Your transaction is being sent. Please wait for confirmation.",
            });
        } else if (data.isError) {
            result = handleError({
                content: "Transaction failed",
                text: data?.error ?? "An error occurred while sending your transaction. Please try again.",
            });
        } else {
            result = handlePending({
                content: "Preparing transaction",
                text: "We are setting up your transaction. Please wait a moment.",
            });
        }
    }

    console.log("BIX :: TRANSITION :: step state result", result, state, data);

    return result;
};
