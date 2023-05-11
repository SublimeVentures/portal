import VanillaTilt from "vanilla-tilt";
import moment from 'moment'
import {useEffect, useRef} from "react";
import PAGE from "@/routes";
import Link from "next/link";
import Image from "next/image";
import {useSession} from "next-auth/react";
import {parsePhase} from "@/lib/phases/parsePhase";

export default function OfferItem({offer, ACL}) {

    const imageTilt = useRef(null);
    let {image, name, slug, d_open: starts, d_close:ends} = offer

    useEffect(() => {
        VanillaTilt.init(imageTilt.current, {scale: 1.02, speed: 1000, max: 5});
    }, []);

    const {active, phase, isLast} = parsePhase(ACL, offer, 0)
    const status = phase[active]?.step
    return (
        // maxAllocation-h-[463px] on div wrapper
        <div
            className="rounded-xl bg-navy-accent flex flex-col text-center cursor-pointer col-span-12 md:col-span-6 collap:col-span-12 lg:!col-span-6 xl:!col-span-4"
            ref={imageTilt}>
            <Link href={`${PAGE.Opportunities}/${slug}`} className="flex flex-1 flex-col">
                <div className="bg-center relative min-h-[300px]">
                    <div className={'image-container min-h-[300px]'}>
                        <Image src={image} fill className={'imageOfferList rounded-tl-xl rounded-tr-xl'} alt={slug} sizes="(max-width: 768px) 100vw"/>
                    </div>
                </div>
                <div className="flex flex-1 flex-col text-left p-10">
                    <div className="flex justify-center items-center !flex-initial">
                        <div className="text-3xl font-bold flex flex-1">{name}</div>
                        <div className="ml-auto -mt-1">
                            <div className={` rounded-3xl text-black px-2 py-1 text-sm font-bold uppercase ${active ===0 ? "bg-gold": (isLast ? "bg-outline" : "bg-app-success2")}`}>{status}
                            </div>
                        </div>
                    </div>

                    <div
                        className="flex !flex-initial text-xs w-full mt-auto justify-between pt-5 flex-col flex-wrap 2xl:flex-row">
                        <div className="flex ">
                            <strong>STARTS</strong>
                            <span
                                className="whitespace-nowrap ml-auto 2xl:ml-2 tabular-nums">{moment.unix(starts).utc().local().format("YYYY-MM-DD HH:mm")}</span>
                        </div>
                        <div className="flex ">
                            <strong>ENDS</strong>
                            <span
                                className="whitespace-nowrap ml-auto 2xl:ml-2 tabular-nums">{moment.unix(ends).utc().local().format("YYYY-MM-DD HH:mm")}</span>
                        </div>

                    </div>
                </div>
            </Link>

        </div>

    )
}
