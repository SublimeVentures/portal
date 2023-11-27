import {useRouter} from 'next/router'
import PlayIcon from "@/assets/svg/Play.svg";
import {ButtonCitCapIconSize, CitCapButton} from "@/components/Button/CitCapButton";
import dynamic from "next/dynamic";
import {useState} from "react";
import {useAccount, useSignMessage} from "wagmi";
import moment from "moment";
import {v4 as uuidv4} from "uuid";
import {logIn} from "@/fetchers/auth.fetcher";
import routes from "@/routes";
const LoginModal = dynamic(() => import('@/components/SignupFlow/LoginModal'), {ssr: false})

export default function Hero({account}) {
    const router = useRouter()
    const { address, isConnected  } = useAccount()

    let [isLoginLoading, setIsLoginLoading] = useState(false)
    let [messageSigned, setMessageSigned] = useState(false)
    let [errorMsg, setErrorMsg] = useState("")
    let [walletSelectionOpen, setIsWalletSelectionOpen] = useState(false)
    const { error, isLoading: isLoadingSignature, signMessageAsync:sign, variables } = useSignMessage()

    const signMessage = async (forcedAddress) => {
        setIsLoginLoading(true)
        setMessageSigned(true)
        try {
            const time = moment.utc().unix();
            const nonce = uuidv4();
            const message = "INVEST EARLY\n" +
                `INVEST WITH THE CITADEL\n\n` +
                `DOMAIN: ${window.location.host.replace("www.", "")}\n` +
                `TIME: ${time}\n` +
                `NONCE: ${nonce}`
            const signature = await sign({message})

            const callbackUrl = router.query.callbackUrl;
            const isAuth = await logIn(message, signature)
            if(isAuth?.accessToken) {
                router.push(callbackUrl ? callbackUrl : routes.App)
            } else {
                router.push({
                    pathname: routes.Login,
                    query: {error: "CredentialsSignin"}
                })
                setMessageSigned(false)
                setIsLoginLoading(false)
            }

        } catch (error) {
            setMessageSigned(false)
            setErrorMsg(error.message)
            setIsLoginLoading(false)

        }
    }


    const handleConnect = async () => {
        if(isLoginLoading) return;

        if(address && isConnected) {
            await signMessage()
            return;
        }

        setIsWalletSelectionOpen(true)
    }


    return (
        <div className="min-h-screen bg flex flex-col justify-center hero select-none">
            <div className="flex flex-col w-full md:max-w-[80%] md:mx-auto xl:max-w-[1200px]">
                <div className="flex flex-col p-10 text-white font-medium md:max-w-[600px] md:justify-center">
                    <div className={`font-accent ml-1 text-base mb-1`}>OFFICIAL INVESTMENT ARM OF NEO TOKYO</div>
                    <div className="text-hero">
                        <h2 className="heroFont  glitch layers font-bold" data-text="CITIZEN CAPITAL">
                            CITIZEN CAPITAL
                        </h2>
                    </div>
                </div>

                <div
                    className="flex mx-auto mt-10 md:mt-0 md:items-center md:p-10 md:left-0 md:right-0 md:absolute md:bottom-20 md:mx-auto md:justify-center">
                        <div className={"w-[300px] flex flex-col"}>
                            <CitCapButton text={'CONNECT'} isLoading={isLoginLoading} handler={() => { handleConnect(false)}} isWhite={true} icon={<PlayIcon className={ButtonCitCapIconSize.hero}/>}/>
                            {/*<CitCapGlitchButton text={'_CONNECT'} isLarge={true} state={CitCaGlitchButtonState.hero}/>*/}
                        </div>
                </div>
            </div>
            <LoginModal isPartner={false} isLoginLoading={isLoginLoading} handleConnect={handleConnect} isSignin={messageSigned} signError={errorMsg} model={walletSelectionOpen} setter={() => {setIsWalletSelectionOpen(false)}}/>

        </div>)

}
