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

    return (

        <div className="flex flex-1 flex-col justify-end items-center px-5 py-10 sinvest:p-10">
            <div
                className="flex flex-col flex-wrap justify-center items-center mb-5 sm:gap-5 sinvest:mb-0 sinvest:items-start sinvest:flex-row sinvest:absolute sinvest:top-5 sinvest:right-5">
                <div
                    className="text-xl font-bold mt-1 mb-2 sm:mb-0 whitespace-nowrap">{phases[active].step} ends
                    in
                </div>
                {/*        <client-only>*/}
                {/*            <div className="" :className="{'forceWhite': front}">*/}
                {/*            <FlipCountdown deadline="2025-12-25 00:00:00"></FlipCountdown>*/}
                {/*    </div>*/}

                {/*</client-only>*/}
            </div>
            {/*    <CommonCurrencyInput :type="'number'" :max="10000000" :min="10000" :currency="'USDT'"*/}
            {/*:placeholder="'Investment size'" className=""/>*/}
            <CurrencyInput type={'number'} placeholder={'Investment size'} max={10000000} min={10000} currency={'USDT'}/>

            <div className="flex flex-row  gap-2 sinvest:gap-10 pt-10">


                <RoundButton text={phases[active].action} isPrimary={true} showParticles={true}
                             isLoading={false} isDisabled={false} is3d={true} isWide={true} zoom={1.1}
                             size={'text-sm sm'} icon={getButtonIcon()}/>
                <div className="hidden invest:flex">
                    <RoundButton text={'Calculate'} isWide={true} zoom={1.1} size={'text-sm sm'}
                                 icon={<WalletIcon className={ButtonIconSize.hero}/>}/>
                </div>
                <div className="flex invest:hidden">
                    <RoundButton text={''} isWide={true} zoom={1.1} size={'text-sm icon'}
                                 icon={<WalletIcon className={ButtonIconSize.small}/>}/>

                </div>

            </div>


        </div>


    )
}
