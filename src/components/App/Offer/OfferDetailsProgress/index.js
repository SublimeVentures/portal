import { useEffect, useRef } from "react";
import VanillaTilt from "vanilla-tilt";
import { Tooltiper } from "@/components/Tooltip";
import { cn } from "@/lib/cn";
import useOfferDetailsProgress from './useOfferDetailsProgress'

const defaultProgressColors = {
    baseColor: "#54D77B",
    resColor: "#b92551",
    guaranteedColor: "#f5a400",
};

export default function OfferDetailsProgress({ allocations, isSoldOut, progressColors = defaultProgressColors }) {
    const tilt = useRef(null);
    const { base_percentage, base_rounding, res_percentage, res_rounding, guaranteed_percentage, guaranteed_rounding } = useOfferDetailsProgress(allocations, isSoldOut)
    
    useEffect(() => VanillaTilt.init(tilt.current, { scale: 1.05, speed: 1000, max: 5 }), []);

    return (
        <>
        <div className='mt-4'>
            <div>Filled: {allocations.alloFilled}, Percentage: {base_percentage}</div>
            <div>Booked: {allocations.alloRes}, Percentage: {res_percentage}</div>
            <div>Guaranteed: {allocations.alloGuaranteed}, Percentage: {guaranteed_percentage}</div>
            <div>isSoldOut/isSettled: {String(isSoldOut || allocations.isSettled)}</div>
        </div>

        <div className={cn('relative h-[50px] w-full flex flex-row items-center rounded-xl select-none', { 'overflow-hidden': base_percentage >= 95 })} ref={tilt}>
            <div className="os-progress-bar absolute rounded-xl overflow-hidden -z-10">
                <span className="os-progress-bar--meter flex flex-1 rounded-tl-xl rounded-bl-xl"></span>
                <span
                    className="absolute right-0 top-0 bg-navy h-full rounded-tr-xl rounded-br-xl"
                    style={{ width: `${100 - base_percentage}%` }}
                ></span>
            </div>
            <Tooltiper
                text={null}
                wrapper={
                    <div
                        className="w-full h-full z-10 opacity-10 bg-[var(--progress-step-color)] rounded-tl-xl rounded-bl-xl cursor-pointer transition-all duration-150 hover:opacity-100 hover:border-2 hover:z-40 hover:border-[var(--progress-step-color)] hover:shadow-[0_0_2px_var(--progress-step-color),inset_0_0_2px_var(--progress-step-color),0_0_0px_var(--progress-step-color),0_0_0_var(--progress-step-color),0_0_10px_var(--progress-step-color)]"
                        style={{
                            borderTopRightRadius: base_rounding,
                            borderBottomRightRadius: base_rounding,
                        }}
                    ></div>
                }
                style={{ width: `${base_percentage}%`, "--progress-step-color": progressColors.baseColor }}
                className="w-full h-full"
            />
            <Tooltiper
                text={`Booked ${res_percentage}%`}
                wrapper={
                    <div
                        className="w-full h-full z-20 opacity-10 bg-[var(--progress-step-color)] cursor-pointer transition-all duration-150 hover:z-40 hover:opacity-100 hover:border-2 hover:border-[var(--progress-step-color)] hover:shadow-[0_0_2px_var(--progress-step-color),inset_0_0_2px_var(--progress-step-color),0_0_0px_var(--progress-step-color),0_0_0_var(--progress-step-color),0_0_10px_var(--progress-step-color)]"
                        style={{
                            borderTopLeftRadius: base_percentage === 0 ? '12px' : '0',
                            borderBottomLeftRadius: base_percentage === 0 ? '12px' : '0',
                            borderTopRightRadius: res_rounding,
                            borderBottomRightRadius: res_rounding,
                        }}
                    ></div>
                }
                style={{ width: `${res_percentage}%`, "--progress-step-color": progressColors.resColor }}
                className="w-full h-full"
            />
            <Tooltiper
                text={`Guaranteed ${guaranteed_percentage}%`}
                wrapper={
                    <div
                        className="w-full h-full z-20 opacity-10 bg-[var(--progress-step-color)] cursor-pointer transition-all duration-150 hover:z-40 hover:opacity-100 hover:border-2 hover:border-[var(--progress-step-color)] hover:shadow-[0_0_2px_var(--progress-step-color),inset_0_0_2px_var(--progress-step-color),0_0_0px_var(--progress-step-color),0_0_0_var(--progress-step-color),0_0_10px_var(--progress-step-color)]"
                        style={{
                            borderTopLeftRadius: base_percentage + res_percentage === 0 ? '12px' : '0',
                            borderBottomLeftRadius: base_percentage + res_percentage === 0 ? '12px' : '0',
                            borderTopRightRadius: guaranteed_rounding,
                            borderBottomRightRadius: guaranteed_rounding,
                        }}
                    ></div>
                }
                style={{ width: `${guaranteed_percentage}%`, "--progress-step-color": progressColors.guaranteedColor }}
                className="w-full h-full"
            />
            <p className="absolute z-40 right-1 mr-1 select-none pointer-events-none">
                Filled {Number(base_percentage).toFixed(0)}%
            </p>
        </div>
        </>
    );
}
