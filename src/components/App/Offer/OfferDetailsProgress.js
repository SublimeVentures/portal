import { useEffect, useRef } from "react";
import VanillaTilt from "vanilla-tilt";
import { Tooltiper } from "@/components/Tooltip";
import { isBased } from "@/lib/utils";
import { cn } from "@/lib/cn";

// Calculate percentag filled for adjusted below threshold
const calculateFilledPercentage = (totalBaseRes, totalAdjusted) => {
    const filledData = (totalBaseRes / totalAdjusted) * 100;
    return (filledData / 100) * totalAdjusted;
};

// Calculate percentage guaranteed filled for adjusted below threshold
const calculateGuaranteedPercentage = (guaranteed, totalAdjusted) => (guaranteed / totalAdjusted) * 100;

// Adjusts the guaranteed filled percentage based on the total filled percentage.
function adjustGuaranteedFilled(percentageFilled, percentageGuaranteedFilled) {
    if (percentageFilled + percentageGuaranteedFilled > 100) {
        const excess = percentageFilled + percentageGuaranteedFilled - 100;
        percentageGuaranteedFilled -= excess;
    }

    return percentageGuaranteedFilled;
}

// Calculates the progress metrics for the offer details
function calculateProgressMetrics(base, res, guaranteed) {
    const totalBaseRes = base + res;
    const totalAdjusted = totalBaseRes + guaranteed;

    let percentageFilled = 0,
        percentageGuaranteed = 0;

    if (totalAdjusted <= 100) {
        percentageFilled = calculateFilledPercentage(totalBaseRes, totalAdjusted);
        percentageGuaranteed = calculateGuaranteedPercentage(guaranteed, totalAdjusted);
    } else {
        percentageFilled = (totalBaseRes / totalAdjusted) * 100;
        percentageGuaranteed = (guaranteed / totalBaseRes) * 100;
    }

    percentageGuaranteed = adjustGuaranteedFilled(percentageFilled, percentageGuaranteed);

    return {
        width: Math.round(percentageGuaranteed) || 0,
        offset: Math.round(percentageFilled) || 0,
    };
}

const defaultProgressColors = {
    baseColor: "#54D77B",
    resColor: "#b92551",
    guaranteedColor: "#f5a400",
};

export default function OfferDetailsProgress({ allocations, isSoldOut, progressColors = defaultProgressColors }) {
    const tilt = useRef(null);

    useEffect(() => {
        VanillaTilt.init(tilt.current, {
            scale: 1.05,
            speed: 1000,
            max: 5,
        });
    }, []);

    const amt_filled = allocations?.alloFilled ? allocations?.alloFilled : 0;
    const amt_res = allocations?.alloRes ? allocations?.alloRes : 0;
    const amt_guaranteed = allocations?.alloGuaranteed ? allocations?.alloGuaranteed : 0;

    const filled_base = Math.round((amt_filled / allocations?.alloTotal) * 100);
    const filled_res = Math.round((amt_res / allocations?.alloTotal) * 100);
    const filled_guaranteed = Math.round((amt_guaranteed / allocations?.alloTotal) * 100);

    const progress = isSoldOut ? 100 : filled_base;

    const { width, offset } = calculateProgressMetrics(filled_base, filled_res, filled_guaranteed);

    return (
        <>
            <div
                className="relative h-[50px] w-full flex flex-row items-center rounded-xl select-none [&:not(:hover)]:overflow-hidden"
                ref={tilt}
            >
                <div className="os-progress-bar absolute rounded-xl overflow-hidden -z-10">
                    <span className="os-progress-bar--meter flex flex-1 rounded-tl-xl rounded-bl-xl"></span>
                    <span
                        className="absolute right-0 top-0 bg-navy h-full rounded-tr-xl rounded-br-xl"
                        style={{ width: `${100 - progress}%` }}
                    ></span>
                </div>

                <Tooltiper
                    text={`Filled base ${filled_base}%`}
                    wrapper={
                        <div
                            className={`w-full h-full z-10 opacity-10 bg-[var(--progress-step-color)] rounded-tl-xl rounded-bl-xl ${filled_base >= 100 ? "rounded-xl" : ""} cursor-pointer hover:opacity-100 hover:border-2 hover:z-40 hover:border-[var(--progress-step-color)] hover:shadow-[0_0_2px_var(--progress-step-color),inset_0_0_2px_var(--progress-step-color),0_0_0px_var(--progress-step-color),0_0_0_var(--progress-step-color),0_0_10px_var(--progress-step-color)]`}
                        ></div>
                    }
                    style={{ width: `${filled_base}%`, "--progress-step-color": progressColors.baseColor }}
                    className="w-full h-full"
                />
                <Tooltiper
                    text={`Filled res ${filled_res}%`}
                    wrapper={
                        <div className="w-full h-full z-20 opacity-10 bg-[var(--progress-step-color)] rounded-r-xl cursor-pointer hover:z-40 hover:opacity-100 hover:border-2 hover:border-[var(--progress-step-color)] hover:shadow-[0_0_2px_var(--progress-step-color),inset_0_0_2px_var(--progress-step-color),0_0_0px_var(--progress-step-color),0_0_0_var(--progress-step-color),0_0_10px_var(--progress-step-color)]"></div>
                    }
                    style={{ width: `${filled_res}%`, "--progress-step-color": progressColors.resColor }}
                    className="w-full h-full"
                />
                <Tooltiper
                    text={`Filled guaranteed ${filled_guaranteed}%`}
                    wrapper={
                        <div className="absolute w-full h-full z-30 opacity-10 bg-[var(--progress-step-color)] rounded-r-xl cursor-pointer hover:z-40 hover:opacity-100 hover:border-2 hover:border-[var(--progress-step-color)] hover:shadow-[0_0_2px_var(--progress-step-color),inset_0_0_2px_var(--progress-step-color),0_0_0px_var(--progress-step-color),0_0_0_var(--progress-step-color),0_0_10px_var(--progress-step-color)]"></div>
                    }
                    style={{
                        width: `${width}%`,
                        left: `${offset}%`,
                        "--progress-step-color": progressColors.guaranteedColor,
                    }}
                    className="absolute w-full h-full"
                />

                <p className="absolute z-50 right-1 mr-1 select-none">Filled {Number(progress).toFixed(0)}%</p>
            </div>
        </>
    );
}
