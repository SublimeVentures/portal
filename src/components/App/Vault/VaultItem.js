import IconArrow from "@/assets/svg/Arrow.svg";
import VanillaTilt from "vanilla-tilt";
import {useEffect, useRef} from "react";
import moment from "moment";
import Image from "next/image";
import PAGE from "@/routes";
import Link from "next/link";
import {parseVesting} from "@/lib/vesting";

export default function VaultItem({item}) {
    const {offerDetails, createdAt, invested } = item;
    const tilt = useRef(null);
    const participated = moment(createdAt).utc().local().format("YYYY-MM-DD")
    const normalized_tgeDiff = (100*(offerDetails?.tge - offerDetails.ppu)/offerDetails.ppu)?.toLocaleString()
    const normalized_invested = Number(invested).toLocaleString()
    const tge = offerDetails?.tge > 0 ? `${normalized_tgeDiff}%` : "TBA"

    const {vested, nextUnlock} = parseVesting(offerDetails.t_unlock)

    useEffect(() => {
        VanillaTilt.init(tilt.current, {scale: 1.1, speed: 1000, max: 10});
    }, []);

    return <div className="timeline flex col-span-12 lg:col-span-6">
        <div
            className="relative rounded-tl-xl rounded-bl-xl bg-navy-accent flex flex-1 flex-col p-5 rounded-tr-xl rounded-br-xl sm:rounded-tr-none sm:rounded-br-none lg:!rounded-tr-xl lg:!rounded-br-xl xl:!rounded-tr-none xl:!rounded-br-none">
            <div className="font-bold text-2xl flex items-center">
                {offerDetails.name}

            </div>
            <div className="pt-1 text-xs text-gray">Participated {participated}</div>

            <div className="text-md pt-2 w-full flex">Invested <span
                className="ml-auto font-bold">${normalized_invested}</span></div>

            <div className="text-md w-full flex">TGE profit <span className={`ml-auto font-bold ${tge !== 'TBA' ? 'text-app-success' : ''}`}>+{tge}</span></div>
            <div className="text-md w-full flex">Vested <span className="ml-auto font-bold">{vested}%</span></div>
            <div className="text-md w-full flex">Next unlock <span className="ml-auto font-bold">{nextUnlock>0 ? nextUnlock : "TBA"}</span></div>
            <div
                className="moreVault  cursor-pointer opacity-0 absolute -bottom-5 mx-auto left-0 right-0 text-center">
                <div className="flex items-center justify-center moreVaultIcon">
                    <div className="icon z-10 w-15 h-15">
                        <IconArrow className="w-8"/>
                    </div>
                </div>
            </div>
        </div>

        <div className={'relative w-[200px] cursor-pointer flex hidden sm:flex lg:hidden xl:!flex'}  ref={tilt}>
            <Link href={`${PAGE.Opportunities}/${offerDetails.slug}`}>
            <Image src={offerDetails.image} fill className={'imageOfferList rounded-tr-xl rounded-br-xl bg-cover '} alt={offerDetails.name} sizes="(max-width: 2000px) 200px"/>
            </Link>
        </div>

    </div>
}
