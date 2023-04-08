import {useState} from "react";
import dynamic from "next/dynamic";
import HeroBg from "@/components/Home/HeroBg";
import Link from "next/link";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import PartnerSlide from "@/components/SignupFlow/PartnerSlide";
const LoginModal = dynamic(() => import('@/components/SignupFlow/LoginModal'), {ssr: false,})
import {dehydrate, QueryClient, useQuery} from "@tanstack/react-query";
import {fetchPartners} from "@/fetchers/public";
import { Slider3D } from 'react-slider-3d';
import { getServerSession } from "next-auth/next"
import {useAccount, useNetwork, useSignMessage} from "wagmi";
import {SiweMessage} from "siwe";
import { useRouter } from 'next/router';
import {getCsrfToken, signIn} from "next-auth/react";
import RocketIcon from "@/assets/svg/Rocket.svg";
import WalletIcon from "@/assets/svg/Wallet.svg";
//todo: store
export default function Login() {
    const { isLoading, error, data, isFetching, isError } = useQuery({
            queryKey: ["partnerList"],
            queryFn: fetchPartners,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            staleTime: 144000
        }
    );
    const router = useRouter();
    const { signMessageAsync } = useSignMessage()
    const { chain } = useNetwork()
    const { address, connector, isConnected  } = useAccount()
    let [errorMsg, setErrorMsg] = useState("")
    let [messageSigned, setMessageSigned] = useState(false)
    let [isPartnerLogin, setIsPartnerLogin] = useState(false)
    let [walletSelectionOpen, setIsWalletSelectionOpen] = useState(false)


    const signMessage = async (forcedAddress) => {
        setMessageSigned(true)
        try {
            const message = new SiweMessage({
                domain: window.location.host,
                address: forcedAddress? forcedAddress : address,
                statement: "INVEST GROUND FLOOR\n" +
                    "DON'T BE EXIT LIQUIDITY",
                uri: window.location.origin,
                version: "1",
                chainId: chain?.id,
                nonce: await getCsrfToken(),
            })
            const signature = await signMessageAsync({
                message: message.prepareMessage(),
            })

            const callbackUrl= router.query.callbackUrl;
            await signIn("credentials", {
                message: JSON.stringify(message),
                redirect: true,
                signature,
                callbackUrl: callbackUrl ?? '/app'
            })
        } catch (error) {
            setMessageSigned(false)
            setErrorMsg(error.message)
        }
    }


    const handleConnect = async (isPartner) => {
        if(address && isConnected) {
            await signMessage()
            return;
        }

        setIsPartnerLogin(isPartner)
        setIsWalletSelectionOpen(true)
    }

    const account = useAccount({
        async onConnect({ address, connector, isReconnected }) {
            console.log('Connected login change', { address, connector, isReconnected })
            if(!messageSigned && walletSelectionOpen && address) {
                await signMessage(address)
            }
        },
    })




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
                        <RoundButton text={'Connect'} isLoading={false} isDisabled={false} is3d={false} isWide={true} zoom={1.1} size={'text-sm sm'} icon={<WalletIcon className={ButtonIconSize.hero}/> } handler={() => handleConnect(false)} />

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
                        <RoundButton text={'Connect'} isLoading={false} isDisabled={false} is3d={false} isWide={true} zoom={1.1} size={'text-sm sm'} icon={<WalletIcon className={ButtonIconSize.hero}/> } handler={() => handleConnect(true)} />

                    </div>
                </div>

            </div>
        )
    }

    return (
        <>
            <HeroBg subtitle={'Welcome'} title={'sing with whales'} content={renderOptions()} />
            <LoginModal isPartner={isPartnerLogin} signError={errorMsg} model={walletSelectionOpen} setter={() => {setIsWalletSelectionOpen(false)}}/>
        </>
    )
}

export const getServerSideProps = async(context) => {
    const session = await getServerSession(context.req, context.res)
    if(session){
        return {
            redirect: {
                permanent: false,
                destination: "/app"
            }
        }
    }

    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({queryKey: ["partnerList"], queryFn: fetchPartners})
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            csrfToken: await getCsrfToken(context),
        }
    }
}
