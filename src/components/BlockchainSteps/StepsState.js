import {ICONS} from "@/lib/icons";

export const STEPS = {
    NETWORK: 0,
    LIQUIDITY: 1,
    ALLOWANCE: 2,
    PREREQUISITE: 3,
    TRANSACTION: 4,
}

export const STEP_STATE = {
    PENDING: 0,
    PROCESSING: 1,
    ERROR: 2,
    SUCCESS: 3,
}

const stepNetwork = (state, data) => {
    console.log("BIX :: NETWORK :: step state", state, data)
    const iconPadding = data.params.requiredNetwork === 137 ? "p-[6px]" : "p-[3px]"

    let result = {}
    if (state.isFinished) {
        result = {
            state: STEP_STATE.SUCCESS,
            content: `Connected network: ${state.currentNetwork}`,
        }
    } else if (data.isLoading) {
        result = {
            state: STEP_STATE.PROCESSING,
            content: "Switching network...",
        }
    } else if (!!data.error) {
        result = {
            state: STEP_STATE.ERROR,
            content: `Error switching network`,
            error: {
                text: data?.error?.shortMessage,
            }
        }
    } else {
        result = {
            state: STEP_STATE.PENDING,
            content: "Network check",
        }
    }
    result.icon = data.params.requiredNetwork === 1 ? ICONS.ETH_MONO : (data.requiredNetwork === 137 ? ICONS.MATIC_MONO : ICONS.BSC_MONO)
    result.iconPadding = iconPadding

    return result
}

const stepLiquidity = (state, data) => {
    console.log("BIX :: LIQUIDITY :: step state", state, data)

    const iconPadding = "p-[7px]"
    let result = {}
    // if (!data.liquidity_isReady) {
    //     result = {
    //         state: STEP_STATE.PENDING,
    //         content: "Liquidity check",
    //     }
    // } else {
        if (state.isFinished) {
            result = {
                state: STEP_STATE.SUCCESS,
                content: "Availability of funds confirmed",
            }
        } else if (data.isFetching || data.isLoading) {
            result = {
                state: STEP_STATE.PROCESSING,
                content: "Checking account funds",
            }
        } else if (data.isError) {
            result = {
                state: STEP_STATE.ERROR,
                content: `Error occurred`,
                error: {
                    text: data?.error?.shortMessage,
                    action: data.refetch
                }
            }
        } else if (data.isFetched && data.isSuccess && !data.liquidity_isFinished) {
            result = {
                state: STEP_STATE.ERROR,
                content: `Wallet doesn't hold ${data.params.liquidity?.toLocaleString()} ${data.token.symbol}`,
                error: {
                    text: "Balance too low",
                    action: data.refetch
                }
            }
        } else {
            result = {
                state: STEP_STATE.PENDING,
                content: "Liquidity check",
            }

    }


    result.icon = ICONS.SEARCH
    result.iconPadding = iconPadding
    console.log("BIX :: LIQUIDITY :: step state result", result,state, data)

    return result
}

const stepAllowance = (state, data) => {
    console.log("BIX :: ALLOWANCE :: step state", state, data)

    const iconPadding = "p-[7px]"
    let result = {}

    if (!data.allowance_isReady) {
        result = {
            state: STEP_STATE.PENDING,
            content: "Allowance check",
        }
    } else {
        if (state.isFinished) {
            result = {
                state: STEP_STATE.SUCCESS,
                content: "Allowance approved",
            }
        } else if (data.allowance_set_reset.isLoading || data.allowance_set.isLoading) {
            result = {
                state: STEP_STATE.PROCESSING,
                content: `Approving new allowance (${data.token.isSettlement ? `$${data.params.allowance}` : `${data.params.allowance} ${data.token.symbol}`})`,
            }
        } else if (data.isFetching || data.isLoading) {
            result = {
                state: STEP_STATE.PROCESSING,
                content: "Checking allowance",
            }
        } else if (data.allowance_set_reset.isError || data.allowance_set.isError || !!data.allowance_method_error) {
            result = {
                state: STEP_STATE.ERROR,
                content: `Error on setting allowance`,
                error: {
                    text: data.allowance_set_reset.error || data.allowance_set.error || data.allowance_method_error,
                    action: data.refetch
                }
            }
        } else if (data.isError) {
            result = {
                state: STEP_STATE.ERROR,
                content: `Error on checking allowance`,
                error: {
                    text: data?.error?.shortMessage || data?.error,
                    action: data.refetch
                }
            }
        } else if (data.allowance_shouldRun) {
            result = {
                state: STEP_STATE.PROCESSING,
                content: "Checking allowance",
            }
        } else {
            result = {
                state: STEP_STATE.PENDING,
                content: "Allowance check",
            }
        }
    }

    result.icon = ICONS.KEY
    result.iconPadding = iconPadding

    return result
}

const stepPrerequisite = (state, data) => {
    console.log("BIX :: PREREQUISITE :: step state", state, data)

    const iconPadding = "p-[7px]"
    let result = {}

    if (!data.prerequisite_isReady) {
        result = {
            state: STEP_STATE.PENDING,
            content: data.params.prerequisiteTextWaiting || "Validate transaction",
        }
    } else {
        if (state.isFinished) {
            result = {
                state: STEP_STATE.SUCCESS,
                content: data.params.prerequisiteTextSuccess  || "Validation successful",
            }
        } else if (data.isLoading) {
            result = {
                state: STEP_STATE.PROCESSING,
                content: data.params.prerequisiteTextProcessing  || "Validation processing",
            }
        } else if (data.isError) {
            result = {
                state: STEP_STATE.ERROR,
                content: data.params.prerequisiteTextError  || "Validation failed",
                error: {
                    text: data?.error,
                    // action: data.refetch
                }
            }
        } else {
            result = {
                state: STEP_STATE.PENDING,
                content: data.params.prerequisiteTextWaiting  || "Validate transaction",
            }
        }
    }

    result.icon = ICONS.TICKET
    result.iconPadding = iconPadding

    return result
}

const stepTransaction = (state, data) => {
    console.log("BIX :: TRANSACTION :: step state", state, data)

    const iconPadding = "p-[7px]"
    let result = {}

    if (!data.transaction_isReady) {
        result = {
            state: STEP_STATE.PENDING,
            content: "Send transaction",
        }
    } else {
        if (state.isFinished) {
            result = {
                state: STEP_STATE.SUCCESS,
                content: "Transaction confirmed",
            }
        } else if (data.isFetching || data.isLoading) {
            result = {
                state: STEP_STATE.PROCESSING,
                content: "Sending transaction",
            }
        } else if (data.isError) {
            result = {
                state: STEP_STATE.ERROR,
                content: `Error on sending transaction`,
                error: {
                    text: data?.error,
                    // action: data.refetch
                }
            }
        } else {
            result = {
                state: STEP_STATE.PENDING,
                content: "Send transaction",
            }
        }
    }

    result.icon = ICONS.ROCKET
    result.iconPadding = iconPadding

    return result
}

export function StepsState(step, state, data) {
    switch (step) {
        case STEPS.NETWORK: {
            return stepNetwork(state, data)
        }
        case STEPS.LIQUIDITY: {
            return stepLiquidity(state, data)
        }
        case STEPS.ALLOWANCE: {
            return stepAllowance(state, data)
        }
        case STEPS.PREREQUISITE: {
            return stepPrerequisite(state, data)
        }
        case STEPS.TRANSACTION: {
            return stepTransaction(state, data)
        }
    }
}
