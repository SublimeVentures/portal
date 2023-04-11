import VanillaTilt from "vanilla-tilt";
import moment from 'moment'
import {useEffect, useRef} from "react";
import OfferDetailsProgress from "@/components/App/Offer/OfferDetailsProgress";

export default function OfferDetailsParams({offer}) {
    // let {image, name, starts, ends} = offer

    return (

        <>
            <div className="flex flex-col rounded-xl bg-navy-accent p-5 gap-1 justify-start flex-1">
                <div className="text-xl uppercase font-medium text-outline mb-2">TOKEN</div>

                <div className="flex ">
                    <div className="flex-1 ">TICKER</div>
                    <div className="tabular-nums">$LNDX</div>
                </div>
                <div className="flex ">
                    <div className="flex-1 ">PRICE</div>
                    <div className="tabular-nums">$0,23</div>
                </div>
                <div className="flex ">
                    <div className="flex-1 ">TGE PRICE</div>
                    <div className="tabular-nums">$0,50</div>
                </div>
                <div className="flex text-app-success">
                    <div className="flex-1 ">TGE DIFF</div>
                    <div className="tabular-nums">+117%</div>
                </div>
                <div className="flex ">
                    <div className="flex-1 ">CLIFF</div>
                    <div className="tabular-nums">6m</div>
                </div>
                <div className="flex ">
                    <div className="flex-1 ">VESTING</div>
                    <div className="tabular-nums">24m</div>
                </div>
            </div>
            <div className="flex flex-col rounded-xl bg-navy-accent p-5 gap-1 justify-start flex-1 xl:mt-10">
                <div className="text-xl uppercase font-medium text-outline mb-2">ALLOCATION</div>

                <div className="flex ">
                    <div className="flex-1 ">TOTAL</div>
                    <div className="">$550 000</div>
                </div>
                <div className="flex ">
                    <div className="flex-1 ">FILLED</div>
                    <div className="">$350 000</div>
                </div>
                <div className="flex text-app-success mb-1">
                    <div className="flex-1 ">MINE</div>
                    <div className="">$35 000</div>
                </div>
                <div className="flex flex-1 items-end">
                    <OfferDetailsProgress/>

                </div>

            </div>
        </>

    )
}
