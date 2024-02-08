import {useEffect, useRef} from "react";
import VanillaTilt from "vanilla-tilt";
import {isBased} from "@/lib/utils";

export default function OfferDetailsProgress({allocations, isSoldOut}) {
    const tilt = useRef(null);
    useEffect(() => {
        VanillaTilt.init(tilt.current, {scale: 1.05, speed: 1000, max: isBased ? 5 : 0.2});
    }, []);


    const amt_filled = allocations?.alloFilled ? allocations?.alloFilled : 0
    const amt_res = allocations?.alloRes ? allocations?.alloRes : 0
    const amt_guaranteed = allocations?.alloGuaranteed ? allocations?.alloGuaranteed : 0

    const filled_base = Math.round(amt_filled/allocations?.alloTotal * 100)
    const filled_res = Math.round(amt_res/allocations?.alloTotal * 100)
    const filled_guaranteed = Math.round(amt_guaranteed/allocations?.alloTotal * 100)

    const progress = isSoldOut ? 100 : filled_base

    return (
        <>
            <div className="rounded-2xl h-[50px]  w-full flex flex-row items-center relative select-none" ref={tilt}>
                <div className="os-progress-bar rounded-xl  relative">
                    <span className="os-progress-bar--meter rounded-tl-xl rounded-bl-xl flex flex-1 "></span>
                    <span className="absolute -right-1 top-0 bg-navy h-full rounded-tr-xl rounded-br-xl "
                          style={{'width': `${100-progress}%`}}></span>
                </div>

                <div className="absolute h-full w-full flex -right-1">
                    <div className="opacity-100 rounded-l-xl  h-full" style={{'width': `${filled_base}%`}}></div>
                    <div className={`opacity-10 bg-app-error h-full`} style={{'width': `${filled_res}%`}}></div>
                </div>

                <div className="absolute h-full w-full flex -right-1">
                    <div className="opacity-100 rounded-l-xl  h-full" style={{'width': `${filled_base+filled_res}%`}}></div>
                    <div className={`opacity-10 bg-gold h-full`} style={{'width': `${filled_guaranteed}%`}}></div>
                </div>

                <div className="absolute right-1 ">
                           <div className="mr-1">Filled {Number(progress).toFixed(0)}%</div>
                 </div>
            </div>

        </>


    )
}
