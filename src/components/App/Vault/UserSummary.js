import { BiMoneyWithdraw as IconMoney } from "react-icons/bi";
import { IoTimeOutline as IconClock } from "react-icons/io5";
import Stat from "@/components/Stat";
import IconStars from "@/assets/svg/Stars.svg";
import IconNT from "@/assets/svg/NT.svg";
import {isBased} from "@/lib/utils";
import Lottie from "lottie-react";
import lottieAvatar from "@/assets/lottie/avatar.json";
import { useGlitch } from 'react-powerglitch'
import FallbackImage from "@/components/App/Vault/FallbackImage";
import PremiumSummary from "@/components/App/Settings/PremiumSummary";

function amount(item){
    return item.invested;
}

function sum(prev, next){
    return prev + next;
}

export default function UserSummary({vault, session, premiumData}) {
    const portfolio = Number(vault?.length>0 ? vault.map(amount).reduce(sum) : 0).toLocaleString()
    let glitch
    if(!isBased) {
        glitch = useGlitch({
            "playMode": "always",
            "createContainers": true,
            "hideOverflow": false,
            "timing": {
                "duration": 6000
            },
            "glitchTimeSpan": {
                "start": 0.5,
                "end": 0.7
            },
            "shake": false,
            "slice": {
                "count": 6,
                "velocity": 15,
                "minHeight": 0.02,
                "maxHeight": 0.15,
                "hueRotate": true
            },
            "pulse": false
        });
    }

    return (
        <>
            <div className="grid grid-cols-12  gap-y-5 mobile:gap-y-10 mobile:gap-10">
                <div className="col-span-12 flex custom:col-span-4">
                    <div
                        className="flex flex-1 flex-col justify-center items-center">
                        <div className="relative  px-10 sm:-ml-10 custom:ml-0" >
                            {isBased ? <>
                                    <div className="absolute avatarAnim" style={{transform: 'translate(-50%, -50%)'}}>
                                        <Lottie animationData={lottieAvatar} loop={true} autoplay={true} style={{width: '400px'}}/>
                                    </div>
                                    <div className={"max-w-[15rem] flex rounded-full shadow-lg"}>
                                        <FallbackImage src={session.img} fallbackSrc={session.img_fallback} alt="Profile" />
                                    </div>
                                </> : <>
                                    <div className={"max-w-[15rem] flex rounded-full shadow-lg"}>
                                        {session.img ? <img className="flex rounded-full my-auto glitch" src={session.img } alt={"avatar"} ref={glitch.ref}/> : <div ref={glitch.ref}><IconNT className={"glitch w-full max-w-[15rem]"} /></div>}
                                    </div>
                                </>}

                        </div>
                    </div>
                </div>
                <div className="col-span-12 flex flex-col gap-10 custom:col-span-8 justify-center">

                    <div className={"w-full flex gap-5 flex-col md:flex-row "}>
                        <Stat color={"gold"} title={"Projects Invested"} value={vault ? vault.length : 0}  icon={<IconStars className={"w-9"}/>}/>
                        <Stat color={"teal"} title={"Nearest Unlock"} value={'TBA'} icon={<IconClock className={"w-7"}/>}/>
                        <Stat color={"blue"} title={"Portfolio Size"} value={`$${portfolio}`} icon={<IconMoney className={"w-7"}/>}/>
                    </div>
                    <PremiumSummary data={premiumData}/>

                </div>
            </div>
        </>

    )
}

