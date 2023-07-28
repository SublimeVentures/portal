import {useAccount, useNetwork, useSwitchNetwork} from "wagmi";
import IconEth from "@/assets/svg/Eth.svg";
import IconMatic from "@/assets/svg/Matic.svg";
import IconBsc from "@/assets/svg/Bsc.svg";
import GenericModal from "@/components/Modal/GenericModal";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import Linker from "@/components/link";
import {ExternalLinks} from "@/routes";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";

export default function StoreNetwork({supportedNetworks, isPurchase, setNetworkOk}) {
    const {chain, chains} = useNetwork()
    const {error, isLoading, pendingChainId, switchNetwork} = useSwitchNetwork()
    const {isConnected} = useAccount()

    const isNetworkSupported = supportedNetworks.length > 0 ? supportedNetworks.find(el => el == chain?.id) : true

    const buttonText = (x) => {
        if (isLoading && pendingChainId == x) return 'Switching...'
        else return chains.find(el=> el.id == x)?.name
    }
    const buttonDisabled = (x) => isLoading && pendingChainId === x.id && !error


    const title = () => {
        return (
            <>
                Chain <span className="text-app-error">not supported</span>
            </>
        )
    }

    const getIcon = (id) => {
        if (id == 1) return <IconEth className={ButtonIconSize.hero}/>
        else if (id == 137) return <IconMatic className={ButtonIconSize.hero}/>
        else if (id == 57) return <IconBsc className={ButtonIconSize.hero}/>
    }

    const content = () => {
        return (
            <div>
                Please switch chain to continue with purchase.
                <div className="flex flex-col my-10 gap-5 fullWidth items-center">
                    {supportedNetworks.map((x) => (
                        <UniButton
                            key={x}
                            type={ButtonTypes.BASE}
                            handler={() => {
                                if (!isLoading) switchNetwork?.(Number(x))
                            }}
                            text={buttonText(x)}
                            isWide={true}
                            zoom={1.05}
                            size={'text-sm sm'}
                            isDisabled={buttonDisabled(x)}
                            icon={getIcon(x)}
                        />
                    ))}
                </div>

                <div
                    className="text-app-error text-center">{error && error.message}</div>
                <div className="mt-5"><Linker url={ExternalLinks.SUPPORTED_NETWORKS}/></div>
            </div>
        )
    }

    if(!isPurchase) return
    setNetworkOk(isNetworkSupported)
    return (
        <GenericModal isOpen={!isNetworkSupported && isConnected} closeModal={() => {}} title={title()} content={content()} persistent={true} noClose={true}/>
    )
}
