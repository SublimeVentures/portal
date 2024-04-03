export const calculateFilledPercentage = (totalBaseRes, totalAdjusted) => {
    const filledData = (totalBaseRes / totalAdjusted) * 100;
    return (filledData / 100) * totalAdjusted;
};

export const calculateProgressMetrics = (base, res, guaranteed) => {
    const totalBaseRes = base + res;
    const totalAdjusted = totalBaseRes + guaranteed;
    let percentageFilled = 0, percentageGuaranteed = 0;

    if (totalBaseRes >= 100) {
        percentageFilled = 0;
        percentageGuaranteed = 0;
    } else if (totalAdjusted >= 100) {
        const filledGuaranteed = guaranteed - totalBaseRes;
        
        percentageFilled = calculateFilledPercentage(totalBaseRes, totalAdjusted);
        percentageGuaranteed = filledGuaranteed < 0 ? 0 : filledGuaranteed;
    } else {
        percentageGuaranteed = guaranteed;
        percentageFilled = calculateFilledPercentage(totalBaseRes, totalAdjusted);
    }

    return {
        guaranteedWidth: Math.round(percentageGuaranteed) || 0,
        guaranteedOffset: Math.round(percentageFilled) || 0,
    };
};

export const calculateEndRounding = (progress) => {
    const minProgress = 97;
    const maxProgress = 100;
    const minRadius = 0;
    const maxRadius = 12;

    if (progress <= minProgress) return minRadius;
    if (progress > maxProgress) return maxRadius;

    const progressRatio = (progress - minProgress) / (maxProgress - minProgress);
    return minRadius + progressRatio * (maxRadius - minRadius);
};
