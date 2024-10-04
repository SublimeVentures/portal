import { handleProcessing, handlePending, handleError, handleSuccess } from "../helpers";

export const stepPrerequisite = (state, data) => {
    console.log("BIX :: PREREQUISITE :: step state", state, data);
    let result = {};

    if (data.prerequisite_isReady) {
        result = handlePending();

        if (state.isFinished) {
            result = handleSuccess({
                content: data.params.prerequisiteTextSuccess ?? "Validation successful",
                text: "Your transaction has been successfully validated and is ready to proceed.",
            });
        } else if (data.isLoading) {
            result = handleProcessing({
                content: data.params.prerequisiteTextProcessing ?? "Processing validation",
                text: "We are currently processing your transaction validation. Please wait.",
            });
        } else if (data.isError) {
            result = handleError({
                content: data.params.prerequisiteTextError ?? "Validation failed",
                text: data?.error ?? "An error occurred during the validation process. Please try again.",
            });
        }
    } else {
        result = handlePending();
    }

    console.log("BIX :: PREREQUISITE :: step state result", result, state, data);

    return result;
};
