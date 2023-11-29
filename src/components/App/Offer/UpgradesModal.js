import GenericModal from "@/components/Modal/GenericModal";
import Linker from "@/components/link";
import {ExternalLinks} from "@/routes";
import {useQuery} from "@tanstack/react-query";
import {fetchStoreItemsOwned} from "@/fetchers/store.fetcher";
import {isBased} from "@/lib/utils";
import {useState} from "react";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import IconPremium from "@/assets/svg/Premium.svg";
import UpgradesModalItem from "@/components/App/Offer/UpgradesModalItem";
import {PremiumItemsENUM, PremiumItemsParamENUM} from "@/lib/enum/store";
import {useUpgrade} from "@/fetchers/offer.fetcher";
import {PhaseId} from "@/lib/phases";

export default function UpgradesModal({model, setter, upgradesModalProps}) {
    const {account, allocationUserLeft, offerId, phaseCurrent, refetchUserAllocation, isSuccessUserAllocation, upgradesUse} = upgradesModalProps
    const {address} = account

    let [selected, setSelected] = useState(0)
    let [isProcessing, setIsProcessing] = useState(false)
    let [isError, setIsError] = useState(false)
    let [errorMsg, setErrorMsg] = useState("")

    const {data: premiumData, refetch} = useQuery({
            queryKey: ["premiumOwned", {address}],
            queryFn: fetchStoreItemsOwned,
            enabled: model,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 5 * 1000,
        }
    );

    const guaranteedUsed = upgradesUse?.guaranteedUsed?.amount;
    const increasedUsed = upgradesUse?.increasedUsed?.amount;
    const guaranteed = premiumData?.find(el => el.storeId === PremiumItemsENUM.Guaranteed)?.amount;
    const increased = premiumData?.find(el => el.storeId === PremiumItemsENUM.Increased)?.amount;
    const isStageEnabled = phaseCurrent?.phase === PhaseId.Pending
    const maximumGuaranteedBooking = allocationUserLeft > PremiumItemsParamENUM.Guaranteed ? PremiumItemsParamENUM.Guaranteed : allocationUserLeft
    const imageId = (id) => isBased ? `${id}.jpg` : `Code_${id}.gif`

    const setSelectedUpgrade = (type) => {
        if(selected === type) {
            setSelected(0)
        } else {
            setSelected(type)
        }
    }

    const descriptionGuaranteed = () => {
        return (<>Books <span className={"text-gold glow"}>${maximumGuaranteedBooking}</span> allocation for first 24h of the investment.</>)
    }

    const descriptionIncreased = () => {
        return (<>Increases maximum allocation by <span className={"text-gold glow"}>${PremiumItemsParamENUM.Increased.toLocaleString()}</span>.</>)
    }

    const close = () => {
        setter()
        setSelected(0)
    }
    const back = () => {
        setIsError(false)
        setErrorMsg("")
    }

    const upgrade = async () => {
        setIsProcessing(true)
        if(selected>0) {
            const result = await useUpgrade(offerId, selected)
            if(result?.ok) {
                await refetch();
                await refetchUserAllocation()
            } else {
                setIsError(true)
                setErrorMsg(result.error)
            }
        }
        setIsProcessing(false)
    }



    const title = () => {
        return (
            <>
                Use <span className="text-gold">Upgrade</span>
            </>
        )
    }

    const content = () => {
        return (
            <div className={`flex flex-1 flex-col gap-5 pt-5 relative ${isSuccessUserAllocation ? "" : "disabled"}`}>
                {isError && <div className={"absolute top-0 bottom-0 -left-5 -right-5 px-5 bg-app-bg h-full opacity-100 z-20 flex flex-col gap-5"}>
                    <div className={"mx-auto  h-full items-center align-center justify-center flex flex-col text-app-error"}>
                        <div>{errorMsg}</div>

                    </div>
                        <div className={"mt-auto mx-auto"}>
                            <UniButton
                                type={ButtonTypes.BASE}
                                text={'Back'}
                                isWide={true}
                                zoom={1.1}
                                size={'text-sm sm'}
                                isDisabled={false}
                                handler={back}
                                icon={<IconPremium className={ButtonIconSize.hero}/>}
                            />
                        </div>
                        <div className="mx-auto mt-auto"><Linker url={ExternalLinks.UPGRADES}/></div>

                    </div>
                }
                <div>
                    <UpgradesModalItem
                        itemType={PremiumItemsENUM.Guaranteed}
                        name={"Guaranteed Allocation"}
                        description={descriptionGuaranteed()}
                        selected={selected}
                        setSelectedUpgrade={setSelectedUpgrade}
                        owned={guaranteed}
                        used={guaranteedUsed}
                        image={imageId}
                        isRightPhase={isStageEnabled}
                    />
                    {isBased && <UpgradesModalItem
                        itemType={PremiumItemsENUM.Increased}
                        name={"Increased Allocation"}
                        description={descriptionIncreased()}
                        selected={selected}
                        setSelectedUpgrade={setSelectedUpgrade}
                        owned={increased}
                        used={increasedUsed}
                        image={imageId}
                        isRightPhase={isStageEnabled}
                    />}

                </div>

                <div className={"pt-5 pb-2 mt-auto mx-auto"}>
                    <UniButton
                        type={ButtonTypes.BASE}
                        text={isProcessing ? 'Processing...' : 'Upgrade'}
                        isWide={true}
                        zoom={1.1}
                        size={'text-sm sm'}
                        isDisabled={selected === 0 || isProcessing}
                        handler={upgrade}
                        icon={<IconPremium className={ButtonIconSize.hero}/>}
                    />
                </div>


                <div className="mx-auto"><Linker url={ExternalLinks.UPGRADES}/></div>
            </div>
        )
    }


    return (<GenericModal isOpen={model} closeModal={()=>{close()}} title={title()} content={content()}/>)
}

