import VanillaTilt from "vanilla-tilt";
import moment from 'moment'
import {useEffect, useRef} from "react";
import OfferDetailsProgress from "@/components/App/Offer/OfferDetailsProgress";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconPantheon from "@/assets/svg/Pantheon.svg";
import IconCart from "@/assets/svg/Cart.svg";
import IconLock from "@/assets/svg/Lock.svg";
import IconCalculator from "@/assets/svg/Calculator.svg";
import WalletIcon from "@/assets/svg/Wallet.svg";
import OfferDetailsInvestPhases from "@/components/App/Offer/OfferDetailsInvestPhases";
import OfferDetailsInvestClosed from "@/components/App/Offer/OfferDetailsInvestClosed";

export default function OfferDetailsParams({offer}) {
    // let {image, name, starts, ends} = offer

    const currentInvestmentStep = 1
    const investmentSteps = [
        {step: 'Vote', action: "Pledge", date: '2022-10-15', icon: "vote"},
        //todo: fcfs
        {step: 'Open', action: "Invest", date: '2022-10-15', icon: "open"},
        {step: 'Closed', action: "Closed", date: '2022-10-15', icon: "closed", extraClass: '-mt-1'},
    ]


    const isClosed = () => {
        return currentInvestmentStep !== 2
    }

    return (

        <div className="flex flex-1 flex-col min-h-[300px] ">
            {/*<TimelineWrap :list="investmentSteps" :spacer-size="12" :step="currentInvestmentStep" :is-vertical="true" className="hidden sinvest:flex"/>*/}
            {/*<TimelineWrap :list="investmentSteps" :spacer-size="12" :step="currentInvestmentStep" :is-vertical="false" className="flex sinvest:hidden"/>*/}
            {isClosed() ? <OfferDetailsInvestPhases phases={investmentSteps} active={currentInvestmentStep}/> :
                <OfferDetailsInvestClosed/>}

        </div>


    )
}
