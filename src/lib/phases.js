const moment = require('moment');
const {ACLs} = require("@/lib/authHelpers");
const {PremiumItemsParamENUM} = require("@/lib/premiumHelper");

const PhaseId = {
    Vote: -1,
    Pending: 0,
    Open: 1,
    FCFS: 2,
    Unlimited: 3,
    Closed: 4,
}

const Phases = {
    Pending: {
        phase: PhaseId.Pending,
        phaseName: "Pending",
        button: "Open Soon",
        controlsDisabled: true,
        startDate: 0
    },
    Open: {
        phase: PhaseId.Open,
        phaseName: "Open",
        button: "Invest",
        controlsDisabled: false,
        startDate: -1
    },
    FCFS: {
        phase: PhaseId.FCFS,
        phaseName: "FCFS",
        button: "Invest",
        controlsDisabled: false,
        startDate: -1
    },
    Unlimited: {
        phase: PhaseId.Unlimited,
        phaseName: "Unlimited",
        button: "Invest",
        controlsDisabled: false,
        startDate: -1
    },
    Closed: {
        phase: PhaseId.Closed,
        phaseName: "Closed",
        button: "Closed",
        controlsDisabled: true,
        startDate: -1
    },
}

function updatePhaseDate(phase, timestamp) {
    phase.startDate = timestamp
    return phase
}

function processPhases(phases) {
    const now = moment().unix()
    let activeId

    for (let i = 0; i < phases.length; i++) {
        if (now > phases[i].startDate) activeId = i
    }


    return {
        phases,
        activeId,
        isLast: phases.length - 1 === activeId
    }
}


function phases(ACL, offer) {
    let data
    if (ACL === ACLs.Whale || !offer.isPhased) {
        data = processPhases([
            Phases.Pending,
            updatePhaseDate(Phases.Open, offer.d_open),
            updatePhaseDate(Phases.Closed, offer.d_close),
        ])
    } else {
        data = processPhases([
            Phases.Pending,
            updatePhaseDate(Phases.FCFS, offer.d_open),
            updatePhaseDate(Phases.Unlimited, offer.d_open + 86400), // start 24h after FCFS
            updatePhaseDate(Phases.Closed, offer.d_close),
        ])
    }

    return {
        isClosed: !!data.phases && data.isLast || offer.isSettled,
        phaseCurrent: data.phases[data.activeId],
        phaseNext: data.isLast ? data.phases[data.activeId] : data.phases[data.activeId + 1],
    }
}


function _parseMaxAllocation(ACL, multi, offer, phaseCurrent, allocationLeft) {
    if (ACL === ACLs.Whale) {
        return offer.alloMax < allocationLeft ? offer.alloMax : allocationLeft
    } else {
        const partnerAllocation = offer.alloMin * multi
        const limits = offer.alloMax && offer.alloMax < partnerAllocation ? offer.alloMax : partnerAllocation
        if (offer.isPhased) {
            if (phaseCurrent < 2) return limits
            else return allocationLeft
        } else {
            return limits
        }
    }
}

function _checkAllocationLeft(ACL, userAllocation, userMaxAllocation, offer) {
    if (ACL === ACLs.Whale) return {status: false, amount: 0}
    if (userAllocation !== undefined) {
        if (userAllocation >= userMaxAllocation * (100 - offer.tax) / 100) return {status: true, amount: 0}
        else return {
            status: false,
            amount: (userMaxAllocation * (100 - offer.tax) / 100 - userAllocation) / ((100 - offer.tax) / 100)
        }
    } else {
        return {status: false, amount: userAllocation}
    }
}


function investWithNoLimits(offer, allocationPoolLeft, allocationUserCurrent, upgradesUse) {
    if (offer.alloMax && offer.alloMax < allocationPoolLeft) { //there is hard cap per user
        const allocationUserMaxAfterIncreasedUpgrade = offer.alloMax + (!!upgradesUse.increasedUsed ? upgradesUse.increasedUsed.amount * PremiumItemsParamENUM.Increased : 0)
        const allocationUserLeft = allocationUserMaxAfterIncreasedUpgrade - allocationUserCurrent
        const allocationUserLeftFinal = allocationPoolLeft < allocationUserLeft ? allocationPoolLeft / (100 - offer.tax) * 100 : allocationUserLeft
        return {
            allocationUserMax: allocationUserMaxAfterIncreasedUpgrade,
            allocationUserLeft: allocationUserLeftFinal,
            canInvestMore: allocationUserLeftFinal > 0,
        }
    } else { //investment without hard cap
        return {
            allocationUserMax: offer.alloTotal,
            allocationUserLeft: allocationPoolLeft / (100 - offer.tax) * 100,
            canInvestMore: allocationPoolLeft > 0,
        }
    }
}

function investWithFCFS(offer, allocationPoolLeft, allocationUserCurrent, upgradesUse, multi) {
    if (offer.alloMax) {
        const userMulti = offer.alloMin * multi
        const allocationUserMax = userMulti < offer.alloMax ? userMulti : offer.alloMax;
        const allocationUserMaxAfterIncreasedUpgrade = allocationUserMax + (!!upgradesUse.increasedUsed ? upgradesUse.increasedUsed.amount * PremiumItemsParamENUM.Increased : 0)
        const allocationUserLeft = allocationUserMaxAfterIncreasedUpgrade - allocationUserCurrent
        const allocationUserLeftFinal = allocationPoolLeft < allocationUserLeft ? allocationPoolLeft / (100 - offer.tax) * 100 : allocationUserLeft

        return {
            allocationUserMax: allocationUserMaxAfterIncreasedUpgrade,
            allocationUserLeft: allocationUserLeftFinal,
            canInvestMore: allocationUserLeftFinal > 0,
        }
    } else {
        const allocationUserMax = offer.alloMin * multi
        const allocationUserMaxAfterIncreasedUpgrade = allocationUserMax + (!!upgradesUse.increasedUsed ? upgradesUse.increasedUsed.amount * PremiumItemsParamENUM.Increased : 0)
        const allocationUserLeft = allocationUserMaxAfterIncreasedUpgrade - allocationUserCurrent
        const allocationUserLeftFinal = allocationPoolLeft < allocationUserLeft ? allocationPoolLeft / (100 - offer.tax) * 100 : allocationUserLeft


        return {
            allocationUserMax: allocationUserMaxAfterIncreasedUpgrade,
            allocationUserLeft: allocationUserLeftFinal,
            canInvestMore: allocationUserLeftFinal > 0,
        }
    }

}

function buildUserAllocations(account, phaseCurrent, upgradesUse, userAllocation, offer, allocationLeftInPool) {
    const {ACL, multi} = account

    if (ACL === ACLs.Whale) {
        return investWithNoLimits(offer, allocationLeftInPool, userAllocation, upgradesUse)
    } else {
        if (phaseCurrent.phase === PhaseId.Open || phaseCurrent.phase === PhaseId.Unlimited) { //unlimited phases
            return investWithNoLimits(offer, allocationLeftInPool, userAllocation, upgradesUse)
        } else { //fcfs
            return investWithFCFS(offer, allocationLeftInPool, userAllocation, upgradesUse, multi)
        }
    }
}

function processAllocations(account, phaseCurrent, upgradesUse, userAllocation, offer, offerAllocationState) {
    userAllocation = userAllocation / (100 - offer.tax) * 100
    const allocationLeftInPool = offer.alloTotal - offerAllocationState?.alloFilled - offerAllocationState?.alloRes
    const allocationUser = buildUserAllocations(account, phaseCurrent, upgradesUse, userAllocation, offer, allocationLeftInPool)
    const divisibleBy = userAllocation > 0 ? 50 : 100
    allocationUser.allocationUserLeft = Math.floor(allocationUser.allocationUserLeft / divisibleBy) * divisibleBy;
    allocationUser.allocationUserLeft = allocationUser.allocationUserLeft < 0 ? 0 : allocationUser.allocationUserLeft
    return {
        ...allocationUser,
        allocationUserGuaranteed: (upgradesUse?.guaranteedUsed && !upgradesUse?.guaranteedUsed?.isExpired ? upgradesUse.guaranteedUsed.alloMax - upgradesUse.guaranteedUsed.alloUsed : 0) / (100 - offer.tax) * 100 ,
        allocationUserCurrent: userAllocation,
        allocationPoolLeft: allocationLeftInPool,
        offerIsProcessing: allocationLeftInPool <= 0 && (offer.alloTotal - offerAllocationState?.alloFilled - 100 > 0),
        offerIsSettled: allocationLeftInPool <= 0 && (offer.alloTotal - offerAllocationState?.alloFilled - 100 <= 0)
    }
}


module.exports = {phases, PhaseId, processAllocations}
