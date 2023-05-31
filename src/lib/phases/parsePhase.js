const moment = require( 'moment' );

function parsePhase (ACL, offer) {
    let state
    if(ACL===0) {
        state=  parseWhale(offer)
    } else if(!offer.isPhased) {
        state= parseRegular(offer)
    } else {
        state= parsePhased(offer)
    }

    return {
        ...state,
        currentPhase: state.phase[state.active],
        nextPhase: state.isLast ? state.phase[state.active] : state.phase[state.active + 1],
        isClosed: !!state.phase && state.phase.length-1 === state.active || offer.isSettled
    }
}

function parseWhale(offer) {
    const phase = [
        {step: 'Pending', copy: "Open Soon", icon: "wait", isDisabled: true, start: 0},
        {step: 'Open', copy: "Invest", icon: "invest", start: offer.d_open},
        {step: 'Closed', copy: "Closed", icon: "closed", isDisabled: true, start: offer.d_close},
    ]
    const now = moment().unix()
    let active
    for(let i=0; i<phase.length; i++) {
        if(now > phase[i].start) active = i
    }

    return {phase: phase, active: active, isLast: phase.length-1 === active}
}

function parsePhased(offer) {
    const phase = [
        {step: 'Pending', action: "Open Soon", icon: "wait", isDisabled: true, start: 0},
        {step: 'FCFS', action: "Invest", icon: "invest", start: offer.d_open},
        {step: 'Unlimited', action: "Invest", icon: "invest", start: offer.d_open + 86400},//24h
        {step: 'Closed', action: "Closed", icon: "closed", isDisabled: true, start: offer.d_close},
    ]
    const now = moment().unix()
    let active
    for(let i=0; i<phase.length; i++) {
        if(now > phase[i].start) active = i
    }
    return {phase: phase, active: active, isLast: phase.length-1 === active}
}

function parseRegular(offer) {
    const phase = [
        {step: 'Pending', copy: "Open Soon", icon: "wait", isDisabled: true, start: 0},
        {step: 'Open', copy: "Invest", icon: "invest", start: offer.d_open},
        {step: 'Closed', copy: "Closed", icon: "closed", isDisabled: true, start: offer.d_close},
    ]
    const now = moment().unix()
    let active
    for(let i=0; i<phase.length; i++) {
        if(now > phase[i].start) active = i
    }
    return {phase: phase, active: active, isLast: phase.length-1 === active}
}

function parseMaxAllocation (ACL, multi, offer, phase, allocationLeft) {
    if(ACL === 0) {
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

module.exports = { parsePhase, parseMaxAllocation }
