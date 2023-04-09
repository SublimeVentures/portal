import VanillaTilt from "vanilla-tilt";
import moment from 'moment'
import {useEffect, useRef} from "react";

export default function OfferDetailsParams({offer} ) {
    // let {image, name, starts, ends} = offer

    return (

     <>
         <div className="flex flex-col rounded-xl bg-navy-accent p-5 gap-2 justify-start flex-1">
             <div className="text-xl font-bold text-app-accent2">TOKEN</div>

             <div className="flex ">
                 <div className="flex-1 font-bold">TICKER</div>
                 <div>$LNDX</div>
             </div>
             <div className="flex ">
                 <div className="flex-1 font-bold">PRICE</div>
                 <div>$0,23</div>
             </div>
             <div className="flex ">
                 <div className="flex-1 font-bold">TGE PRICE</div>
                 <div>$0,50</div>
             </div>
             <div className="flex ">
                 <div className="flex-1 font-bold">TGE DIFF</div>
                 <div>+117,39%</div>
             </div>
             <div className="flex ">
                 <div className="flex-1 font-bold">CLIFF</div>
                 <div>6m</div>
             </div>
             <div className="flex ">
                 <div className="flex-1 font-bold">VESTING</div>
                 <div>24m</div>
             </div>
         </div>
         <div className="flex flex-col rounded-xl bg-navy-accent p-5 gap-2 justify-start flex-1 xl:mt-10">
             <div className="text-xl font-bold text-app-accent2">ALLOCATION</div>
             <div className="flex ">
                 <div className="flex-1 font-bold">TOTAL</div>
                 <div>$550 000</div>
             </div>
             <div className="flex ">
                 <div className="flex-1 font-bold">FILLED</div>
                 <div>$350 000</div>
             </div>
             <div className="flex text-app-success">
                 <div className="flex-1 font-bold">MINE</div>
                 <div>$35 000</div>
             </div>
         </div>
     </>

    )
}
