import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import GenericModal from "@/components/Modal/GenericModal";
import Image from "next/image";

import {useConnect} from 'wagmi'

export default function LoginModal({isPartner, signError, model, setter}) {
    const { connect, connectors, error, pendingConnector } = useConnect()

    const title = () => {
        return (<>Connect Wallet <span className="text-gold">{isPartner ? "Partners" : "Whale"}</span></>)
    }

    const content = () => {
        return (<> <div className="pb-10">
            Don't want connect your cold wallet? You can delegate access! Read more
            here.
        </div>
            <div className="flex flex-col gap-5 fullWidth">
                {connectors.map((connector) => (
                    <RoundButton
                        key={connector.id}
                        handler={()=> {connect({ connector })}}
                        text={connector.id === pendingConnector?.id && !error ? "Loading..." : connector.name}
                        isWide={true}
                        zoom={1.05}
                        size={'text-sm sm'}
                        isDisabled={!connector.ready}
                        icon={<Image src={`/img/login/${connector.name}.png`} width={32} height={32} alt={connector.name} className={ButtonIconSize.hero}/>}
                    />

                ))}
            </div>
            <div className="-mb-2 mt-2 text-center text-red h-[10px]">{signError?.length>0 ? signError : (error ? error.message : "")}</div>
        </>)
    }

  return (<GenericModal isOpen={model} closeModal={setter} title={title()} content={content()} />)
}

