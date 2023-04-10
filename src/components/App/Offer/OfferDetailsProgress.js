import {useEffect, useRef} from "react";
import VanillaTilt from "vanilla-tilt";

export default function OfferDetailsProgress({offer}) {
    // let {image, name, starts, ends} = offer
    const val = 23;
    const required = 25

    const tilt = useRef(null);

    useEffect(() => {
        VanillaTilt.init(tilt.current, {scale: 1.05, speed: 1000, max: 5});
    }, []);
    return (
        <>

            <div className="rounded-2xl h-[50px]  w-full flex flex-row items-center relative select-none" ref={tilt}>
                <div className="os-progress-bar rounded-xl  relative">
                    <span className="os-progress-bar--meter rounded-tl-xl rounded-bl-xl flex flex-1 "></span>
                    <span className="absolute -right-1 top-0 bg-navy h-full rounded-tr-xl rounded-br-xl "
                          style={{'width': `${100 - val}%`}}></span>
                </div>
                {val >= required ?
                    <div className="absolute right-1 ">
                        <div className="">Filled {val}%</div>
                    </div>
                    :
                    <div className="absolute w-full flex  ">
                        <div className="border-r-2 border-app-error h-[50px] " style={{'width': `${required}%`}}></div>
                        <div className="text-app-error glowing ml-2 flex items-center">Required {required}%</div>
                    </div>
                }
            </div>

        </>


    )
}
