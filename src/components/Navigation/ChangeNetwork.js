import {useAccount, useNetwork, useSwitchNetwork} from "wagmi";
import IconEth from "@/assets/svg/Eth.svg";
import IconMatic from "@/assets/svg/Matic.svg";
import IconBsc from "@/assets/svg/Bsc.svg";
import GenericModal from "@/components/Modal/GenericModal";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import Linker from "@/components/link";
import {ExternalLinks} from "@/routes";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";

export default function ChangeNetwork() {
    const {chain, chains} = useNetwork()
    const {error, isLoading, pendingChainId, switchNetwork} = useSwitchNetwork()
    const {isConnected} = useAccount()

    const isNetworkSupported = !!chains.find(el => el.id === chain?.id)

    const buttonText = (x) => {
        if (isLoading && pendingChainId === x.id) return 'Switching...'
        else return x.name
    }
    const buttonDisabled = (x) => isLoading && pendingChainId === x.id && !error


    const title = () => {
        return (
            <>
                Chain <span className="text-app-error">not supported</span>
            </>
        )
    }

    const getIcon = (index) => {
        if (index === 0) return <IconEth className={ButtonIconSize.hero}/>
        else if (index === 1) return <IconMatic className={ButtonIconSize.hero}/>
        else if (index === 2) return <IconBsc className={ButtonIconSize.hero}/>
    }

    const content = () => {
        return (
            <div>
                Currently our platform <span className="text-gold">supports {chains.length} chains</span>.<br/>
                Please switch to one of these to continue.
                <div className="flex flex-col my-10 gap-5 fullWidth items-center">
                    {chains.map((x, index) => (
                        <UniButton
                            key={x.id}
                            type={ButtonTypes.BASE}
                            handler={() => {
                                if (!isLoading) switchNetwork?.(x.id)
                            }}
                            text={buttonText(x)}
                            isWide={true}
                            zoom={1.05}
                            size={'text-sm sm'}
                            isDisabled={buttonDisabled(x)}
                            icon={getIcon(index)}
                        />
                    ))}
                </div>

                <div
                    className="text-app-error text-center">{error && error.message}</div>
                <div className="mt-5"><Linker url={ExternalLinks.SUPPORTED_NETWORKS}/></div>
            </div>
        )
    }

    return (
        <GenericModal isOpen={!isNetworkSupported && isConnected} closeModal={() => {}} title={title()} content={content()} persistent={true} noClose={true}/>
    )
}
