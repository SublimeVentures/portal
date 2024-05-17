import { ICONS } from "@/lib/icons";
import { handleProcessing, handlePending, handleError, handleSuccess } from "../helpers";

export const stepLiquidity = (state, data) => {
    console.log("BIX :: LIQUIDITY :: step state", state, data);

    const iconPadding = "p-[7px]";
    let result = {};

    if (state.isFinished) {
        result = handleSuccess({ content: "Availability of funds confirmed" });
    } else if (data.isFetching || data.isLoading) {
        result = handleProcessing({ content: "Checking account funds" });
    } else if (data.isError) {
        result = handleError({
            content: 'Error occurred',
            text: data?.error?.shortMessage,
            action: data.refetch,
        });
    } else if (data.isFetched && data.isSuccess && !data.liquidity_isFinished) {
        result = handleError({
            content: `Wallet doesn't hold ${data.params.liquidity?.toLocaleString()} ${data.token.symbol}`,
            text: "Balance too low",
            action: data.refetch,
        });
    } else {
        result = handlePending({ content: "Liquidity check" });
    }

    result.icon = ICONS.SEARCH;
    result.iconPadding = iconPadding;

    console.log("BIX :: LIQUIDITY :: step state result", result, state, data);

    return result;
};
