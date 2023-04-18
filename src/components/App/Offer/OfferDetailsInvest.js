
import OfferDetailsInvestPhases from "@/components/App/Offer/OfferDetailsInvestPhases";
import OfferDetailsInvestClosed from "@/components/App/Offer/OfferDetailsInvestClosed";
import {parsePhase} from "@/lib/phases/parsePhase";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";

export const OfferDetailsInvest = ({offer, currencies, refetchAllocation, allocation}) => {
    const {data: session} = useSession()
    let [phases, setPhases] = useState(null)
    let [current, setCurrent] = useState(0)
    let [isLast, setIsLast] = useState(false)

    let isClosed = !!phases && phases.length-1 !== current || offer.isSettled

    const feedPhases = () => {
        const {phase, active, isLast} = parsePhase(session.user.ACL, offer, 0)
        setPhases(phase)
        setCurrent(active)
        setIsLast(isLast)
    }

    useEffect(() => {
        feedPhases()
    }, [])

    return (

        <div className="flex flex-1 flex-col min-h-[300px] ">
            {/*<TimelineWrap :list="investmentSteps" :spacer-size="12" :step="currentInvestmentStep" :is-vertical="true" className="hidden sinvest:flex"/>*/}
            {/*<TimelineWrap :list="investmentSteps" :spacer-size="12" :step="currentInvestmentStep" :is-vertical="false" className="flex sinvest:hidden"/>*/}
            {isClosed ?
                <OfferDetailsInvestPhases offer={offer} phases={phases} active={current} isLast={isLast} refreshInvestmentPhase={feedPhases} currencies={currencies} refetchAllocation={refetchAllocation} allocation={allocation}/> :
                <OfferDetailsInvestClosed/>}

        </div>


    )
}
