import {ICONS} from "@/lib/icons";

export const STEPS = {
    NETWORK: 0,
    LIQUIDITY: 1,
    ALLOWANCE: 2,
    TRANSACTION: 3,
}

export const STEP_STATE = {
    Waiting: 0,
    Processing: 1,
    Executed: 2,
    Failed: 3,
}

const stepLiquidity = (state, data) => {
    console.log("BIX :: liq checking", state, data)
    const iconPadding = "p-[7px]"
    let result = {}
    if (state.isFinished) {
        result = {
            state: STEP_STATE.Executed,
            content: "Availability of funds confirmed",
        }
    } else if (!state.isFinished && data.isFetched) {
        result = {
            state: STEP_STATE.Failed,
            content: `Wallet doesn't hold ${state.balance} ${data.token.symbol}`,
            error: {
                text: data?.error?.shortMessage || "Balance too low",
                action: data.refetch
            }
        }
    } else {
        result = {
            state: STEP_STATE.Processing,
            content: "Checking account funds",
        }
    }

    result.icon = ICONS.SEARCH
    result.iconPadding = iconPadding

    return result
}

const stepAllowance = (state, data) => {
    console.log("BIX :: allowance checking", state, data)
    const iconPadding = "p-[7px]"
    let result = {}
    if (state.isFinished) {
        result = {
            state: STEP_STATE.Executed,
            content: "Allowance approved",
        }
    } else if (!state.isFinished && data.isFetched) {
        result = {
            state: STEP_STATE.Failed,
            content: `Failed to set allowance`,
            error: {
                text: data?.error?.shortMessage || "Failed to set allowance",
                action: data.refetch
            }
        }
    } else {
        result = {
            state: STEP_STATE.Processing,
            content: `Confirm allowance in wallet (${data.token.isSettlement ? `$${data.params.allowance}` : `${data.params.allowance} ${data.token.symbol}`})`,
        }
    }

    result.icon = ICONS.KEY
    result.iconPadding = iconPadding

    return result
}

export function StepsState(step, state, data) {
    switch (step) {
        case STEPS.LIQUIDITY: {
            return stepLiquidity(state, data)
        }
        case STEPS.ALLOWANCE: {
            return stepAllowance(state, data)
        }
    }
}
