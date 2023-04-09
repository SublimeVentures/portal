import ArrowIcon from "@/assets/svg/Arrow.svg";
import VanillaTilt from "vanilla-tilt";
import {useEffect, useRef} from "react";
import { useSession } from "next-auth/react"

export default function Profile() {
    const { data: session } = useSession()

    const tiltAvatar = useRef(null);




    useEffect(() => {
        VanillaTilt.init(tiltAvatar.current, {scale: 1.1, speed: 1000, max: 10});
        import('@lottiefiles/lottie-player');
    }, []);


    return (
        <div
            className="flex flex-1 flex-col justify-center items-center rounded-xl bg-navy-accent py-10 sm:flex-row custom:flex-col">
            <div className="relative  px-10 sm:-ml-10 custom:ml-0" ref={tiltAvatar}>
                <div className="absolute avatarAnim" style={{transform: 'translate(-50%, -50%)'}}>
                    <lottie-player
                        autoplay
                        loop
                        style={{width: '390px'}}
                        mode="normal"
                        src="/static/lottie/avatar.json"
                    />
                </div>
                {session?.user ? (
                    <img className="rounded-full shadow-lg h-[14rem] w-[14rem]" src={session.user.img}/>
                ) : (
                    <lottie-player
                        autoplay
                        loop
                        style={{width: '390px'}}
                        mode="normal"
                        src="/static/lottie/loading.json"
                    />
                )}

            </div>
            <div className="flex flex-col justify-center items-center pt-10 sm:pt-0 custom:pt-10">
                <div>Portfolio Size</div>
                <div className="font-bold text-3xl mt-1">$41 000</div>
                <div className="flex flex-row gap-5 justify-center items-center mt-3">
                    <div>
                        <div
                            className="bg-app-success2 rounded-3xl text-black px-2 py-1 text-sm font-bold" >+12.34%
                        </div>
                    </div>
                    <div
                        className="bg-app-success2 rounded-full text-black px-2 py-1 text-sm rotate-180 h-10 w-10 flex justify-center items-center">
                        <ArrowIcon className="w-5 rotate-45"/>
                    </div>
                </div>
            </div>
        </div>
    )
}
