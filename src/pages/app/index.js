
import LayoutApp from '@/components/Layout/LayoutApp';
import {getServerSession} from "next-auth/next";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import RoundContainer from "@/components/App/RoundContainer";
import RoundBanner from "@/components/App/RoundBanner";
import WalletIcon from "@/svg/Wallet.svg";
import ReadIcon from "@/svg/Read.svg";
import BitcoinIcon from "@/svg/Bitcoin.svg";
import KeyIcon from "@/svg/Key.svg";
import ArrowIcon from "@/svg/Arrow.svg";
import ChartIcon from "@/svg/Chart.svg";
import RocketIcon from "@/svg/Rocket.svg";
import VanillaTilt from "vanilla-tilt";
import {useEffect, useRef} from "react";

// export const getServerSideProps = async(context) => {
//     const session = await getServerSession(context.req, context.res)
//     console.log("seesion", session)
//     if(!session){
//         return {
//             redirect: {
//                 permanent: false,
//                 destination: "/login"
//             }
//         }
//     }
//
// }

export default function ProtectedApp() {
    const tiltAvatar = useRef(null);
    const tiltOffer = useRef(null);

    const investmentActive = true

    const offerTiltData = () => {
        if (true) return {scale: 1.01, speed: 1000, max: 5}
        else return {scale: 1, max: 0}
    }

    const openNFT = () => {

    }

    useEffect(() => {
        VanillaTilt.init(tiltAvatar.current, {scale: 1.1, speed: 1000, max: 10});
        VanillaTilt.init(tiltOffer.current, offerTiltData);
    }, []);

    const projectInvestedWidget = () => {
        return (<>
            <div className="font-bold text-3xl">3</div>
            <div className="text-sm capitalize mt-2">Project invested</div>
        </>)
    }

    const stakeLeftWidget = () => {
        return (<>
            <div className="font-bold text-3xl">$41 000</div>
            <div className="text-sm capitalize mt-2">stake left</div>
        </>)
    }

    const apyWidget = () => {
        return (<>
            <div className="font-bold text-3xl">TBD</div>
            <div className="text-sm capitalize mt-2">APY</div>
        </>)
    }

    return (
        <div className="flex flex-col w-full min-h-screen p-5 text-app-white f-montserrat ">
            <div className="flex flex-col tablet:flex-row">
                <div className="flex flex-col flex-1">
                    <div className="sm:p-5">
                        <RoundBanner title={'Swim safely!'} subtitle={'All our investments are insured!'}
                                     action={<RoundButton text={'Learn more'} isWide={true} zoom={1.1}
                                                          size={'text-sm sm'}
                                                          icon={<ReadIcon className={ButtonIconSize.hero}/>}/>}/>

                    </div>
                    <div className="grid grid-cols-1 w-full pt-5 gap-5 sm:grid-cols-12 sm:gap-0">
                        <div className="col-span-4 py-5 sm:p-5 flex items-end ">
                            <RoundContainer isSuccess={true} icon={<BitcoinIcon className="w-14 -mt-2"/>}
                                            content={projectInvestedWidget()}/>
                            {/*<CommonRoundContainer :is-success="true" className="h-[150px]">*/}
                        </div>
                        <div className="col-span-4  py-5 sm:p-5 flex items-end">
                            <RoundContainer isSuccess={false} icon={<KeyIcon className="w-10 -mt-2"/>}
                                            content={stakeLeftWidget()}/>
                            {/*<CommonRoundContainer :is-success="false" className="h-[150px]">*/}
                        </div>
                        <div className="col-span-4  py-5 sm:p-5 flex items-end">
                            <RoundContainer isSuccess={false} icon={<ChartIcon className="w-10 -mt-2"/>}
                                            content={apyWidget()}/>
                            {/*<CommonRoundContainer :is-success="false" className="h-[150px]">*/}

                        </div>
                    </div>
                </div>
                <div className="flex flex-1 pb-5 sm:p-5 overflow-hidden tablet:max-w-[30%]">
                    <div
                        className="rounded-xl bg-navy-accent flex flex-1 justify-center items-center flex-col sm:gap-10 sm:flex-row tablet:flex-col tablet:gap-0">
                        <div className="relative cursor-pointer p-10 sm:p-5 tablet:p-0" ref={tiltAvatar}>
                            <div className="absolute avatarAnim" style={{transform: 'translate(-50%, -50%)'}}>
                                {/*<lottie :width="390" :height="390" :options="lottieOptions" v-on:animCreated="handleAnimation" />*/}
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
                </div>
            </div>

            <div className="sm:m-5 rounded-xl bg-navy-accent flex flex-1 tablet:max-h-[400px] min-h-[300px]">
                <div className="min-w-[500px] flex-col flex flex-1 pt-5 sm:pt-0 sm:pl-5 tablet:flex-none sm:flex-row">
                    {/*<TimelineWrap :list="investmentSteps" :spacer-size="12" :step="currentInvestmentStep" :is-vertical="true" className="hidden sm:flex"/>*/}
                    {/*<TimelineWrap :list="investmentSteps" :spacer-size="12" :step="currentInvestmentStep" :is-vertical="false" className="flex sm:hidden"/>*/}
                    <div className="flex flex-col justify-center items-center mx-auto pb-5 sm:pb-0">
                        <div className="text-2xl font-bold text-accent pt-5 sm:pt-0">Heroes of Mavia</div>
                        <div className="flex flex-col flex-wrap justify-center items-center pb-5">
                            {/*<div className="text-xl font-bold mt-1 mb-2 sm:mb-0 whitespace-nowrap">{{ investmentSteps[currentInvestmentStep].step }} ends in</div>*/}
                            {/*<client-only>*/}
                            {/*    <div className="forceWhite">*/}
                            {/*        <FlipCountdown deadline="2025-12-25 00:00:00"></FlipCountdown>*/}
                            {/*    </div>*/}
                            {/*</client-only>*/}
                        </div>
                        <RoundButton text={'Read more'} isWide={true} size={'text-sm sm'}
                                     icon={<RocketIcon className={ButtonIconSize.hero}/>}/>

                    </div>
                </div>
                <div className="rounded-tr-xl rounded-br-xl flex-1 p-5 cursor-pointer product hidden tablet:flex"
                     ref={tiltOffer}>
                    <div
                        className={` flex flex-1 w-full h-full ${ !investmentActive && 'blur-sm brightness-75'} `}></div>
                </div>
            </div>
            <div className="mt-5 sm:m-5 rounded-xl bg-navy-accent flex flex-1 tablet:max-h-[400px] min-h-[300px]  tablet:hidden">
                <div className="rounded-xl  flex-1 p-5 cursor-pointer product" ref={tiltOffer}>
                    <div className={` flex flex-1 w-full h-full ${!investmentActive && 'blur-sm brightness-75'} `}></div>
                </div>
            </div>


        </div>

)
}


ProtectedApp.getLayout = function(page)
    {
        return <LayoutApp>{page}</LayoutApp>;
    }
;
