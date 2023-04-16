import moment from 'moment'
import {useEffect, useRef, useState} from "react";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconWait from "@/assets/svg/Wait.svg";
import IconPantheon from "@/assets/svg/Pantheon.svg";
import IconCart from "@/assets/svg/Cart.svg";
import IconWhale from "@/assets/svg/Whale.svg";
import IconLock from "@/assets/svg/Lock.svg";
import IconCalculator from "@/assets/svg/Calculator.svg";
import WalletIcon from "@/assets/svg/Wallet.svg";
import CurrencyInput from "@/components/App/CurrencyInput";
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import {parseMaxAllocation} from "@/lib/phases/parsePhase";


export default function OfferDetailsInvestPhases({offer, phases, active, isLast, refresh, user}) {
    const [isAllocationOk, setIsAllocationOk] = useState(true)

    const {ACL, amt} = user
    const currentPhase = phases[active]
    const nextPhase = isLast ? currentPhase : phases[active+1]
    const maxAllocation = parseMaxAllocation(ACL, amt, offer, active, 400000) //todo: allocation left + useEffect

    const investButtonDisabled = currentPhase?.isDisabled || isAllocationOk

    const getButtonIcon = () => {
        switch (currentPhase.icon) {
            case "wait": {
                return <IconWait className={ButtonIconSize.invest}/>
            }
            case "vote": {
                return <IconPantheon className={ButtonIconSize.invest}/>
            }
            case "invest": {
                return <IconWhale className={ButtonIconSize.invest}/>
            }
            case "closed": {
                return <IconLock className={ButtonIconSize.invest}/>
            }
        }
    }

   const handleComplete = ()  =>{
       refresh()
    }

    return (

        <div className="flex flex-1 flex-col items-center">
            <div
                className="flex flex-col flex-wrap justify-center items-center pt-5 sinvest:flex-row sinvest:pr-5 sinvest:self-end sinvest:items-start">
                <div className="text-lg mt-3 mb-5 sinvest:mb-0 sinvest:mr-3 sinvest:mt-[0.70rem]">Phase <span className="text-gold uppercase  font-[500]">{currentPhase.step}</span> ends in</div>
                <FlipClockCountdown
                    className="flip-clock"
                    onComplete={handleComplete}
                    to={moment.unix(nextPhase.start)}
                    labels={['DAYS', 'HOURS', 'MINUTES', 'SECONDS']}
                />

            </div>
            <div className="mt-15 xl:mt-auto">
                <CurrencyInput type={'number'} placeholder={'Investment size'} max={maxAllocation} min={offer.b_alloMin} setStatus={setIsAllocationOk}/>
            </div>

            <div className="flex flex-row flex-wrap justify-center gap-2 pt-10 pb-10">
                <div className={investButtonDisabled ? 'disabled': ''}>
                <RoundButton text={currentPhase.copy} isPrimary={true} showParticles={true}
                             isLoading={false} isDisabled={true} is3d={true} isWide={true} zoom={1.1}
                             size={'text-sm sm'} icon={getButtonIcon()}/>
                </div>
                <div className="hidden sinvest:flex">
                    <RoundButton text={'Calculate'} isWide={true} zoom={1.1} size={'text-sm sm'}
                                 icon={<IconCalculator className={ButtonIconSize.hero}/>}/>
                </div>


                <div className="flex sinvest:hidden">
                    <RoundButton text={''} isWide={true} zoom={1.1} size={'text-sm icon'}
                                 icon={<IconCalculator className={ButtonIconSize.small}/>}/>
                </div>

            </div>


        </div>


    )
}
