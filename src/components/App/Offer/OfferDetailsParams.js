import OfferDetailsProgress from "@/components/App/Offer/OfferDetailsProgress";
import {isBased} from "@/lib/utils";
import DynamicIcon from "@/components/Icon";
import {ICONS} from "@/lib/icons";
import {Tooltiper, TooltipType} from "@/components/Tooltip";
import {useInvestContext} from "@/components/App/Offer/InvestContext";
import { debounce } from "debounce";
import {useState} from "react";

export const OfferDetailsParams = ({paramsParams}) => {
    const {offer, allocation, userInvested, phaseIsClosed} = paramsParams
    let {ticker, ppu, tge, t_cliff, t_vesting, alloTotal} = offer
    let { invested} = userInvested
    const normalized_ppu = Number(ppu)?.toLocaleString()
    const normalized_tge = Number(tge)?.toLocaleString()
    const normalized_tgeDiff = Number(100*(tge - ppu)/ppu)?.toLocaleString(undefined, {minimumFractionDigits: 2})
    const normalized_total = Number(alloTotal)?.toLocaleString()
    const normalized_invested = Number(invested)?.toLocaleString()
    const isSoldOut = allocation?.alloFilled >= alloTotal-50 || phaseIsClosed


    return (
        <>
            <div className={`offerWrap ${isBased ? "rounded-xl" : "font-accent"}`}>
                <div className="flex flex-col rounded-xl bg-navy-accent p-6 justify-start flex-1">
                    <div className={`${isBased ? "" : "uppercase"}`}>{isSoldOut ?  <div className={"text-sm bg-app-success w-fit px-2 py-1 rounded-xl text-app-bg"}>Sold out</div> : <div className={"text-sm text-outline"}>Fundraise goal</div>}</div>
                    <div className={`text-5xl font-bold flex flex-1 glow font-light ${isBased ? "py-1" : "py-2 font-light"}`}>${normalized_total}</div>

                    <div className={"py-2"}>
                        <OfferDetailsProgress alloTotal={alloTotal} allocations={allocation} isSoldOut={isSoldOut}/>
                    </div>
                    <div className={`flex flex-col gap-2 mt-5 ${isBased ? "" : "font-accent"}`}>
                        {invested > 0 && <div className={"detailRow text-app-success"}><p>My Investment</p><hr className={"spacer"}/><p>${normalized_invested}</p></div>}
                        <div className={"detailRow"}><p>Ticker</p><hr className={"spacer"}/><p>${ticker}</p></div>
                        <div className={"detailRow"}><p>Price</p><hr className={"spacer"}/><p>{ppu === 0 ? "TBA" : `$${normalized_ppu}`}</p></div>
                        {tge && <div className={"detailRow text-app-success"}><p>TGE</p><hr className={"spacer"}/><p>({normalized_tgeDiff}%) ${normalized_tge}</p></div>}
                        <div className={"detailRow"}><p>Cliff</p><hr className={"spacer"}/><p>{t_cliff ? <>{t_cliff}</> : <>TBA</>}</p></div>
                        <div className={"detailRow"}><p>Vesting</p><hr className={"spacer"}/><p>{t_vesting ? <>{t_vesting}</> : <>TBA</>}</p></div>
                    </div>
                </div>
            </div>
        </>
    )
}
