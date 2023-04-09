import VanillaTilt from "vanilla-tilt";
import moment from 'moment'
import {useEffect, useRef} from "react";
import PAGE from "@/routes";
import Link from "next/link";

export default function OfferItem({offer}) {
    const imageTilt = useRef(null);
    let {image, name, starts, ends} = offer

    useEffect(() => {
        VanillaTilt.init(imageTilt.current, {scale: 1.02, speed: 1000, max: 5});
    }, []);

    return (
        <div
            className="rounded-xl bg-navy-accent flex flex-col text-center cursor-pointer max-h-[463px] col-span-12 md:col-span-6 collap:col-span-12 lg:!col-span-6 xl:!col-span-4"
            ref={imageTilt}>
            <Link href={`${PAGE.Opportunities}/${name}`}>

                <div className="rounded-tl-xl rounded-tr-xl bg-cover bg-center relative min-h-[300px]"
                     style={{backgroundImage: `url(${image}) `}}>
                </div>
                <div className="flex flex-col text-left p-10">
                    <div className="flex justify-center items-center !flex-initial">
                        <div className="text-3xl font-bold flex flex-1">{name}</div>
                        <div className="ml-auto -mt-1">
                            <div className="bg-app-success2 rounded-3xl text-black px-2 py-1 text-sm font-bold">ACTIVE
                            </div>
                        </div>
                    </div>

                    <div
                        className="flex !flex-initial text-xs w-full justify-between pt-5 flex-col flex-wrap 2xl:flex-row">
                        <div className="flex ">
                            <strong>STARTS</strong>
                            <span
                                className="whitespace-nowrap ml-auto 2xl:ml-2">{moment.unix(starts).utc().local().format("YYYY-MM-DD HH:mm")}</span>
                        </div>
                        <div className="flex ">
                            <strong>ENDS</strong>
                            <span
                                className="whitespace-nowrap ml-auto 2xl:ml-2">{moment.unix(ends).utc().local().format("YYYY-MM-DD HH:mm")}</span>
                        </div>

                    </div>
                </div>
            </Link>

        </div>

    )
}
