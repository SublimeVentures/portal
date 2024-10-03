import { PremiumItemsENUM, PremiumItemsParamENUM } from "@/lib/enum/store";
import { PhaseId } from "@/v2/lib/phases";

export const getUpgradesData = (id, allocationData, length) => {
    const maximumGuaranteedBooking = Math.min(allocationData.allocationUser_left, PremiumItemsParamENUM.Guaranteed);

    const upgradesData = {
        [PremiumItemsENUM.Guaranteed]: {
            name: "Guaranteed",
            description: `Books $${maximumGuaranteedBooking} allocation for first ${(length / 3600).toFixed(0)}h of the investment.`,
            phases: [PhaseId.Whale, PhaseId.Pending],
            bg: "/img/upgrade-dialog-premium.png",
        },
        [PremiumItemsENUM.Increased]: {
            name: "Increased",
            description: `Increase your maximum allocation by $${PremiumItemsParamENUM.Increased}.`,
            phases: [PhaseId.Whale, PhaseId.Pending, PhaseId.FCFS],
            bg: "/img/bg/banner/default@2.webp",
        },
    };

    return upgradesData[id];
};

export const checkIsUpgradeUsed = (type, upgradesUse) => {
    const mapping = {
        [PremiumItemsENUM.Guaranteed]: upgradesUse?.guaranteedUsed?.amount ?? 0,
        [PremiumItemsENUM.Increased]: upgradesUse?.increasedUsed?.amount ?? 0,
    };

    return { isUsed: mapping[type] > 0, usedCount: mapping[type] };
};
