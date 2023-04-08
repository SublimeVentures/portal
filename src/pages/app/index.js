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
import LatestInvestment from "@/components/App/Dashboard/LatestInvestment";
import Updates from "@/components/App/Dashboard/Updates";


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
            <div className="grid grid-cols-12  gap-y-10 mobile:gap-10">
                    <div className="col-span-12 flex flex-col gap-10 custom:col-span-8">
                        <RoundBanner title={'Swim safely!'} subtitle={'All our investments are insured!'}
                                     action={<RoundButton text={'Learn more'} isWide={true} zoom={1.1}
                                                          size={'text-sm sm'}
                                                          icon={<ReadIcon className={ButtonIconSize.hero} />}/>}/>
                        <Stats/>
                    </div>
                    <div className="col-span-12 flex custom:col-span-4">
                        <Profile/>
                    </div>

            </div>


            <div className="grid grid-cols-12 flex flex-1 gap-y-10 mobile:gap-10">
                <div className="col-span-12 flex flex-1 custom:col-span-8 ">
                    <LatestInvestment/>
                </div>
                <div className="col-span-12 custom:col-span-4 flex">
                    <Updates/>
                </div>
            </div>


        </>

)
}


AppDashboard.getLayout = function(page)
    {
        return <LayoutApp>{page}</LayoutApp>;
    }
;
