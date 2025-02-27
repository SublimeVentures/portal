const MYSTERYBOX_CLAIM_ERRORS = {
    Unexpected: "Unexpected error",
    AllocationAssignment: "Allocation assignment error",
    UpgradeAssignment: "Upgrade assignment error",
    UserNoBoxes: "User don't own MysteryBoxes",
    NotEnoughBoxes: "Not enough MysteryBoxes available",
    AssignBox: "Couldn't assign MysteryBox",
    Deduction: "Deduction error",
};

const PremiumItemsENUM = {
    MysteryBox: 0,
    Guaranteed: 1,
    Increased: 2,
};

const PremiumItemsParamENUM = {
    Guaranteed: 5000,
    Increased: 2000,
};

const MYSTERY_TYPES = {
    Allocation: "allocation",
    Upgrade: "upgrade",
    Discount: "discount",
    NFT: "NFT",
};

module.exports = {
    MYSTERYBOX_CLAIM_ERRORS,
    PremiumItemsENUM,
    PremiumItemsParamENUM,
    MYSTERY_TYPES,
};
