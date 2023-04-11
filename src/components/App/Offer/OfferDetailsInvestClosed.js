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

export default function OfferDetailsInvestClosed({offer}) {
    // let {image, name, starts, ends} = offer


    return (
        <div className="flex flex-col flex-1 justify-center items-center relative" >
            <div>
                <div className="before:block before:absolute before:-inset-1 before:-skew-y-2 before:bg-app-success relative ">
                    <div className="relative text-black text-2xl p-5">Investment closed</div>
                </div>
            </div>
            <div className="absolute -bottom-8 ">
                {/*<lottie :width="390" :height="390" :options="lottieOptions" v-on:animCreated="handleAnimation"/>*/}
            </div>

        </div>

)
}
