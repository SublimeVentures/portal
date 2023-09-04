import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import routes, {ExternalLinks} from "@/routes";
import IconInfo from "@/assets/svg/Info.svg";
import {IconButton} from "@/components/Button/IconButton";
import {isBased} from "@/lib/utils";
import ReadIcon from "@/assets/svg/Read.svg";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import Link from "next/link";
import {PremiumItemsENUM} from "@/lib/premiumHelper";

export default function PremiumSummary({data}) {
    const guaranteed = data?.find(el => el.storeId === PremiumItemsENUM.Guaranteed)
    const increased = data?.find(el => el.storeId === PremiumItemsENUM.Increased)
    const mystery = data?.find(el => el.storeId === PremiumItemsENUM.MysteryBox)

    return (
        <div className={`relative offerWrap flex flex-1 max-w-[600px]`}>
            <div className={"bg-navy-accent p-5 font-accent flex flex-1 flex-col uppercase"}>
                <div className={"flex flex-row items-center pb-5 justify-between "}>
                    <div className={`text-app-error font-accent glowRed  font-light text-2xl flex glowNormal`}>Premium</div>
                    <a href={ExternalLinks.DISCORD} target={"_blank"}><IconButton zoom={1.1} size={'w-8'} icon={<IconInfo />} noBorder={!isBased} /></a>

                </div>
                <div>
                    <div className={"detailRow"}><p>Guaranteed Allocation</p><hr className={"spacer"}/><p>{guaranteed?.amount ? guaranteed.amount : 0}</p></div>
                    <div className={"detailRow"}><p>Increased Allocation</p><hr className={"spacer"}/><p>{increased?.amount ? increased.amount : 0}</p></div>
                    <div className={"detailRow"}><p>MysteryBox owned</p><hr className={"spacer"}/><p>{mystery?.amount ? mystery.amount : 0}</p></div>
                </div>

                <div className={" flex flex-1 justify-between gap-5 items-end"}>

                    <Link href={routes.Upgrades}>
                        <UniButton type={ButtonTypes.BASE} text={'UPGRADES'} isWide={true}
                                   size={'text-sm sm'}
                                   icon={<ReadIcon className={ButtonIconSize.hero}/>}/>
                    </Link>
                    <Link href={routes.Mysterybox}>
                        <UniButton type={ButtonTypes.BASE} text={'MYSTERYBOX'} isWide={true}
                                   size={'text-sm sm'}  state={"success"}
                                   icon={<ReadIcon className={ButtonIconSize.hero}/>}/>
                    </Link>
                </div>
            </div>

        </div>
    )
}
