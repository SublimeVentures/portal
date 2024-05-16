const { PhaseId, Phases } = require("./../phases");

const usePhaseInvestment = (phases, offerData, now) => {
    const phaseCurrent =
        phases.find((phase) => phase.startDate <= now && (!phase.endDate || now < phase.endDate)) ||
        phases[phases.length - 1];
    const indexCurrent = phases.indexOf(phaseCurrent);
    const phaseNext = phases[indexCurrent + 1] || Phases[PhaseId.Closed];
    const offerClosed = offerData?.isSettled || phaseCurrent.phaseId === PhaseId.Closed;
    return { phaseCurrent, phaseNext, offerClosed };
};

export default usePhaseInvestment;
