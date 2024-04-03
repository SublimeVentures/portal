import { useEffect, useRef } from "react";
import VanillaTilt from "vanilla-tilt";
import { calculateProgressMetrics, calculateEndRounding } from "./helpers";
import { Tooltiper } from "@/components/Tooltip";

const defaultProgressColors = {
    baseColor: "#54D77B",
    resColor: "#b92551",
    guaranteedColor: "#f5a400",
};

export default function OfferDetailsProgress({ allocations, isSoldOut, progressColors = defaultProgressColors }) {
    const tilt = useRef(null);

    useEffect(() => VanillaTilt.init(tilt.current, { scale: 1.05, speed: 1000, max: 5 }), []);

    const isSettled = allocations?.isSettled ?? false;
    const amt_filled = allocations?.alloFilled ?? 0;
    const amt_res = allocations?.alloRes ?? 0;
    const amt_guaranteed = allocations?.alloGuaranteed ?? 0;
    const amt_total = allocations?.alloTotal ?? 0;

    const filled_base = Math.min(Math.round((amt_filled / amt_total) * 100), 100)
    const progress = isSoldOut ? 100 : filled_base;
    const isFullfield = isSoldOut || progress >= 100;
    
    const filled_res = isFullfield ? 0 : Math.min(Math.round(amt_res/amt_total * 100), 100)
    const reservedWidth = filled_res > filled_base ? filled_res - filled_base : filled_res

    const filled_guaranteed = Math.min(Math.round((amt_guaranteed / amt_total) * 100), isFullfield ? 0 : Math.max(amt_total - amt_guaranteed, 0));
    const { guaranteedWidth, guaranteedOffset } = calculateProgressMetrics(progress, reservedWidth, filled_guaranteed);

    const filled_base_rounding = calculateEndRounding(progress - reservedWidth - guaranteedWidth);
    const filled_res_rounding = calculateEndRounding(progress + reservedWidth);
    const filled_guaranteed_rounding = calculateEndRounding(guaranteedWidth + guaranteedOffset);

    return (
        <>
        <div>filled_base: {filled_base}</div>
        <div>reservedWidth: {reservedWidth}</div>
        <div>filled_res, filled_base: {filled_res > filled_base}</div>
        <div className="relative h-[50px] w-full flex flex-row items-center rounded-xl select-none" ref={tilt}>
            <div className="os-progress-bar absolute rounded-xl overflow-hidden -z-10">
                <span className="os-progress-bar--meter flex flex-1 rounded-tl-xl rounded-bl-xl"></span>
                <span
                    className="absolute right-0 top-0 bg-navy h-full rounded-tr-xl rounded-br-xl"
                    style={{ width: `${100 - progress}%` }}
                ></span>
            </div>
            <Tooltiper
                text={(isSettled || isFullfield) ? null : `Filled ${progress}%`}
                wrapper={
                    <div
                        className="w-full h-full z-10 opacity-10 bg-[var(--progress-step-color)] rounded-tl-xl rounded-bl-xl cursor-pointer transition-all duration-150 hover:opacity-100 hover:border-2 hover:z-40 hover:border-[var(--progress-step-color)] hover:shadow-[0_0_2px_var(--progress-step-color),inset_0_0_2px_var(--progress-step-color),0_0_0px_var(--progress-step-color),0_0_0_var(--progress-step-color),0_0_10px_var(--progress-step-color)]"
                        style={{
                            borderTopRightRadius: filled_base_rounding,
                            borderBottomRightRadius: filled_base_rounding,
                        }}
                    ></div>
                }
                style={{ width: `${progress}%`, "--progress-step-color": progressColors.baseColor }}
                className="w-full h-full"
            />
            <Tooltiper
                text={`Booked ${reservedWidth}%`}
                wrapper={
                    <div
                        className="w-full h-full z-20 opacity-10 bg-[var(--progress-step-color)] cursor-pointer transition-all duration-150 hover:z-40 hover:opacity-100 hover:border-2 hover:border-[var(--progress-step-color)] hover:shadow-[0_0_2px_var(--progress-step-color),inset_0_0_2px_var(--progress-step-color),0_0_0px_var(--progress-step-color),0_0_0_var(--progress-step-color),0_0_10px_var(--progress-step-color)]"
                        style={{
                            borderTopLeftRadius: progress === 0 ? '12px' : '0',
                            borderBottomLeftRadius: progress === 0 ? '12px' : '0',
                            borderTopRightRadius: filled_res_rounding,
                            borderBottomRightRadius: filled_res_rounding,
                        }}
                    ></div>
                }
                style={{ width: `${reservedWidth}%`, "--progress-step-color": progressColors.resColor }}
                className="w-full h-full"
            />
            <Tooltiper
                text={`Guaranteed ${filled_guaranteed}%`}
                wrapper={
                    <div
                        className="absolute w-full h-full z-30 opacity-10 bg-[var(--progress-step-color)] cursor-pointer transition-all duration-150 hover:z-40 hover:opacity-100 hover:border-2 hover:border-[var(--progress-step-color)] hover:shadow-[0_0_2px_var(--progress-step-color),inset_0_0_2px_var(--progress-step-color),0_0_0px_var(--progress-step-color),0_0_0_var(--progress-step-color),0_0_10px_var(--progress-step-color)]"
                        style={{
                            borderTopLeftRadius: progress + reservedWidth === 0 ? '12px' : '0',
                            borderBottomLeftRadius: progress + reservedWidth === 0 ? '12px' : '0',
                            borderTopRightRadius: filled_guaranteed_rounding,
                            borderBottomRightRadius: filled_guaranteed_rounding,
                        }}
                    ></div>
                }
                style={{
                    width: `${guaranteedWidth}%`,
                    left: `${guaranteedOffset}%`,
                    "--progress-step-color": progressColors.guaranteedColor,
                }}
                className="absolute w-full h-full"
            />

            <p className="absolute z-50 right-1 mr-1 select-none pointer-events-none">
                Filled {Number(progress).toFixed(0)}%
            </p>
        </div>
        </>
    );
}
