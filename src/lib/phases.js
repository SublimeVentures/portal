const moment = require( 'moment' );
const {ACLs} = require("@/lib/authHelpers");

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

    for(let i=0; i<phases.length; i++) {
        if(now > phases[i].startDate) activeId = i
    }


    return {
        phases,
        activeId,
        isLast: phases.length-1 === activeId
    }
}


function phases (ACL, offer) {
    let data
    if(ACL===ACLs.Whale || !offer.isPhased) {
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



function parseMaxAllocation (ACL, multi, offer, phase, allocationLeft) {
    if(ACL === ACLs.Whale) {
        return offer.alloMax < allocationLeft ? offer.alloMax : allocationLeft
    } else {
        const partnerAllocation = offer.alloMin * multi
        const limits = offer.alloMax && offer.alloMax < partnerAllocation ? offer.alloMax : partnerAllocation
        if(offer.isPhased) {
            if(phase<2) return limits
            else return allocationLeft
        } else {
            return limits
        }
    }
}

function checkAllocationLeft (ACL, userAllocation, userMaxAllocation, offer) {
    if(ACL === ACLs.Whale) return {status:false, amount:0}
    if(userAllocation !== undefined) {
        if(userAllocation >= userMaxAllocation * (100-offer.tax)/100) return {status: true, amount:0}
        else return {status:false, amount: (userMaxAllocation * (100-offer.tax)/100 - userAllocation) / ((100-offer.tax)/100)}
    } else {
        return {status:false, amount: userAllocation}
    }
}

module.exports = { phases, PhaseId, parseMaxAllocation, checkAllocationLeft }
