import OfferDetailsProgress from "@/components/App/Offer/OfferDetailsProgress";

export const OfferDetailsParams = ({paramsParams}) => {
    const {offer, allocation, userAllocation} = paramsParams
    let {ticker, ppu, tge, t_cliff, t_vesting, alloTotal, alloRequired} = offer

    const normalized_ppu = ppu?.toLocaleString()
    const normalized_tge = tge?.toLocaleString()
    const normalized_tgeDiff = (100*(tge - ppu)/ppu)?.toLocaleString()
    const normalized_total = alloTotal?.toLocaleString()
    const normalized_filled = allocation?.alloFilled?.toLocaleString()
    const normalized_my = userAllocation?.toLocaleString()


    return (

        <>
            <div className="flex flex-col rounded-xl bg-navy-accent p-5 gap-1 justify-start flex-1">
                <div className="text-xl uppercase font-medium text-outline mb-2">TOKEN</div>

                <div className="flex ">
                    <div className="flex-1 ">TICKER</div>
                    <div className="tabular-nums">${ticker}</div>
                </div>
                <div className="flex ">
                    <div className="flex-1 ">PRICE</div>
                    <div className="tabular-nums">${normalized_ppu}</div>
                </div>
                {tge && <div className="flex ">
                            <div className="flex-1 ">TGE PRICE</div>
                            <div className="tabular-nums">${normalized_tge}</div>
                        </div>
                }
                {tge && <div className="flex text-app-success">
                            <div className="flex-1 ">TGE DIFF</div>
                            <div className="tabular-nums">{normalized_tgeDiff}%</div>
                        </div>
                }
                <div className="flex ">
                    <div className="flex-1 ">CLIFF</div>
                    {t_cliff && <div className="tabular-nums">{t_cliff}</div>  }
                    {!t_cliff && <div className="tabular-nums">TBA</div>  }
                </div>
                <div className="flex ">
                    <div className="flex-1 ">VESTING</div>
                    {t_vesting && <div className="tabular-nums">{t_vesting}</div>  }
                    {!t_vesting && <div className="tabular-nums">TBA</div>  }
                </div>
            </div>
            <div className="flex flex-col rounded-xl bg-navy-accent p-5 gap-1 justify-start flex-1 xl:mt-10">
                <div className="text-xl uppercase font-medium text-outline mb-2">ALLOCATION</div>

                <div className="flex ">
                    <div className="flex-1 ">TOTAL</div>
                    <div className="">${normalized_total}</div>
                </div>
                <div className="flex ">
                    <div className="flex-1 ">FILLED</div>
                    <div className="">${normalized_filled}</div>
                </div>
                <div className="flex text-app-success mb-1">
                    <div className="flex-1 ">MINE</div>
                    <div className="">${normalized_my}</div>
                </div>
                <div className="flex flex-1 items-end">
                    <OfferDetailsProgress alloTotal={alloTotal} alloFilled={allocation?.alloFilled} alloRequired={alloRequired}/>
                </div>

            </div>
        </>

    )
}
