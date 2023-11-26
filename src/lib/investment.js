const {ACLs} = require("@/lib/authHelpers");
const {PremiumItemsParamENUM} = require("@/lib/enum/store");
const {PhaseId} = require("@/lib/phases");

function getPreTax(amount, offer) {
    return amount / (100 - offer.tax) * 100
}

function getAllocationBaseWithUpgrades(allocationUser_max_base, upgradesUse) {
    const increasedAllocation = !!upgradesUse?.increasedUsed ? upgradesUse.increasedUsed.amount * PremiumItemsParamENUM.Increased : 0
    return allocationUser_max_base + increasedAllocation
}

function getAllocationLeft(offer, allocationOffer_left, allocationUser_left) {
    return allocationOffer_left < allocationUser_left ? allocationOffer_left : allocationUser_left
}

function allocationParseCapped(params) {
    const {
        account,
        offerPhaseCurrent,
        upgradesUse,
        offer,
        output,
        allocationUser_invested,
        allocationOffer_left
    } = params
    let allocationUser_max
    if (
        account.ACL === ACLs.Whale ||
        offerPhaseCurrent.phase === PhaseId.Open ||
        offerPhaseCurrent.phase === PhaseId.Unlimited
    ) {
        allocationUser_max = getAllocationBaseWithUpgrades(offer.alloMax, upgradesUse)
    } else {
        allocationUser_max = output.allocationUser_max_base_withUpgrade_raw
    }
    const allocationUser_left_raw = allocationUser_max - allocationUser_invested

    params.output.allocationUser_max = allocationUser_max
    params.output.allocationUser_left = getAllocationLeft(offer, allocationOffer_left, allocationUser_left_raw > 0 ? allocationUser_left_raw : 0)
    params.output.canInvestMore = params.output.allocationUser_left > 0

    return params
}

function allocationParseUnlimited(params) {
    const {offer, allocationOffer_left} = params

    params.output.allocationUser_max = getPreTax(offer.alloTotal, offer)
    params.output.allocationUser_left = allocationOffer_left
    params.output.canInvestMore = allocationOffer_left > 0

    return params
}

function allocationParseFCFS(params) {
    const {offer, allocationOffer_left, allocationUser_invested, output} = params
    const allocationUser_left_raw = output.allocationUser_max_base_withUpgrade_raw - allocationUser_invested

    params.output.allocationUser_max = output.allocationUser_max_base_withUpgrade_raw
    params.output.allocationUser_left = getAllocationLeft(offer, allocationOffer_left, allocationUser_left_raw)
    params.output.canInvestMore = params.output.allocationUser_left > 0

    return params
}

function allocationParsePhased(params) {
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

function allocationBased(params) {
    const {account, offer, upgradesUse} = params
    const allocationUser_max_base = account.multi * offer.alloMin
    const allocationUser_max = getAllocationBaseWithUpgrades(allocationUser_max_base, upgradesUse)
    params.output.allocationUser_max_base_raw = allocationUser_max_base
    params.output.allocationUser_max_base_withUpgrade_raw = allocationUser_max
    params.output.allocationUser_min = offer.alloMin
    return allocationParsePhased(params)
}

function allocationNeoTokyo(params) {
    const {account, offer, upgradesUse} = params
    const allocationUser_max_base = account.multi * offer.alloTotal + account.allocationBonus
    const allocationUser_max = getAllocationBaseWithUpgrades(allocationUser_max_base, upgradesUse)
    params.output.allocationUser_max_base_raw = allocationUser_max_base
    params.output.allocationUser_max_base_withUpgrade_raw = allocationUser_max
    // params.output.allocationUser_min = 100
    params.output.allocationUser_min = 10 //todo:
    return allocationParsePhased(params)
}

function allocationUserBuild(params) {
    const {account} = params
    if (account.ACL === ACLs.NeoTokyo || account.ACL === ACLs.Admin) { //todo: clean for admin
        return allocationNeoTokyo(params)
    } else {
        return allocationBased(params)
    }
}


function userInvestmentState(account, offer, offerPhaseCurrent, upgradesUse, allocationUser = 0, allocationOffer) {

    const allocationOffer_left = offer.alloTotal - (allocationOffer?.alloFilled ? allocationOffer.alloFilled : 0) - (allocationOffer?.alloRes ? allocationOffer.alloRes : 0)
    const allocationUser_invested = allocationUser / (100 - offer.tax) * 100

    let build = {
        account,
        offer,
        offerPhaseCurrent,
        upgradesUse,
        allocationUser,
        allocationUser_invested,
        allocationOffer,
        allocationOffer_left: allocationOffer_left > 0 ? getPreTax(allocationOffer_left, offer) : 0,
        output: {}
    }

    const allocationState = allocationUserBuild(build)

    const {
        allocationUser_max,
        allocationUser_min,
        allocationUser_left,
        canInvestMore,
    } = allocationState.output

    const divisibleBy = allocationUser_invested > 0 ? 50 : 100
    const allocationUser_left_final = Math.floor(allocationUser_left / divisibleBy) * divisibleBy;
    const allocationUser_guaranteed = (upgradesUse?.guaranteedUsed && !upgradesUse?.guaranteedUsed?.isExpired ? upgradesUse.guaranteedUsed.alloMax - upgradesUse.guaranteedUsed.alloUsed : 0) / (100 - offer.tax) * 100

    return {
        canInvestMore,
        allocationUser_max,
        allocationUser_min,
        allocationUser_left: allocationUser_left_final < 0 ? 0 : allocationUser_left_final,
        allocationUser_invested,
        allocationUser_guaranteed,
        allocationOffer_left,
        offer_isProcessing: allocationOffer_left <= 0 && (offer.alloTotal - allocationOffer?.alloFilled - 100 > 0),
        offer_isSettled: allocationOffer_left <= 100 && offer.alloTotal - allocationOffer?.alloFilled - 100 <= 0
    }
}


function tooltipInvestState(offer, allocationData, investmentAmount) {
    if(allocationData.allocationUser_guaranteed > 0) {
        if (investmentAmount > allocationData.allocationUser_left + allocationData.allocationUser_guaranteed) {
            return {
                allocation: false,
                message: `Maximum investment: $${
                    (
                        (allocationData.allocationUser_left > allocationData.allocationUser_guaranteed) ? 
                        allocationData.allocationUser_left : 
                        allocationData.allocationUser_guaranteed
                    ).toLocaleString()}`
            }
        }
        else if (!allocationData.allocationUser_invested && investmentAmount < allocationData.allocationUser_min) {
            return {
                allocation: false,
                message: `Minimum investment: $${allocationData.allocationUser_min.toLocaleString()}`
            }
        }
        else if(investmentAmount % (allocationData.allocationUser_invested > 0 ? 50 : 100) > 0 || investmentAmount <= 0) {
            return {
                allocation: false,
                message: `Allocation has to be divisible by $${allocationData.allocationUser_invested > 0 ? 50 : 100}`
            }
        }
        else if (investmentAmount <= allocationData.allocationUser_left + allocationData.allocationUser_guaranteed) {
            return {
                allocation: true,
                message: `Maximum investment: $${
                    (
                        allocationData.allocationUser_left > allocationData.allocationUser_guaranteed ? 
                        allocationData.allocationUser_left : allocationData.allocationUser_guaranteed
                    ).toLocaleString()
                }`
            }
        }
        else {
            return {
                allocation: true,
                message: `Maximum investment: $${allocationData.allocationUser_left.toLocaleString()}`
            }
        }
    } else {
        if (allocationData.allocationUser_left === 0) {
            return {
                allocation: false,
                message:`Maximum allocation filled`
            }
        }
        else if (!allocationData.allocationUser_invested && investmentAmount < allocationData.allocationUser_min) {
            return {
                allocation: false,
                message:`Minimum investment: $${allocationData.allocationUser_min.toLocaleString()}`
            }
        }
        else if(investmentAmount % (allocationData.allocationUser_invested > 0 ? 10 : 10) > 0 || investmentAmount <= 0) {
            return {
                allocation: false,
                message:`Allocation has to be divisible by $${allocationData.allocationUser_invested > 0 ? 10 : 10}`
            }
        }
        // else if(investmentAmount % (allocationData.allocationUser_invested > 0 ? 50 : 100) > 0 || investmentAmount <= 0) { //todo: change
        //     return {
        //         allocation: false,
        //         message:`Allocation has to be divisible by $${allocationData.allocationUser_invested > 0 ? 50 : 100}`
        //     }
        // }
        else if (investmentAmount > allocationData.allocationUser_left) {
            return {
                allocation: false,
                message: `Maximum investment: $${allocationData.allocationUser_left.toLocaleString()}`
            }
        }
        else if (investmentAmount <= allocationData.allocationUser_left) {
            return {
                allocation: true,
                message: `Maximum investment: $${(allocationData.allocationUser_left).toLocaleString()}`
            }
        }
        else {
            return {
                allocation: true,
                message: `Maximum investment: $${allocationData.allocationUser_left.toLocaleString()}`
            }
        }
    }
}


function buttonInvestIsDisabled(offer, offerPhaseCurrent, investmentAmount, isAllocationOk, allocationData, ntStakeGuard) {
    return offer.isPaused ||
        offerPhaseCurrent?.controlsDisabled ||
        ntStakeGuard ||
        !investmentAmount ||
        !isAllocationOk ||
        (
            allocationData.allocationUser_guaranteed ?
                (
                    allocationData.offer_isProcessing && allocationData.allocationUser_guaranteed === 0 ||
                    allocationData.offer_isSettled && allocationData.allocationUser_guaranteed === 0
                )
                : (
                    allocationData.offer_isProcessing ||
                    allocationData.offer_isSettled
                )
        )
}

function buttonInvestText(offer, allocationData, defaultText) {
    if (offer.isPaused) return "Investment Paused"
    else if (offer.isSettled) return "Filled"
    else if (allocationData.allocationUser_guaranteed > 0) return defaultText
    else if (allocationData.offer_isSettled) return "Filled"
    else if (allocationData.offer_isProcessing) return "Processing..."
    else return defaultText
}

function buttonInvestState(offer, offerPhaseCurrent, investmentAmount, isAllocationOk, allocationData, ntStakeGuard, defaultText) {
    return {
        text: buttonInvestText(offer, allocationData, defaultText),
        isDisabled: buttonInvestIsDisabled(offer, offerPhaseCurrent, investmentAmount, isAllocationOk, allocationData, ntStakeGuard)
    }
}



module.exports = {userInvestmentState, tooltipInvestState, buttonInvestState}

//todo: tooltip data


// allocationUser_invested                          [PRE-TAX]
// allocationUser_max_base_raw                      [PRE-TAX]
// allocationUser_max_base_withUpgrade_raw          [PRE-TAX]
// allocationOffer_left                             [PRE-TAX]
// allocationUser_left                              [PRE-TAX]
// allocationUser_min                               [PRE-TAX]

//  allocationUser_max                              [PRE-TAX]
//  offer.alloMax                                   [PRE-TAX]

//  offer.alloTotal                                 [POST-TAX]
