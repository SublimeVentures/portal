import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import routes, {ExternalLinks} from "@/routes";
import IconInfo from "@/assets/svg/Info.svg";
import {IconButton} from "@/components/Button/IconButton";

import {is3VC} from "@/lib/utils";
import ReadIcon from "@/assets/svg/Read.svg";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import {useRouter} from "next/router";
import Link from "next/link";



export default function PremiumSummary({account}) {
    const router = useRouter();


    return (
        <div className={`relative offerWrap flex flex-1 max-w-[600px]`}>
            <div className={"bg-navy-accent p-5 font-accent flex flex-1 flex-col uppercase"}>
                <div className={"flex flex-row items-center pb-5 justify-between "}>
                    <div className={`text-app-error font-accent glowRed  font-light text-2xl flex glowNormal`}>Premium</div>
                    <a href={ExternalLinks.DISCORD} target={"_blank"}><IconButton zoom={1.1} size={'w-8'} icon={<IconInfo />} noBorder={!is3VC} /></a>

                </div>
                <div>
                    <div className={"detailRow"}><p>Guaranteed Allocation</p><hr className={"spacer"}/><p>2</p></div>
                    <div className={"detailRow"}><p>Increased Allocation</p><hr className={"spacer"}/><p>10</p></div>
                    <div className={"detailRow"}><p>MysteryBox owned</p><hr className={"spacer"}/><p>10</p></div>
                </div>

                <div className={" flex flex-1 justify-end items-end"}>
                    <Link href={routes.Upgrades}>
                        <UniButton type={ButtonTypes.BASE} text={'GET PREMIUM'} isWide={true}
                                   size={'text-sm sm'}
                                   icon={<ReadIcon className={ButtonIconSize.hero}/>}/>
                    </Link>
                </div>
            </div>

        </div>
    )
}
