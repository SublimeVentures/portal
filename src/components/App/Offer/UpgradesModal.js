import GenericModal from "@/components/Modal/GenericModal";
import Linker from "@/components/link";
import PAGE, {ExternalLinks} from "@/routes";
import {useQuery} from "@tanstack/react-query";
import {fetchStoreItemsOwned} from "@/fetchers/store.fetcher";
import {useState} from "react";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import UpgradesModalItem from "@/components/App/Offer/UpgradesModalItem";
import {PremiumItemsENUM, PremiumItemsParamENUM} from "@/lib/enum/store";
import {useUpgrade} from "@/fetchers/offer.fetcher";
import {PhaseId} from "@/lib/phases";
import {useRouter} from "next/router";

const description = (type, maximumGuaranteedBooking) => {
    switch (type) {
        case PremiumItemsENUM.Guaranteed: {
            return (<>Books <span className={"text-gold glow"}>${maximumGuaranteedBooking}</span> allocation for first
                24h of the investment.</>)
        }
        case PremiumItemsENUM.Increased: {
            return (<>Increases maximum allocation by <span
                className={"text-gold glow"}>${PremiumItemsParamENUM.Increased.toLocaleString()}</span>.</>)
        }
    }
}
const used = (type, upgradesUse) => {
    switch (type) {
        case PremiumItemsENUM.Guaranteed: {
            return upgradesUse?.guaranteedUsed?.amount
        }
        case PremiumItemsENUM.Increased: {
            return upgradesUse?.increasedUsed?.amount;
        }
    }
}

export default function UpgradesModal({model, setter, upgradesModalProps}) {
    const router = useRouter()

    const {
        session,
        allocationUserLeft,
        offerId,
        phaseCurrent,
        refetchUserAllocation,
        isSuccessUserAllocation,
        upgradesUse
    } = upgradesModalProps
    const {userId} = session

    let [selected, setSelected] = useState(0)
    let [isProcessing, setIsProcessing] = useState(false)
    let [isError, setIsError] = useState(false)
    let [errorMsg, setErrorMsg] = useState("")

    const {data: premiumData, refetch} = useQuery({
            queryKey: ["premiumOwned", {userId}],
            queryFn: fetchStoreItemsOwned,
            enabled: model,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 5 * 1000,
        }
    );

    const isStageEnabled = phaseCurrent?.phase === PhaseId.Pending
    const maximumGuaranteedBooking = allocationUserLeft > PremiumItemsParamENUM.Guaranteed ? PremiumItemsParamENUM.Guaranteed : allocationUserLeft

    const setSelectedUpgrade = (type) => {
        if (selected === type) {
            setSelected(0)
        } else {
            setSelected(type)
        }
    }


    const close = () => {
        setter()
        setSelected(0)
    }
    const back = () => {
        setIsError(false)
        setErrorMsg("")
    }

    const visitStore = () => {
        router.push(PAGE.Upgrades)
    }

    const upgrade = async () => {
        setIsProcessing(true)
        if (selected > 0) {
            const result = await useUpgrade(offerId, selected)
            if (result?.ok) {
                await refetch();
                await refetchUserAllocation()
            } else {
                setIsError(true)
                setErrorMsg(result.error)
            }
            setSelected(0)

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
                {isError && <div
                    className={"absolute top-0 bottom-0 -left-5 -right-5 px-5 bg-app-bg h-full opacity-100 z-20 flex flex-col gap-5"}>
                    <div
                        className={"mx-auto  h-full items-center align-center justify-center flex flex-col text-app-error"}>
                        <div>{errorMsg}</div>

                    </div>
                    <div className={"mt-auto "}>
                        <UniButton
                            type={ButtonTypes.BASE}
                            text={'Back'}
                            isWide={true}
                            zoom={1.1}
                            size={'text-sm sm'}
                            isDisabled={false}
                            handler={back}
                        />
                    </div>
                    <div className="mx-auto mt-auto"><Linker url={ExternalLinks.UPGRADES}/></div>

                </div>
                }
                <div>
                    {premiumData?.length > 0 ? premiumData.map(el => {
                        return <UpgradesModalItem
                            key={el.id}
                            itemType={el.id}
                            name={el.name}
                            description={description(el.id, maximumGuaranteedBooking)}
                            selected={selected}
                            setSelectedUpgrade={setSelectedUpgrade}
                            owned={el.amount}
                            used={used(el.id, upgradesUse)}
                            image={el.img}
                            isRightPhase={isStageEnabled}
                        />
                    }) : <div className={"w-full text-center"}>No upgrades detected.</div>
                    }

                </div>

                <div className={"pt-5 pb-2 mt-auto mx-auto"}>
                    {premiumData?.length > 0 ?
                        <UniButton
                            type={ButtonTypes.BASE}
                            text={isProcessing ? 'Processing...' : 'Upgrade'}
                            isWide={true}
                            zoom={1.1}
                            size={'text-sm sm'}
                            isDisabled={selected === 0 || isProcessing}
                            handler={upgrade}

                        /> :

                        <UniButton
                            type={ButtonTypes.BASE}
                            text={'Visit store'}
                            isWide={true}
                            zoom={1.1}
                            size={'text-sm sm'}
                            isDisabled={false}
                            handler={visitStore}
                        />
                    }
                </div>
                <div className="mx-auto"><Linker url={ExternalLinks.UPGRADES}/></div>
            </div>
        )
    }


    return (<GenericModal isOpen={model} closeModal={() => {
        close()
    }} title={title()} content={content()}/>)
}

