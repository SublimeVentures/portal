import VanillaTilt from "vanilla-tilt";
import moment from 'moment'
import {useEffect, useRef} from "react";
import PAGE from "@/routes";
import Link from "next/link";
import Image from "next/image";
import {parsePhase} from "@/lib/phases/parsePhase";

export const OfferStatus = {
    PENDING: "pending",
    IN_PROGRESS: "inprogress",
    CLOSED: "closed",
}

const getStatus = (active, isLast) => {
    if(isLast) return OfferStatus.CLOSED
    else if(active === 0) return OfferStatus.PENDING
    else return OfferStatus.IN_PROGRESS
}

const showDate = (status, start, ends ) => {
    switch(status) {
        case OfferStatus.PENDING: {
            return (<>
                <div>Starts</div>
                <div>{moment.unix(ends).utc().local().format("LLL")}</div>
            </>)
        }
        case OfferStatus.IN_PROGRESS: {
            return (<>
                <div>Ends on</div>
                <div>{moment.unix(ends).utc().local().format('LLL')}</div>
            </>)
        }
        case OfferStatus.CLOSED: {
            return (<>
                <div>Ended on</div>
                <div>{moment.unix(ends).utc().local().format('LL')}</div>
            </>)
        }
    }
}

export default function OfferItem({offer, ACL, cdn}) {
    const imageTilt = useRef(null);
    let {name, slug,genre, d_open: starts, d_close:ends} = offer

    useEffect(() => {
        VanillaTilt.init(imageTilt.current, {scale: 1.02, speed: 1000, max: 5});
    }, []);

    const {active, phase, isLast} = parsePhase(ACL, offer, 0)
    const state = phase[active]?.step

    const status = getStatus(active, isLast)
    // console.log("====================")
    // console.log("offer",offer)
    // console.log("active",active)
    // console.log("phase",phase)
    // console.log("isLast",isLast)
    // console.log("status",status)
    // console.log("state",state)
    // console.log("====================")

    return (
        <div
            className={`
            rounded-xl
            bg-navy-accent flex flex-col text-center cursor-pointer col-span-12
            border-transparent border offerItem ${status}
            md:col-span-6 collap:col-span-12 lg:!col-span-6 xl:!col-span-4`}
            ref={imageTilt}>
            <Link href={`${PAGE.Opportunities}/${slug}`} className="flex flex-1 flex-col bg-navy-accent rounded-xl">
                <div className="bg-center relative min-h-[300px]">
                    <div className={'image-container min-h-[300px]'}>
                        <Image src={`${cdn}${slug}/logo.jpg`} fill className={'imageOfferList rounded-tl-xl rounded-tr-xl'} alt={slug} sizes="(max-width: 768px) 100vw"/>
                    </div>
                </div>
                <div className={"flex flex-row ml-3 -mt-10 z-10 "}>
                    <div className={"rounded-lg bg-navy-accent"}>
                        <Image src={`${cdn}${slug}/icon.jpg`}  className={'p-1 rounded-lg'} alt={slug} width={90} height={90}/>
                    </div>
                    <div className={"flex flex-1 items-end text-sm pb-5 "}>
                        <div className={"offerTime w-full px-5 flex justify-between h-8 items-center color"}>{showDate(status,starts,ends)}</div>
                    </div>
                </div>
                <div className="flex flex-1 flex-col text-left ">
                    <div className={"px-10 pt-5"}>
                        <div className="text-3xl font-bold flex flex-1 glow">{name}</div>
                        <div className="text-md flex flex-1 mt-1 pb-5 color">#{genre}</div>
                    </div>


                    <div
                        className="color uppercase font-bold offerBottom text-center py-2 text-xs w-full mt-auto border-b-xl">
                        {state}
                    </div>
                </div>
            </Link>

        </div>

    )
}
