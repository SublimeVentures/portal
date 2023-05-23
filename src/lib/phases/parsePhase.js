const moment = require( 'moment' );

function parsePhase (ACL, offer, raised) {
    if(ACL===0) {
        return parseWhale(offer, raised)
    } else if(!offer.isPhased) {
        return parseRegular(offer)
    } else {
        return parsePhased(offer)

    }
}

function parseWhale(offer, raised) {
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

function parseMaxAllocation (ACL, amt, offer, phase, allocationLeft) {
    if(ACL === 0) {
        return offer.alloMax < allocationLeft ? offer.alloMax : allocationLeft
    } else {
        const partnerAllocation = offer.alloMax * amt < allocationLeft ? offer.alloMax * amt : allocationLeft
        if(offer.isPhased) {
            if(phase<2) return partnerAllocation
            else return allocationLeft
        } else {
            return partnerAllocation
        }
    }
}

module.exports = { parsePhase, parseMaxAllocation }
