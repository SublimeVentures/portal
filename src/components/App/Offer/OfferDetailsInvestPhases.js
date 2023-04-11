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
import CurrencyInput from "@/components/App/CurrencyInput";
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';




export default function OfferDetailsInvestPhases({phases, active}) {

    const getButtonIcon = () => {
        switch (active) {
            case 0: {
                return <IconPantheon className={ButtonIconSize.invest}/>
            }
            case 1: {
                return <IconCart className={ButtonIconSize.invest}/>
            }
            case 2: {
                return <IconLock className={ButtonIconSize.invest}/>
            }
        }
    }

   const handleComplete = ()  =>{
        // this.setState({ isCompleted: true });
    }

    return (

        <div className="flex flex-1 flex-col items-center">
            <div
                className="flex flex-col flex-wrap justify-center items-center pt-5 sinvest:flex-row sinvest:pr-5 sinvest:self-end sinvest:items-start">

                <div className="text-lg mt-3 mb-5 sinvest:mb-0 sinvest:mr-3 sinvest:mt-[0.70rem]">Phase <span className="text-gold uppercase  font-[500]">{phases[active].step}</span> ends in</div>
                <FlipClockCountdown
                    className="flip-clock"
                    onComplete={handleComplete}
                    to={new Date().getTime() + 24 * 3600 * 1000 + 5000}
                    labels={['DAYS', 'HOURS', 'MINUTES', 'SECONDS']}
                />

            </div>
            <div className="mt-15 xl:mt-auto">
                <CurrencyInput type={'number'} placeholder={'Investment size'} max={10000000} min={10000}/>
            </div>

            <div className="flex flex-row flex-wrap justify-center gap-2 pt-10 pb-10">
                <RoundButton text={phases[active].action} isPrimary={true} showParticles={true}
                             isLoading={false} isDisabled={false} is3d={true} isWide={true} zoom={1.1}
                             size={'text-sm sm'} icon={getButtonIcon()}/>
                <div className="hidden sinvest:flex">
                    <RoundButton text={'Calculate'} isWide={true} zoom={1.1} size={'text-sm sm'}
                                 icon={<WalletIcon className={ButtonIconSize.hero}/>}/>
                </div>
                <div className="flex sinvest:hidden">
                    <RoundButton text={''} isWide={true} zoom={1.1} size={'text-sm icon'}
                                 icon={<WalletIcon className={ButtonIconSize.small}/>}/>
                </div>

            </div>


        </div>


    )
}
