import {useNetwork, useSwitchNetwork} from "wagmi";
import {useEffect, useState} from "react";
import IconEth from "@/assets/svg/Eth.svg";
import IconMatic from "@/assets/svg/Matic.svg";
import {Switch} from '@headlessui/react'
import {useRouter} from "next/router";
import GenericModal from "@/components/Modal/GenericModal";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";

export default function ChangeNetwork() {
    const {chain, chains} = useNetwork()
    const {error, isLoading, pendingChainId, switchNetwork} = useSwitchNetwork()
    const [enabled, setEnabled] = useState(false)

    const isNetworkSupported = !!chains.find(el => el.id === chain?.id)


    useEffect(() => {
        if (!enabled) {
            switchNetwork?.(chains[0].id)
        } else {
            switchNetwork?.(chains[1].id)
        }
        if (chain?.id === chains[0].id) {
            setEnabled(false)
        } else if (chain?.id === chains[1].id) {
            setEnabled(true)
        }
    }, [enabled, chain])

    const title = () => {
        return (
            <>
                Wrong <span className="text-app-error">chain</span>
            </>
        )
    }

    const getIcon = (index) => {
        if (index === 0) return <IconEth className={ButtonIconSize.hero}/>
        else if (index === 1) return <IconMatic className={ButtonIconSize.hero}/>
    }

    const content = () => {
        return (
            <div>
                Currently, platform <span className="text-gold">supports {chains.length} chains</span>.<br/>
                Please switch to one of these to continue.
                <div className="flex flex-col my-10 gap-5 fullWidth">
                    {chains.map((x, index) => (
                        <RoundButton
                            key={x.id}
                            handler={() => {
                                switchNetwork?.(x.id)
                            }}
                            text={isLoading && pendingChainId === x.id && !error ? 'Switching...' : x.name}
                            isWide={true}
                            zoom={1.05}
                            size={'text-sm sm'}
                            isDisabled={!switchNetwork || x.id === chain?.id}
                            icon={getIcon(index)}
                        />

                    ))}
                </div>
                <div className="text-app-error text-center">{error && error.message}</div>
                <div className="mt-5"><a href="#" target="_blank">Read more.</a></div>
            </div>
        )
    }


    return (
        <div className={'flex flex-row justify-center items-center'}>
            <Switch
                disabled={!switchNetwork}
                checked={enabled}
                onChange={setEnabled}
                className={`${enabled ? 'bgMatic' : 'bgEth'} ${isNetworkSupported ? '' : 'opacity-50'} 
          relative inline-flex h-[28px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
                <span
                    aria-hidden="true"
                    className={`${enabled ? 'translate-x-8' : 'translate-x-0'}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                >
                    {!enabled && <IconEth className="w-8 h-8 -mt-1 -ml-2"/>}
                    {enabled && <IconMatic className="w-8 h-8 -mt-1"/>}


                </span>
            </Switch>
            <GenericModal isOpen={!isNetworkSupported} closeModal={() => {
            }} title={title()} content={content()} persistent={true} noClose={true}/>
        </div>
    )
}
