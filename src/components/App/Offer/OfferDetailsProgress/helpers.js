export const calculateFilledPercentage = (totalBaseRes, totalAdjusted) => {
    const filledData = (totalBaseRes / totalAdjusted) * 100;
    return (filledData / 100) * totalAdjusted;
};

export const calculateGuaranteedPercentage = (guaranteed, totalAdjusted) => (guaranteed / totalAdjusted) * 100;

export const calculateProgressMetrics = (base, res, guaranteed) => {
    const totalBaseRes = base + res;
    const totalAdjusted = totalBaseRes + guaranteed;
    let percentageFilled = 0;

    if (totalAdjusted <= 100) {
        percentageFilled = calculateFilledPercentage(totalBaseRes, totalAdjusted);
    } else {
        percentageFilled = 100 - guaranteed;
    }

    return {
        offset: Math.round(percentageFilled) || 0,
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
