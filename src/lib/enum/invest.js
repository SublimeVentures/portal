const BookingErrorsENUM = {
    BadCurrency: "BAD_CURRENCY",
    Overallocated: "OVERALLOCATED",
    AmountTooLow: "NOT_ENOUGH",
    IsPaused: "IS_PAUSED",
    NotOpen: "NOT_OPEN",
    BAD_SIGNATURE: "SIGNATURE_NOT_VALID",

    VerificationFailed: "VERIFICATION_FAILED",
    AllocationTooHigh: "ALLOCATION_TOO_HIGH",
    ProcessingError: "PROCESSING_ERROR",
    Open: "OPEN",
};

module.exports = { BookingErrorsENUM };
