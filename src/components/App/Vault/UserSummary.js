import IconMoney from "@/assets/svg/Money.svg";
import Stat from "@/components/Stat";
import IconStars from "@/assets/svg/Stars.svg";
import IconClock from "@/assets/svg/Clock.svg";
import IconNT from "@/assets/svg/NT.svg";
import RoundSpacer from "@/components/App/RoundSpacer";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import {ExternalLinks} from "@/routes";
import ReadIcon from "@/assets/svg/Read.svg";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {is3VC} from "@/lib/utils";
import Lottie from "lottie-react";
import lottieAvatar from "@/assets/lottie/avatar.json";
import { useGlitch } from 'react-powerglitch'

function amount(item){
    return item.invested;
}

function sum(prev, next){
    return prev + next;
}

export default function UserSummary({vault, account}) {
    const portfolio = Number(vault?.length>0 ? vault.map(amount).reduce(sum) : 0).toLocaleString()
    let glitch
    if(!is3VC) {
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
                            {is3VC ? <>
                                    <div className="absolute avatarAnim" style={{transform: 'translate(-50%, -50%)'}}>
                                        <Lottie animationData={lottieAvatar} loop={true} autoplay={true} style={{width: '400px'}}/>;
                                    </div>
                                    <div className={"max-w-[15rem] flex rounded-full shadow-lg"}>
                                        <img className="flex rounded-full my-auto" src={account.img}/>
                                    </div>
                                </> : <>
                                    <div className={"max-w-[15rem] flex rounded-full shadow-lg"}>
                                        {account.img ? <img className="flex rounded-full my-auto glitch" src={account.img } alt={"avatar"} ref={glitch.ref}/> : <IconNT className={"glitch w-full max-w-[15rem]"} ref={glitch.ref}/>}
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
                    <RoundSpacer title={'Vault'} subtitle={'All your investments in one place.'}
                                 action={<UniButton type={ButtonTypes.BASE} text={'Learn more'} isWide={true}
                                                      size={'text-sm sm'}
                                                      handler={()=> {window.open(ExternalLinks.VAULT, '_blank');}}
                                                      icon={<ReadIcon className={ButtonIconSize.hero}/>}/>}
                    />
                </div>
            </div>
        </>

    )
}

