import {useEffect} from "react";
import IconMoney from "@/assets/svg/Money.svg";
import VanillaTilt from "vanilla-tilt";
import {useRef} from "react";
import Stat from "@/components/Stat";
import IconStars from "@/assets/svg/Stars.svg";
import IconClock from "@/assets/svg/Clock.svg";
import RoundSpacer from "@/components/App/RoundSpacer";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import {ExternalLinks} from "@/routes";
import ReadIcon from "@/assets/svg/Read.svg";

function amount(item){
    return item.invested;
}

function sum(prev, next){
    return prev + next;
}

export default function UserSummary({vault, account}) {
    const tiltAvatar = useRef(null);
    const portfolio = Number(vault?.length>0 ? vault.map(amount).reduce(sum) : 0).toLocaleString()


    useEffect(() => {
        VanillaTilt.init(tiltAvatar.current, {scale: 1.1, speed: 1000, max: 10});
    }, []);

    return (
        <>
            <div className="grid grid-cols-12  gap-y-5 mobile:gap-y-10 mobile:gap-10">
                <div className="col-span-12 flex custom:col-span-4">
                    <div
                        className="flex flex-1 flex-col justify-center items-center">
                        <div className="relative  px-10 sm:-ml-10 custom:ml-0" ref={tiltAvatar}>
                            <div className="absolute avatarAnim" style={{transform: 'translate(-50%, -50%)'}}>
                                <lottie-player
                                    autoplay
                                    loop
                                    style={{width: '400px'}}
                                    mode="normal"
                                    src="/static/lottie/avatar.json"
                                />
                            </div>
                                <div className={"max-w-[15rem] flex rounded-full shadow-lg"}>
                                    <img className="flex rounded-full my-auto" src={account.img}/>
                                </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-12 flex flex-col gap-10 custom:col-span-8 justify-center">

                    <div className={"w-full flex gap-5 flex-col md:flex-row"}>
                        <Stat color={"gold"} title={"Projects Invested"} value={vault ? vault.length : 0}  icon={<IconStars className={"w-9"}/>}/>
                        <Stat color={"teal"} title={"Nearest Unlock"} value={'TBA'} icon={<IconClock className={"w-7"}/>}/>
                        <Stat color={"blue"} title={"Portfolio Size"} value={`$${portfolio}`} icon={<IconMoney className={"w-7"}/>}/>
                    </div>
                    <RoundSpacer title={'Vault'} subtitle={'All your investments in one place.'}
                                 action={<RoundButton text={'Learn more'} isWide={true}
                                                      size={'text-sm sm'}
                                                      handler={()=> {window.open(ExternalLinks.VAULT, '_blank');}}
                                                      icon={<ReadIcon className={ButtonIconSize.hero}/>}/>}
                    />
                </div>
            </div>
        </>

    )
}

