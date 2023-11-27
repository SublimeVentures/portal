const {ACLs} = require("./authHelpers");
const {PremiumItemsParamENUM} = require("./enum/store");
const {PhaseId} = require("./phases");
const {isBased} = require("./utils");

const MIN_DIVISIBLE = 50 //50
const MIN_ALLOCATION = 10 //100

function roundAmount(amount) {
    return Math.floor(amount / MIN_DIVISIBLE) * MIN_DIVISIBLE;
}

function getUserAllocationMax(account, offer, upgradeIncreasedUsed) {
    let allocationUser_base, allocationUser_max, allocationUser_min
    if (isBased && (account.ACL !== ACLs.NeoTokyo || account.ACL !== ACLs.Admin)) { //todo: celanup for admin
        allocationUser_base = account.multi * offer.alloMin
        allocationUser_min = offer.alloMin
    } else {
        allocationUser_base = account.multi * offer.alloTotal + account.allocationBonus
        if(allocationUser_base < MIN_ALLOCATION) allocationUser_base = MIN_ALLOCATION
        allocationUser_min = MIN_ALLOCATION
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
        return guaranteedUsed.alloMax - guaranteedUsed.alloUsed
    } else {
        return 0
    }
}

function getAllocationLeft(allocationOffer_left, allocationUser_left) {
    return allocationOffer_left < allocationUser_left ? allocationOffer_left : allocationUser_left
}

function allocationParseCapped(params) {
    const {
        offer,
        allocationOffer_left
    } = params

    params.output.allocationUser_max = params.output.allocationUser_max <= offer.alloMax ? params.output.allocationUser_max : offer.alloMax
    params.output.allocationUser_left = getAllocationLeft(allocationOffer_left, params.output.allocationUser_max)

    return params
}

function allocationParseUnlimited(params) {
    const {allocationOffer_left} = params
    params.output.allocationUser_left = allocationOffer_left
    return params
}

function allocationParseFCFS(params) {
    const {allocationOffer_left, allocationUser_invested, output} = params
    const {allocationUser_guaranteed, allocationUser_max} = output

    let allocationUser_left
    if (allocationUser_guaranteed > 0) {
        allocationUser_left = allocationUser_guaranteed
    } else {
        allocationUser_left = getAllocationLeft(allocationOffer_left, (allocationUser_max - allocationUser_invested))
    }

    params.output.allocationUser_left = allocationUser_left
    return params
}

function allocationPhaseAdjust(params) {
    const {account, offerPhaseCurrent, offer} = params
    if (offer.alloMax) {
        return allocationParseCapped(params)
    } else if (
        account.ACL === ACLs.Whale ||
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
    } = getUserAllocationMax(params.account, params.offer, params.upgradesUse?.increasedUsed?.amount || 0)
    params.output.allocationUser_guaranteed = getUserAllocationGuaranteed(params.upgradesUse?.guaranteedUsed)
    params.output.allocationUser_base = allocationUser_base
    params.output.allocationUser_max = allocationUser_max
    params.output.allocationUser_min = allocationUser_min
    return allocationPhaseAdjust(params)
}


function userInvestmentState(account, offer, offerPhaseCurrent, upgradesUse, allocationUser_invested = 0, allocationOffer) {
    const allocationOfferGuaranteed_left = allocationOffer?.alloGuaranteed || 0
    const allocationOffer_left = offer.alloTotal - (allocationOffer?.alloFilled || 0) - (allocationOffer?.alloRes || 0) -  - (allocationOffer?.alloGuaranteed || 0)

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
    const allocationUser_guaranteed_rounded = roundAmount(allocationUser_guaranteed);

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
        offer_isProcessing: allocationOffer_left - 50 <= 0 && (offer.alloTotal - allocationOffer?.alloFilled + 50 > 0),
        offer_isSettled:    allocationOffer_left - 50 <= 0 && (offer.alloTotal - allocationOffer?.alloFilled - 50 <= 0)
    })

    return {
        allocationUser_min,
        allocationUser_max: allocationUser_max_rounded < 0 ? 0 : allocationUser_max_rounded,
        allocationUser_left: allocationUser_left_rounded < 0 ? 0 : allocationUser_left_rounded,
        allocationUser_guaranteed: allocationUser_guaranteed_rounded < 0 ? 0 : allocationUser_guaranteed_rounded,
        allocationUser_invested,
        allocationOffer_left,
        offer_isProcessing: allocationOffer_left - 50 <= 0 && (offer.alloTotal - allocationOffer?.alloFilled + 50 > 0),
        offer_isSettled:    allocationOffer_left - 50 <= 0 && (offer.alloTotal - allocationOffer?.alloFilled - 50 <= 0)
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


function buttonInvestIsDisabled(offer, offerPhaseCurrent, investmentAmount, isAllocationOk, allocationData, ntStakeGuard) {
    return offer.isPaused ||
        offerPhaseCurrent?.controlsDisabled ||
        ntStakeGuard ||
        !investmentAmount ||
        !isAllocationOk ||
        ((allocationData.offer_isProcessing || allocationData.offer_isSettled) && !(allocationData.allocationUser_left > 0))
}

function buttonInvestText(offer, allocationData, defaultText) {
    if (offer.isPaused) return "Investment Paused"
    else if (offer.isSettled) return "Filled"
    else if (allocationData.offer_isSettled) return "Filled"
    else return defaultText
}

function buttonInvestState(offer, offerPhaseCurrent, investmentAmount, isAllocationOk, allocationData, ntStakeGuard) {
    return {
        text: buttonInvestText(offer, allocationData, offerPhaseCurrent.button),
        isDisabled: buttonInvestIsDisabled(offer, offerPhaseCurrent, investmentAmount, isAllocationOk, allocationData, ntStakeGuard)
    }
}


module.exports = {userInvestmentState, tooltipInvestState, buttonInvestState, getUserAllocationMax, roundAmount}
