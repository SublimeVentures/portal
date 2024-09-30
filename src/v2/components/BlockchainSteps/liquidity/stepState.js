import { handleProcessing, handlePending, handleError, handleSuccess } from "../helpers";

export const stepLiquidity = (state, data) => {
    console.log("BIX :: LIQUIDITY :: step state", state, data);
    let result = {};

    if (data.liquidity_isReady) {
        result = handlePending({
            content: "Liquidity check",
            text: "The liquidity check is currently underway. Please wait a moment.",
        });

        if (state.isFinished) {
            result = handleSuccess({
                content: "Funds availability confirmed",
                text: "Your account balance has been successfully verified and funds are available.",
            });
        } else if (data.isFetching || data.isLoading) {
            result = handleProcessing({
                content: "Checking account funds",
                text: "We are currently verifying the availability of funds in your account.",
            });
        } else if (data.isError) {
            result = handleError({
                content: "Error occurred",
                text: data?.error?.shortMessage ?? "An error occurred while checking the liquidity. Please try again.",
                action: data.refetch,
            });
        } else if (data.isFetched && data.isSuccess && !data.liquidity_isFinished) {
            result = handleError({
                content: `Insufficient funds`,
                text: `Your current balance is too low to complete this transaction. Your wallet doesn't hold ${data.params.liquidity?.toLocaleString()} ${data.token.symbol}. Please add more funds.`,
                action: data.refetch,
            });
        }
    } else {
        result = handlePending();
    }

    console.log("BIX :: LIQUIDITY :: step state result", result, state, data);

    return result;
};
