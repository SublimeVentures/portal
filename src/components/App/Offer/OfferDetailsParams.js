import {useEffect, useState} from "react";
import OfferDetailsProgress from "@/components/App/Offer/OfferDetailsProgress";

export default function OfferDetailsParams({offer}) {
    let {ticker, b_ppu, tge, t_cliff, t_vesting, alloTotal, alloFilled, alloMy, alloRequired} = offer

    let [normalized_ppu, setNormalizedPpu] = useState("")
    let [normalized_tge, setNormalizedTge] = useState("")
    let [normalized_tgeDiff, setNormalizedTgeDiff] = useState("")
    let [normalized_total, setNormalizedTotal] = useState("")
    let [normalized_filled, setNormalizedFilled] = useState("")
    let [normalized_my, setNormalizedMy] = useState("")

    useEffect(() => {
        setNormalizedPpu(b_ppu?.toLocaleString())
    }, [b_ppu]);
    useEffect(() => {
        setNormalizedTge(tge?.toLocaleString())
        setNormalizedTgeDiff((100*(tge - b_ppu)/b_ppu)?.toLocaleString())
    }, [tge]);
    useEffect(() => {
        setNormalizedTotal(alloTotal?.toLocaleString())
    }, [alloTotal]);
    useEffect(() => {
        setNormalizedFilled(alloFilled?.toLocaleString())
    }, [alloFilled]);
    useEffect(() => {
        setNormalizedMy(alloMy?.toLocaleString())
    }, [alloMy]);


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
                    <OfferDetailsProgress alloTotal={alloTotal} alloFilled={alloFilled} alloRequired={alloRequired}/>

                </div>

            </div>
        </>

    )
}
