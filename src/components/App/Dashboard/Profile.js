import ArrowIcon from "@/assets/svg/Arrow.svg";
import VanillaTilt from "vanilla-tilt";
import {useEffect, useRef} from "react";

export default function Profile({isSuccess, icon, content}) {
    const tiltAvatar = useRef(null);
    const ref = useRef(null);

    const openNFT = () => {

    }


    useEffect(() => {
        VanillaTilt.init(tiltAvatar.current, {scale: 1.1, speed: 1000, max: 10});
        import('@lottiefiles/lottie-player');
    }, []);


    return (
        <div
            className="rounded-xl bg-navy-accent flex flex-1 justify-center items-center flex-col sm:gap-10 sm:flex-row tablet:flex-col tablet:gap-0">
            <div className="relative cursor-pointer p-10 sm:p-5 tablet:p-0" ref={tiltAvatar}>
                <div className="absolute avatarAnim" style={{transform: 'translate(-50%, -50%)'}}>
                    <lottie-player
                        ref={ref}
                        autoplay
                        loop
                        style={{width: '390px'}}
                        mode="normal"
                        src="/static/lottie/avatar.json"
                    />
                </div>
                <img className="w-27 h-27 rounded-full shadow-lg" onClick={openNFT}
                     src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=80"/>
            </div>
            <div className="flex flex-col justify-center items-center pb-10 sm:pb-0">
                <div className="sm:mt-7 mb-1">Portfolio Size</div>
                <div className="font-bold text-3xl">$41 000</div>
                <div className="flex flex-row gap-5 justify-center items-center mt-3">
                    <div>
                        <div
                            className="bg-app-success2 rounded-3xl text-black px-2 py-1 text-sm font-bold">+12.34%
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
