const {PremiumItemsParamENUM} = require("./enum/store");
const {PhaseId} = require("./phases");
const {TENANT} = require("../../src/lib/tenantHelper");

const MIN_DIVISIBLE = 50 //50
const MIN_ALLOCATION = 100 //100

function roundAmount(amount) {
    return Math.floor(amount / MIN_DIVISIBLE) * MIN_DIVISIBLE;
}

function getUserAllocationMax(account, offer, allocationOffer, upgradeIncreasedUsed) {
    let allocationUser_base, allocationUser_max, allocationUser_min
    switch(account.tenantId) {
        case TENANT.basedVC: {
            allocationUser_base = account.multi * offer.alloMax
            // console.log("allocationUser_max - tylek", allocationUser_base)
            allocationUser_min = offer.alloMin
            break;
        }
        case TENANT.NeoTokyo: {
            allocationUser_base = account.multi * allocationOffer?.alloTotal + account.allocationBonus
            if(allocationUser_base < MIN_ALLOCATION) allocationUser_base = MIN_ALLOCATION
            allocationUser_min = MIN_ALLOCATION
            break;
        }
    }
    allocationUser_max = getUserAllocationBaseWithIncreased(allocationUser_base, upgradeIncreasedUsed)

    return {
        allocationUser_base,
        allocationUser_max,
        allocationUser_min
    }
}

function getUserAllocationBaseWithIncreased(allocationUser_max_base, upgradeIncreasedUsed = 0) {
    const increasedAllocation = upgradeIncreasedUsed * PremiumItemsParamENUM.Increased
    return allocationUser_max_base + increasedAllocation
}

function getUserAllocationGuaranteed(guaranteedUsed) {
    if (!!guaranteedUsed && !guaranteedUsed?.isExpired) {
        return {
            left: guaranteedUsed.alloMax - guaranteedUsed.alloUsed,
            total: guaranteedUsed.alloMax
        }
    } else {
        return {
            left: 0,
            total: 0,
        }
    }
}

function getAllocationLeft(allocationOffer_left, allocationUser_left) {
    return allocationOffer_left < allocationUser_left ? allocationOffer_left : allocationUser_left
}


function allocationParseUnlimited(params) {
    const {allocationOffer_left} = params
    params.output.allocationUser_left = allocationOffer_left
    return params
}

function allocationParseFCFS(params) {
    const {allocationOffer_left, allocationUser_invested, output} = params
    const {allocationUser_guaranteed, allocationUser_max, allocationUser_min} = output

    let allocationUser_left
    if (allocationUser_guaranteed.total > 0 && allocationUser_guaranteed.left>=allocationUser_min) {
        allocationUser_left = allocationUser_guaranteed.left
    } else {
        allocationUser_left = getAllocationLeft(allocationOffer_left, (allocationUser_max - allocationUser_invested))
    }

    params.output.allocationUser_left = allocationUser_left
    return params
}

function allocationPhaseAdjust(params) {
    const {offerPhaseCurrent} = params

  if (
        offerPhaseCurrent.phase === PhaseId.Open ||
        offerPhaseCurrent.phase === PhaseId.Unlimited
    ) {
        return allocationParseUnlimited(params)
    } else {
        return allocationParseFCFS(params)
    }
}

function allocationUserBuild(params) {
    const {
        allocationUser_base,
        allocationUser_max,
        allocationUser_min
    } = getUserAllocationMax(params.account, params.offer, params.allocationOffer, params.upgradesUse?.increasedUsed?.amount || 0)
    params.output.allocationUser_guaranteed = getUserAllocationGuaranteed(params.upgradesUse?.guaranteedUsed)
    params.output.allocationUser_base = allocationUser_base
    params.output.allocationUser_max = allocationUser_max
    params.output.allocationUser_min = allocationUser_min
    return allocationPhaseAdjust(params)
}


function userInvestmentState(account, offer, offerPhaseCurrent, upgradesUse, allocationUser_invested = 0, allocationOffer) {
    const allocationOfferGuaranteed_left = allocationOffer?.alloGuaranteed || 0
    const allocationOffer_left = allocationOffer?.alloTotal - (allocationOffer?.alloFilled || 0) - (allocationOffer?.alloRes || 0) - (allocationOffer?.alloGuaranteed || 0)
    console.log("allocationOffer_left",
        allocationOffer_left,
        allocationOffer?.alloTotal,
        allocationOffer )
    let build = {
        account,
        offer,
        offerPhaseCurrent,
        upgradesUse,
        allocationUser_invested,
        allocationOffer,
        allocationOffer_left,
        allocationOfferGuaranteed_left,
        output: {}
    }

    const allocationState = allocationUserBuild(build)

    const {
        allocationUser_max,
        allocationUser_min,
        allocationUser_left,
        allocationUser_guaranteed
    } = allocationState.output


    const allocationUser_left_rounded = roundAmount(allocationUser_left);
    const allocationUser_max_rounded = roundAmount(allocationUser_max);
    const allocationUser_guaranteed_rounded = roundAmount(allocationUser_guaranteed.left);

    console.log("QUELCO - summary", {
        allocationUser_min,
        allocationUser_max: allocationUser_max_rounded < 0 ? 0 : allocationUser_max_rounded,
        allocationUser_left: allocationUser_left_rounded < 0 ? 0 : allocationUser_left_rounded,
        allocationUser_guaranteed: allocationUser_guaranteed_rounded < 0 ? 0 : allocationUser_guaranteed_rounded,
        allocationUser_max_raw: allocationUser_max,
        allocationUser_left_raw: allocationUser_left,
        allocationUser_guaranteed_raw: allocationUser_guaranteed,
        allocationUser_invested,
        allocationOffer_left,
        offer_isProcessing: allocationOffer_left - 50 <= 0 && (allocationOffer?.alloTotal - allocationOffer?.alloFilled + 50 > 0),
        offer_isSettled:    allocationOffer_left - 50 <= 0 && (allocationOffer?.alloTotal - allocationOffer?.alloFilled - 50 <= 0)
    })

    return {
        allocationUser_min,
        allocationUser_max: allocationUser_max_rounded < 0 ? 0 : allocationUser_max_rounded,
        allocationUser_left: allocationUser_left_rounded < 0 ? 0 : allocationUser_left_rounded,
        allocationUser_guaranteed: allocationUser_guaranteed_rounded < 0 ? 0 : allocationUser_guaranteed_rounded,
        allocationUser_invested,
        allocationOffer_left,
        offer_isProcessing: allocationOffer_left - 50 <= 0 && (allocationOffer?.alloTotal - allocationOffer?.alloFilled + 50 > 0),
        offer_isSettled:    allocationOffer_left - 50 <= 0 && (allocationOffer?.alloTotal - allocationOffer?.alloFilled - 50 <= 0)
    }
}


function tooltipInvestState(offer, allocationData, investmentAmount) {
    if (allocationData.allocationUser_left === 0) {
        return {
            allocation: false,
            message: `Maximum allocation filled`
        }
    } else if (!allocationData.allocationUser_invested && investmentAmount < allocationData.allocationUser_min) {
        return {
            allocation: false,
            message: `Minimum investment: $${allocationData.allocationUser_min.toLocaleString()}`
        }
    } else if (investmentAmount % MIN_DIVISIBLE > 0 || investmentAmount <= 0) {
        return {
            allocation: false,
            message: `Allocation has to be divisible by $${MIN_DIVISIBLE}`
        }
    } else if (investmentAmount > allocationData.allocationUser_left) {
        return {
            allocation: false,
            message: `Maximum investment: $${allocationData.allocationUser_left.toLocaleString()}`
        }
    } else if (investmentAmount <= allocationData.allocationUser_left) {
        return {
            allocation: true,
            message: `Maximum investment: $${(allocationData.allocationUser_left).toLocaleString()}`
        }
    } else {
        return {
            allocation: true,
            message: `Maximum investment: $${allocationData.allocationUser_left.toLocaleString()}`
        }
    }
}


function buttonInvestIsDisabled(allocationOffer, offerPhaseCurrent, investmentAmount, isAllocationOk, allocationData, isStakeLock) {
    return allocationOffer?.isPaused ||
        offerPhaseCurrent?.controlsDisabled ||
        isStakeLock ||
        !investmentAmount ||
        !isAllocationOk ||
        ((allocationData.offer_isProcessing || allocationData.offer_isSettled) && !(allocationData.allocationUser_left > 0))
}

function buttonInvestText(allocationOffer, allocationData, defaultText) {
    if (allocationOffer?.isPaused) return "Investment Paused"
    else if (allocationOffer?.isSettled) return "Filled"
    else if (allocationData.offer_isSettled) return "Filled"
    else return defaultText
}

function buttonInvestState(allocationOffer, offerPhaseCurrent, investmentAmount, isAllocationOk, allocationData, isStakeLock) {
    return {
        text: buttonInvestText(allocationOffer, allocationData, offerPhaseCurrent.button),
        isDisabled: buttonInvestIsDisabled(allocationOffer, offerPhaseCurrent, investmentAmount, isAllocationOk, allocationData, isStakeLock)
    }
}


module.exports = {MIN_DIVISIBLE, userInvestmentState, tooltipInvestState, buttonInvestState, getUserAllocationMax, roundAmount}
