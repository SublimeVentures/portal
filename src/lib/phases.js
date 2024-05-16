const PhaseId = {
    Pending: 1,
    Whale: 2,
    Raffle: 3,
    Open: 4,
    FCFS: 5,
    UnlimitedSlow: 6,
    Unlimited: 7,
    Closed: 7,
};

const Phases = {
    [PhaseId.Pending]: {
        phaseName: "Pending",
    },
    [PhaseId.Whale]: {
        phaseName: "Whales",
    },
    [PhaseId.Raffle]: {
        phaseName: "Raffle",
    },
    [PhaseId.Open]: {
        phaseName: "Open",
    },
    [PhaseId.FCFS]: {
        phaseName: "FCFS",
    },
    [PhaseId.UnlimitedSlow]: {
        phaseName: "Unlimited (slowdown)",
    },
    [PhaseId.Unlimited]: {
        phaseName: "Unlimited",
    },
    [PhaseId.Closed]: {
        phaseName: "Closed",
    },
};

module.exports = { PhaseId, Phases };
