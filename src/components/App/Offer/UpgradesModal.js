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
import {PremiumItemsENUM, PremiumItemsParamENUM} from "@/lib/premiumHelper";
import {useUpgrade} from "@/fetchers/offer.fetcher";
import {PhaseId} from "@/lib/phases";

export default function UpgradesModal({model, setter, upgradesModalProps}) {
    console.log("upgradesModalProps",upgradesModalProps)
    const {account, userAllocationLeft, offerId, phaseCurrent, upgradesUsedRefetch, upgradesUsedSuccess, upgradesUse} = upgradesModalProps
    const {address} = account
    const {amount} = userAllocationLeft
    let [selected, setSelected] = useState(0)
    let [isProcessing, setIsProcessing] = useState(false)

    const {isSuccess: premiumIsSuccess, data: premiumData} = useQuery({
            queryKey: ["premiumOwned", {address}],
            queryFn: fetchStoreItemsOwned,
            enabled: model,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 5 * 1000,
        }
    );

    const guaranteedUsed = upgradesUse?.find(el => el.storeId === PremiumItemsENUM.Guaranteed)?.amount;
    const increasedUsed = upgradesUse?.find(el => el.storeId === PremiumItemsENUM.Increased)?.amount;
    const guaranteed = premiumData?.find(el => el.storeId === PremiumItemsENUM.Guaranteed)?.amount;
    const increased = premiumData?.find(el => el.storeId === PremiumItemsENUM.Increased)?.amount;
    const isGuaranteedEnabled = phaseCurrent?.phase === PhaseId.Pending
    const isIncreasedEnabled = phaseCurrent?.phase === PhaseId.FCFS || phaseCurrent?.phase === PhaseId.Pending
    const maximumGuaranteedBooking = amount > PremiumItemsParamENUM.Guaranteed ? PremiumItemsParamENUM.Guaranteed : amount

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

    const upgrade = async () => {
        setIsProcessing(true)
        if(selected>0) {
            const result = await useUpgrade(offerId, selected)
            //todo: show error
            if(result?.ok) {
                await upgradesUsedRefetch()
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
            <div className={`flex flex-1 flex-col gap-5 pt-5 ${upgradesUsedSuccess ? "" : "disabled"}`}>
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
                        isRightPhase={isGuaranteedEnabled}
                    />
                    <UpgradesModalItem
                        itemType={PremiumItemsENUM.Increased}
                        name={"Increased Allocation"}
                        description={descriptionIncreased()}
                        selected={selected}
                        setSelectedUpgrade={setSelectedUpgrade}
                        owned={increased}
                        used={increasedUsed}
                        image={imageId}
                        isRightPhase={isIncreasedEnabled}
                    />
                </div>

                <div className={"pt-5 pb-2 mt-auto"}>
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

