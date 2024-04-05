const calculateEndRounding = (progress) => {
    const minProgress = 97;
    const maxProgress = 100;
    const minRadius = 0;
    const maxRadius = 12;

    if (progress <= minProgress) return minRadius;
    if (progress > maxProgress) return maxRadius;

    const progressRatio = (progress - minProgress) / (maxProgress - minProgress);
    return minRadius + progressRatio * (maxRadius - minRadius);
};

export default function useOfferDetailsProgress(allocations, isSoldOut) {
    const amt_filled = Math.max(allocations?.alloFilled ?? 0, 0);
    const amt_res = Math.max(allocations?.alloRes ?? 0, 0);
    const amt_guaranteed = Math.max(allocations?.alloGuaranteed ?? 0, 0);
    const amt_total = Math.max(allocations?.alloTotal ?? 0, 0);

    const base_percentage_raw = (amt_filled / amt_total) * 100;
    const res_percentage_raw = (amt_res / amt_total) * 100;
    const guaranteed_percentage_raw = (amt_guaranteed / amt_total) * 100;
        
    const filled_base_percentage = Math.min(base_percentage_raw, 100);
    const isFullfield = isSoldOut || filled_base_percentage >= 100;
    const isSettled = allocations?.isSettled ?? false;

    const remaining_for_res = 100 - filled_base_percentage;
    const res_adjusted_percentage = Math.min(res_percentage_raw, remaining_for_res);

    const remaining_for_guaranteed = remaining_for_res - res_adjusted_percentage;
    const guaranteed_adjusted_percentage = Math.min(guaranteed_percentage_raw, remaining_for_guaranteed);

    const base_percentage = (isFullfield || isSettled) ? 100 : Math.round(filled_base_percentage);
    const res_percentage = Math.round(res_adjusted_percentage);
    const guaranteed_percentage = Math.round(guaranteed_adjusted_percentage);

    const base_rounding = calculateEndRounding(base_percentage);
    const res_rounding = calculateEndRounding(base_percentage + res_percentage);
    const guaranteed_rounding = calculateEndRounding(base_percentage + res_percentage + guaranteed_percentage);

    return {
        base_percentage,
        base_rounding,
        res_percentage,
        res_rounding,
        guaranteed_percentage,
        guaranteed_rounding,
    }
}
