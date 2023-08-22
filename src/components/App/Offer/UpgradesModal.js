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

export default function UpgradesModal({model, setter, upgradesModalProps}) {
    console.log("upgradesModalProps",upgradesModalProps)
    const {account, userAllocationLeft, offerId, currentPhase} = upgradesModalProps
    const {ACL, address, id, multi} = account
    const {amount} = userAllocationLeft
    let [selected, setSelected] = useState(0)

    const {isSuccess: premiumIsSuccess, data: premiumData} = useQuery({
            queryKey: ["premiumOwned", {address}],
            queryFn: fetchStoreItemsOwned,
            enabled: model,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 5 * 1000,
        }
    );


    const guaranteed = premiumData?.find(el => el.storeId === PremiumItemsENUM.Guaranteed)?.amount;
    const increased = premiumData?.find(el => el.storeId === PremiumItemsENUM.Increased)?.amount;
    const isGuaranteedEnabled = currentPhase?.step === "Pending"
    const isIncreasedEnabled = currentPhase?.step === "FCFS"
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
        return (<>Increases maximum allocation by <span className={"text-gold glow"}>$2000</span>.</>)
    }

    const close = () => {
        setter()
        setSelected(0)
    }

    const upgrade = async () => {
        if(selected>0) {
            await useUpgrade(offerId, selected)

        }
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
            <div className={"flex flex-1 flex-col gap-5 pt-5"}>
                <UpgradesModalItem
                    itemType={PremiumItemsENUM.Guaranteed}
                    name={"Guaranteed Allocation"}
                    description={descriptionGuaranteed()}
                    selected={selected}
                    setSelectedUpgrade={setSelectedUpgrade}
                    owned={guaranteed}
                    used={2}
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
                    used={0}
                    image={imageId}
                    isRightPhase={isIncreasedEnabled}
                   />
                <div className={"pt-5 pb-2 mt-auto"}>
                    <UniButton
                        type={ButtonTypes.BASE}
                        text={'Upgrade'}
                        isWide={true}
                        zoom={1.1}
                        size={'text-sm sm'}
                        isDisabled={selected === 0}
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

