import IconMore from "@/assets/svg/More.svg";
import VanillaTilt from "vanilla-tilt";
import {useEffect, useRef} from "react";
import moment from "moment";
import Image from "next/image";
import PAGE from "@/routes";
import Link from "next/link";
import {parseVesting} from "@/lib/vesting";
import {is3VC} from "@/lib/seoConfig";

export default function VaultItem({item, cdn}) {
    const {offerDetails, createdAt, invested } = item;
    const tilt = useRef(null);
    const participated = moment(createdAt).utc().local().format("YYYY-MM-DD")
    const normalized_tgeDiff = Number(100*(item["offer.tge"] - item["offer.ppu"])/item["offer.ppu"])?.toLocaleString()
    const normalized_invested = Number(invested).toLocaleString()
    const tge = offerDetails?.tge > 0 ? `+${normalized_tgeDiff}%` : "TBA"

    const {vested, nextUnlock} = parseVesting(item["offer.t_unlock"])

    useEffect(() => {
        VanillaTilt.init(tilt.current, {scale: is3VC ? 1.05 : 1, speed: 1000, max: 1});
    }, []);

    return <div className={`${is3VC ? "rounded-xl" : ""} boxshadow vaultItem timeline flex col-span-12 lg:col-span-6 3xl:col-span-4` }>
        <div
            className={`${is3VC ? "rounded-tl-xl rounded-bl-xl rounded-tr-xl rounded-br-xl sm:rounded-tr-none sm:rounded-br-none lg:!rounded-tr-xl lg:!rounded-br-xl xl:!rounded-tr-none xl:!rounded-br-none" : ""} relative bg-navy-accent flex flex-1 flex-col p-5 `}>
            <div className="font-bold text-2xl flex items-center glowNormal">
                {item["offer.name"]}
            </div>
            <div className="pt-1 text-xs text-gray text-left">Participated {participated}</div>

            <div className={`${is3VC ? "" : "font-accent"} text-md pt-2`}>
                <div className={"detailRow "}><p>Invested</p><hr className={"spacer"}/><p>${normalized_invested}</p></div>
                <div className={"detailRow "}><p>TGE profit</p><hr className={"spacer"}/><p><span className={`${tge !== 'TBA' ? 'text-app-success' : ' text-white'}`}>{tge}</span></p></div>
                <div className={"detailRow "}><p>Vested</p><hr className={"spacer"}/><p>{vested}%</p></div>
                <div className={"detailRow "}><p>Next unlock</p><hr className={"spacer"}/><p>{nextUnlock>0 ? nextUnlock : "TBA"}</p></div>
            </div>

            {/*<div*/}
            {/*    className="moreVault opacity-0 absolute -bottom-5 mx-auto left-0 right-0 text-center">*/}
            {/*    <div className="flex items-center justify-center moreVaultIcon">*/}
            {/*        <div className="icon z-10 w-15 h-15 cursor-pointer">*/}
            {/*            <IconMore className="w-8"/>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>

        <div className={`relative w-[200px] cursor-pointer flex hidden sm:flex lg:hidden xl:!flex ${is3VC ? "" : "border-l border-app-bg-split"} `}  ref={tilt}>
            <Link href={`${PAGE.Opportunities}/${item["offer.slug"]}`}>
            <Image src={`${cdn}${item["offer.slug"]}/logo.jpg`} fill className={`${is3VC ? "rounded-tr-xl rounded-br-xl" : ""} imageOfferList  bg-cover `} alt={item["offer.name"]} sizes="(max-width: 2000px) 200px"/>
            </Link>
        </div>

    </div>
}
