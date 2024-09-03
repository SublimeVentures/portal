export const PhaseId = {
    Pending: 1,
    Whale: 2,
    Raffle: 3,
    Open: 4,
    FCFS: 5,
    UnlimitedSlow: 6,
    Unlimited: 7,
    Closed: 8,
};

export const Phases = {
    [PhaseId.Pending]: {
        phase: PhaseId.Pending,
        phaseName: "Pending",
        button: "Open Soon",
        controlsDisabled: true,
        startDate: 0,
    },
    [PhaseId.Whale]: {
        phase: PhaseId.Whale,
        phaseName: "Whale",
        button: "Open Soon",
        controlsDisabled: true,
        startDate: 0,
    },
    [PhaseId.Raffle]: {
        phase: PhaseId.Raffle,
        phaseName: "Raffle",
        button: "Open Soon",
        controlsDisabled: true,
        startDate: 0,
    },
    [PhaseId.Open]: {
        phase: PhaseId.Open,
        phaseName: "Open",
        button: "Invest",
        controlsDisabled: false,
        startDate: -1,
    },
    [PhaseId.FCFS]: {
        phase: PhaseId.FCFS,
        phaseName: "FCFS",
        button: "Invest",
        controlsDisabled: false,
        startDate: -1,
    },
    [PhaseId.UnlimitedSlow]: {
        phase: PhaseId.UnlimitedSlow,
        phaseName: "Unlimited slow",
        button: "Invest",
        controlsDisabled: false,
        startDate: -1,
    },
    [PhaseId.Unlimited]: {
        phase: PhaseId.Unlimited,
        phaseName: "Unlimited",
        button: "Invest",
        controlsDisabled: false,
        startDate: -1,
    },
    [PhaseId.Closed]: {
        phase: PhaseId.Closed,
        phaseName: "Closed",
        button: "Closed",
        controlsDisabled: true,
        startDate: -1,
    },
};
