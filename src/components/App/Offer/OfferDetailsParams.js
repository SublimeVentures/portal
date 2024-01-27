import OfferDetailsProgress from "@/components/App/Offer/OfferDetailsProgress";
import {isBased} from "@/lib/utils";
import DynamicIcon from "@/components/Icon";
import {ICONS} from "@/lib/icons";
import {Tooltiper, TooltipType} from "@/components/Tooltip";

function toLocaleStringWithPrecision(number) {
    const numberAsString = number.toString();

    const decimalPointIndex = numberAsString.indexOf('.');
    const numberOfDecimalPlaces = decimalPointIndex === -1 ? 0 : numberAsString.length - decimalPointIndex - 1;

    return number.toLocaleString(undefined, {
        minimumFractionDigits: numberOfDecimalPlaces,
        maximumFractionDigits: numberOfDecimalPlaces
    });
}

export const OfferDetailsParams = ({paramsParams}) => {
    const {offer, allocation, userInvested, phaseIsClosed} = paramsParams
    let {ticker, ppu, tge, t_cliff, t_vesting, alloTotal} = offer
    let {booked, invested} = userInvested

    const normalized_ppu = toLocaleStringWithPrecision(ppu)
    const normalized_tge = tge ? toLocaleStringWithPrecision(tge) : 0
    const normalized_tgeDiff = Number(100*(tge - ppu)/ppu)?.toLocaleString(undefined, {maximumFractionDigits: 2})
    const normalized_total = Number(alloTotal)?.toLocaleString()
    const normalized_invested = Number(invested)?.toLocaleString()
    const normalized_booked = Number(booked)?.toLocaleString()
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
                        {booked > 0 && <div className={"detailRow text-warn"}><p>My Bookings</p><hr className={"spacer"}/><div >
                            <Tooltiper wrapper={<div onClick={() => {}}><DynamicIcon name={ICONS.ALERT} style={"w-5 mr-1"}/></div>} text={`Click here to cancel all pending bookings`} type={TooltipType.Error}/>
                            ${normalized_booked}
                        </div></div>}
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
