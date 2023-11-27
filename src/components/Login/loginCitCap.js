import { useState} from "react";
import dynamic from "next/dynamic";
import HeroBg from "@/components/Home/HeroBg";
import {useAccount, useSignMessage} from "wagmi";
import {ExternalLinks} from "@/routes";
import Linker from "@/components/link";
import IconNT from "@/assets/svg/NT.svg";
import {logIn} from "@/fetchers/auth.fetcher";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import routes from "@/routes";
import {ButtonCitCapIconSize, CitCapButton} from "@/components/Button/CitCapButton";
import PlayIcon from "@/assets/svg/Play.svg";
import {useRouter} from "next/router";
const LoginModal = dynamic(() => import('@/components/SignupFlow/LoginModal'), {ssr: false})


export default function LoginCitCap({}) {
    const router = useRouter();
    const { address, isConnected  } = useAccount()
    let [errorMsg, setErrorMsg] = useState("")
    let [messageSigned, setMessageSigned] = useState(false)
    let [walletSelectionOpen, setIsWalletSelectionOpen] = useState(false)
    let [isLoginLoading, setIsLoginLoading] = useState(false)
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

    const account = useAccount({
        async onConnect({ address, connector, isReconnected }) {
            if(!messageSigned && walletSelectionOpen && address) {
                await signMessage(address)
            }
        },
    })


    const renderOptions = () => {
        return (
            <div className={"flex flex-1 justify-between flex-wrap gap-10"}>
                <div className="flex flex-col p-10 sm:p-20 w-full sm:w-max font-accent blurred glareBg bg-black lg:flex-row ">
                    <div className="flex flex-col flex-1 ">
                        <div className={"pb-2"}>Confirm your Citizenship.</div>
                        <div className={"pb-10"}><Linker url={ExternalLinks.DELEGATED_ACCESS} text={"Delegated access?"}/></div>
                        <div className="flex flex-col gap-5 justify-end flex-1 mt-10 lg:mt-0">
                            <CitCapButton text={'CONNECT'}  isLoading={isLoginLoading }  handler={() => { handleConnect()}} isWhite={true} icon={<PlayIcon className={ButtonCitCapIconSize.hero}/>}/>
                        </div>
                    </div>

                </div>
                <div className={"hidden lg:flex  items-center md:justify-end"}>
                    <IconNT className={"w-[280px] text-white"}/>
                </div>

            </div>

        )
    }

    return (
        <>
            <HeroBg subtitle={'Welcome to'} title={'Citizen Capital'} content={renderOptions()} />
            <LoginModal isPartner={false} isLoginLoading={isLoginLoading} handleConnect={handleConnect} isSignin={messageSigned} signError={errorMsg} model={walletSelectionOpen} setter={() => {setIsWalletSelectionOpen(false)}}/>
        </>
    )
}
