import VanillaTilt from "vanilla-tilt";
import moment from 'moment'
import {useEffect, useRef} from "react";

export default function OfferDetailsProgress({offer}) {
    // let {image, name, starts, ends} = offer
    const val = 39;
    const required = 40
    return (

        <div className="rounded-xl bg-navy-accent h-[70px] w-full flex flex-row items-center relative">
            <div className="os-progress-bar rounded-tl-xl rounded-bl-xl relative">
                <span className="os-progress-bar--meter rounded-tl-xl rounded-bl-xl flex flex-1"></span>
                <span className="absolute right-0 top-0 bg-navy-accent h-full rounded-tr-xl rounded-br-xl "
                      style={{'width': `${100 - val}%`}}></span>
            </div>
            <div className="absolute flex flex-row w-full h-full items-center right-0">
                {val < required &&
                    <div className="h-full border-r-2 border-app-error rounded-tl-xl rounded-bl-xl flex items-center justify-end" style={{'width': `${required}%`}}></div>
                }

                <div className=" px-5 right-0 absolute flex justify-between align-center"
                     style={{'width': `${100 - required}%`}}>
                    <div
                        className="text-app-error text-md font-bold flex flex-row left-0 items-center glowing cursor-pointer"
                       >
                        {/*<div*/}
                        {/*className="text-app-error text-md font-bold flex flex-row left-0 items-center glowing cursor-pointer"*/}
                        {/*v-tooltip="'Minimum required allocation'">*/}
                        <span className="hidden pr-2 sm:flex">Required </span>({required}%)
                    </div>
                    <div className="text-md sm:text-xl font-bold ">Filled ({val}%)</div>
                </div>
            </div>
        </div>

    )
}
