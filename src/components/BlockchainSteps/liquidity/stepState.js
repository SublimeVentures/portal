import { ICONS } from "@/lib/icons";
import { STEP_STATE } from "../enums";

export const stepLiquidity = (state, data) => {
  const iconPadding = "p-[7px]";
  let result = {};
  if (state.isFinished) {
      result = {
          state: STEP_STATE.SUCCESS,
          content: "Availability of funds confirmed",
      };
  } else if (data.isFetching || data.isLoading) {
      result = {
          state: STEP_STATE.PROCESSING,
          content: "Checking account funds",
      };
  } else if (data.isError) {
      result = {
          state: STEP_STATE.ERROR,
          content: `Error occurred`,
          error: {
              text: data?.error?.shortMessage,
              action: data.refetch,
          },
      };
  } else if (data.isFetched && data.isSuccess && !data.liquidity_isFinished) {
      result = {
          state: STEP_STATE.ERROR,
          content: `Wallet doesn't hold ${data.params.liquidity?.toLocaleString()} ${data.token.symbol}`,
          error: {
              text: "Balance too low",
              action: data.refetch,
          },
      };
  } else {
      result = {
          state: STEP_STATE.PENDING,
          content: "Liquidity check",
      };
  }

  result.icon = ICONS.SEARCH;
  result.iconPadding = iconPadding;
  console.log("BIX :: LIQUIDITY :: step state result", result, state, data);

  return result;
};
