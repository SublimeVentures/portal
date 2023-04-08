import LayoutApp from '@/components/Layout/LayoutApp';
import {getServerSession} from "next-auth/next";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import RoundBanner from "@/components/App/RoundBanner";
import ReadIcon from "@/assets/svg/Read.svg";
import RocketIcon from "@/assets/svg/Rocket.svg";
import VanillaTilt from "vanilla-tilt";
import {useEffect, useRef} from "react";
import Stats from "@/components/App/Dashboard/Stats";
import Profile from "@/components/App/Dashboard/Profile";


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

//todo: project's updates updates
export default function AppDashboard() {
    const tiltOffer = useRef(null);

    const investmentActive = true

    const offerTiltData = () => {
        if (true) return {scale: 1.01, speed: 1000, max: 5}
        else return {scale: 1, max: 0}
    }

    useEffect(() => {
        VanillaTilt.init(tiltOffer.current, offerTiltData);
    }, []);


    return (
        <>
            <div className="flex flex-col tablet:flex-row">
                <div className="flex flex-col flex-1">
                    <div className="sm:p-5">
                        <RoundBanner title={'Swim safely!'} subtitle={'All our investments are insured!'}
                                     action={<RoundButton text={'Learn more'} isWide={true} zoom={1.1}
                                                          size={'text-sm sm'}
                                                          icon={<ReadIcon className={ButtonIconSize.hero} />}/>}/>
                    </div>
                    <div className="grid grid-cols-1 w-full pt-5 gap-5 sm:grid-cols-12 sm:gap-0">
                        <Stats/>
                    </div>
                </div>
                <div className="flex flex-1 pb-5 sm:p-5 overflow-hidden tablet:max-w-[30%]">
                    <Profile/>
                </div>
            </div>

            <div  className="flex flex-col tablet:flex-row min-h-[300px] flex-1">
                <div className="flex flex-1 flex-col bg-navy-accent m-5 rounded-xl">ww</div>
                <div className="flex flex-1 flex-col bg-navy-accent m-5 rounded-xl tablet:max-w-[30%]"></div>
            </div>

            {/*<div className="sm:m-5 rounded-xl bg-navy-accent flex flex-1 tablet:max-h-[400px] min-h-[300px]">*/}
            {/*    <div className="min-w-[500px] flex-col flex flex-1 pt-5 sm:pt-0 sm:pl-5 tablet:flex-none sm:flex-row">*/}
            {/*        /!*<TimelineWrap :list="investmentSteps" :spacer-size="12" :step="currentInvestmentStep" :is-vertical="true" className="hidden sm:flex"/>*!/*/}
            {/*        /!*<TimelineWrap :list="investmentSteps" :spacer-size="12" :step="currentInvestmentStep" :is-vertical="false" className="flex sm:hidden"/>*!/*/}
            {/*        <div className="flex flex-col justify-center items-center mx-auto pb-5 sm:pb-0">*/}
            {/*            <div className="text-2xl font-bold pt-5 sm:pt-0">Heroes of Mavia</div>*/}
            {/*            <div className="flex flex-col flex-wrap justify-center items-center pb-5">*/}
            {/*                /!*<div className="text-xl font-bold mt-1 mb-2 sm:mb-0 whitespace-nowrap">{{ investmentSteps[currentInvestmentStep].step }} ends in</div>*!/*/}
            {/*                /!*<client-only>*!/*/}
            {/*                /!*    <div className="forceWhite">*!/*/}
            {/*                /!*        <FlipCountdown deadline="2025-12-25 00:00:00"></FlipCountdown>*!/*/}
            {/*                /!*    </div>*!/*/}
            {/*                /!*</client-only>*!/*/}
            {/*            </div>*/}
            {/*            <RoundButton text={'Read more'} isWide={true} size={'text-sm sm'}*/}
            {/*                         icon={<RocketIcon className={ButtonIconSize.hero}/>}/>*/}

            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="rounded-tr-xl rounded-br-xl flex-1 p-5 cursor-pointer product hidden tablet:flex"*/}
            {/*         ref={tiltOffer}>*/}
            {/*        <div*/}
            {/*            className={` flex flex-1 w-full h-full ${ !investmentActive && 'blur-sm brightness-75'} `}></div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<div className="mt-5 sm:m-5 rounded-xl bg-navy-accent flex flex-1 tablet:max-h-[400px] min-h-[300px]  tablet:hidden">*/}
            {/*    <div className="rounded-xl  flex-1 p-5 cursor-pointer product" ref={tiltOffer}>*/}
            {/*        <div className={` flex flex-1 w-full h-full ${!investmentActive && 'blur-sm brightness-75'} `}></div>*/}
            {/*    </div>*/}
            {/*</div>*/}


        </>

)
}


AppDashboard.getLayout = function(page)
    {
        return <LayoutApp>{page}</LayoutApp>;
    }
;
