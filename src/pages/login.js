import HeroBg from "@/components/Home/HeroBg";
import Link from "next/link";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import RocketIcon from "@/svg/Rocket.svg";
import PartnerSlide from "@/components/SignupFlow/PartnerSlide";
import LoginModal from "@/components/SignupFlow/LoginModal";
import {dehydrate, QueryClient, useQuery} from "@tanstack/react-query";
import {fetchPartners} from "@/fetchers/public";
import { Slider3D } from 'react-slider-3d';
export const getServerSideProps = async() => {
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({queryKey: ["partnerList"], queryFn: fetchPartners})
    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        }
    }
}

//todo: store
//todo: login button
export default function InvestmentsPublic() {
    const { isLoading, error, data, isFetching, isError } = useQuery({
            queryKey: ["partnerList"],
            queryFn: fetchPartners,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            staleTime: 144000
        }
    );



    const renderOptions = () => {
        if(isLoading) {
            return;
        }
        if(isError) {
            return;
        }
        return (
            <div className="flex flex-col p-10 gap-10 w-full blurred glareBg rounded-xl f-montserrat lg:flex-row ">
                <div className="flex flex-col flex-1">
                    <div className="text-3xl font-bold">3VC Whale</div>
                    <div className="pt-3">3VC was formed to provide the best opportunities for serious web3 investors. Whale pass get
                        you access to the investment before everyone else.
                        <span className="font-bold">Mint soon 👀</span>
                    </div>
                    <div className="flex flex-col gap-5 justify-end flex-1 mt-10 lg:mt-0">
                        <div className="my-auto disabled">
                            <Link href="/">
                                <RoundButton text={'Join Whale Club'} isLoading={false} isDisabled={false} showParticles={true} is3d={true} isPrimary={true} isWide={true} zoom={1.1} size={'text-sm sm'} icon={<RocketIcon className={ButtonIconSize.hero}/>}/>
                            </Link>
                        </div>
                        <LoginModal isPartner={false}/>
                    </div>

                </div>
                <div className="hidden w-px h-full barVer lg:block"></div>
                <div className="my-10 h-px w-full barHor lg:hidden"></div>
                <div className="flex flex-col flex-1">
                    <div className="text-3xl font-bold">Partners</div>
                    <div className="pt-3">Login and participate in investment with our partners.<br/>
                        <a href="https://delegate.cash">Don't want connect your cold wallet?</a>
                    </div>

                    <div className=" pt-5 pb-5 gap-5  smallSlider">
                        <Slider3D
                            width={200}
                            height={150}
                            autoplay={true}
                            autoplayTimeout={1500}
                            border={0}
                            autoplayHoverPause={true}
                            loop={true}
                            controlsVisible={false}
                            items={data.map((el, i) => {
                                return (<PartnerSlide logo={el.logo} name={el.name}  key={i}/>)
                            })}
                            display={3}
                            startIndex={1}
                        >
                        </Slider3D>
                    </div>

                    <div className="flex flex-1 mx-auto items-end mt-5 lg:mt-0">
                        <LoginModal isPartner={true}/>

                    </div>
                </div>

            </div>
    )
    }

    return (
        <>
            <HeroBg subtitle={'Welcome'} title={'sing with whales'} content={renderOptions()} />
        </>
    )
}

