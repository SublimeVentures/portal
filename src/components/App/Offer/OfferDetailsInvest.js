import OfferDetailsInvestPhases from "@/components/App/Offer/OfferDetailsInvestPhases";
import OfferDetailsInvestClosed from "@/components/App/Offer/OfferDetailsInvestClosed";
import {parsePhase} from "@/lib/phases/parsePhase";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";

export const OfferDetailsInvest = ({paramsInvest}) => {
    const { offer } = paramsInvest
    const {data: session} = useSession()
    let [phases, setPhases] = useState(null)
    let [activePhase, setActivePhase] = useState(0)
    let [isLastPhase, setIsLastPhase] = useState(false)

    let isClosed = !!phases && phases.length-1 !== activePhase || offer.isSettled

    const feedPhases = () => {
        const {phase, active, isLast} = parsePhase(session.user.ACL, offer, 0)
        setPhases(phase)
        setActivePhase(active)
        setIsLastPhase(isLast)
    }



    useEffect(() => {
        feedPhases()
    }, [])

    const paramsInvestPhase = {
        ...paramsInvest,
        feedPhases,
        phases,
        activePhase,
        isLastPhase
    }

    const paramsInvestClosed = {
        session,
        isClosed,
        offer
    }

    return (

        <div className="flex flex-1 flex-col min-h-[300px] ">
            {/*<TimelineWrap :list="investmentSteps" :spacer-size="12" :step="currentInvestmentStep" :is-vertical="true" className="hidden sinvest:flex"/>*/}
            {/*<TimelineWrap :list="investmentSteps" :spacer-size="12" :step="currentInvestmentStep" :is-vertical="false" className="flex sinvest:hidden"/>*/}
            {isClosed ?
                <OfferDetailsInvestPhases paramsInvestPhase={paramsInvestPhase}  /> :
                <OfferDetailsInvestClosed paramsInvestClosed={paramsInvestClosed}/>}
        </div>
    )
}
