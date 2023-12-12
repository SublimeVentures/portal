import {ButtonIconSize} from "@/components/Button/RoundButton";
import GenericModal from "@/components/Modal/GenericModal";
import Image from "next/image";

import {useAccount, useConnect} from 'wagmi'
import Linker from "@/components/link";
import {ExternalLinks} from "@/routes";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {isBased} from "@/lib/utils";

export default function LoginModal({isPartner, isLoginLoading, handleConnect, isSignin, signError, model, setter}) {
    const { connect, connectors, error, pendingConnector, isLoading } = useConnect()
    const { connector: activeConnector } = useAccount()
    //
    // console.log("===============")
    // console.log("error",error)
    // console.log("pendingConnector",pendingConnector)
    // console.log("isLoading",isLoading)
    // console.log("messageSigned",isSignin)
    // console.log("===============")

    const buttonIsDisabled = (connector) => !connector.ready || isLoading || isSignin
    const buttonHandler = (connector) => {
        if(!isLoading) {
            if(activeConnector) {
                handleConnect()
            } else {
                connect({ connector })
            }
        }
    }

    const title = () => {
        return (<span className={!isBased && `text-app-error`}>Connect Wallet {isBased && <span className="text-gold">{isPartner ? "Partners" : "Whale"}</span>}</span>)
    }

    const content = () => {
        return (<> <div className="pb-10 font-accent">
            Don't want to connect your cold wallet? You can delegate access! <Linker url={ExternalLinks.DELEGATED_ACCESS} />
        </div>
            <div className="flex flex-col gap-5 fullWidth">
                {connectors.filter(connector => !(connector.id === "injected" && connector.name === "MetaMask"))
                    .map((connector) => (

                    <UniButton
                        type={ButtonTypes.BASE}
                        key={connector.id}
                        handler={async ()=> {buttonHandler(connector)}}
                        text={connector.name}
                        isWide={true}
                        zoom={1.05}
                        state={"min-w-[300px] mx-auto"}
                        size={'text-sm sm'}
                        isLoading={connector.id === pendingConnector?.id && !error && isLoginLoading  }
                        isLoadingWithIcon={true}
                        isDisabled={buttonIsDisabled(connector)}
                        icon={<Image src={`/img/login/${connector.name}.png`} width={32} height={32} alt={connector.name} className={ButtonIconSize.hero}/>}
                    />

                ))}
            </div>
            <div className="-mb-2 mt-2 text-center text-app-error h-[10px]">{signError?.length>0 ? signError : (error ? error.message : "")}</div>
        </>)
    }

  return (<GenericModal isOpen={model} closeModal={setter} title={title()} content={content()} />)
}

