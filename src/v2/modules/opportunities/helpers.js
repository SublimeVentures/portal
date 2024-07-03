export const PhaseId = Object.freeze({
    Vote: -1,
    Pending: 0,
    Open: 1,
    FCFS: 2,
    Unlimited: 3,
    Closed: 4,
});

export const OfferStatus = Object.freeze({
    PENDING: "pending",
    CLOSED: "closed",
    IN_PROGRESS: "inprogress",
});

export const PhaseToStatusMap = Object.freeze({
    [PhaseId.Vote]: OfferStatus.IN_PROGRESS,
    [PhaseId.Pending]: OfferStatus.PENDING,
    [PhaseId.Open]: OfferStatus.IN_PROGRESS,
    [PhaseId.FCFS]: OfferStatus.IN_PROGRESS,
    [PhaseId.Unlimited]: OfferStatus.IN_PROGRESS,
    [PhaseId.Closed]: OfferStatus.CLOSED,
});

export const OfferDateText = Object.freeze({
    [OfferStatus.PENDING]: "Deal starts:",
    [OfferStatus.IN_PROGRESS]: "Deal ends:",
    [OfferStatus.CLOSED]: "Deal ended:",
});

export const BadgeVariants = Object.freeze({
    [OfferStatus.PENDING]: "success",
    [OfferStatus.IN_PROGRESS]: "warning",
    [OfferStatus.CLOSED]: "default",
});

export const getStatus = (phase) => PhaseToStatusMap[phase.phase] || OfferStatus.IN_PROGRESS;

export const dateFormats = {
    lll: {
      year: 'numeric', month: 'short', day: 'numeric',
    },
    LL: {
      year: 'numeric', month: 'long', day: 'numeric'
    }
};

export const formatDate = (timestamp, formatKey) => {
    const date = new Date(timestamp * 1000);
    const options = dateFormats[formatKey];

    return new Intl.DateTimeFormat('en-US', options).format(date);
};
