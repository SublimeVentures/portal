import moment from 'moment'
import {useEffect, useState} from "react";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import {PhaseId} from "@/lib/phases";
import {fetchHash} from "@/fetchers/invest.fetcher";
import ErrorModal from "@/components/App/Offer/ErrorModal";
import UpgradesModal from "@/components/App/Offer/UpgradesModal";
import InvestModal from "@/components/App/Offer/InvestModal";
import RestoreHashModal from "@/components/App/Offer/RestoreHashModal";
import CalculateModal from "@/components/App/Offer/CalculateModal";
import {Transition} from "@headlessui/react";
import {Fragment} from "react";
import IconCancel from "@/assets/svg/Cancel.svg";
import Dropdown from "@/components/App/Dropdown";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {checkIfNumberKey, isBased} from "@/lib/utils";
import {IconButton} from "@/components/Button/IconButton";
import {Tooltiper, TooltipType} from "@/components/Tooltip";
import {buttonInvestState, tooltipInvestState, userInvestmentState} from "@/lib/investment";
import Linker from "@/components/link";
import {ExternalLinks} from "@/routes";
import {BlockchainProvider} from "@/components/App/BlockchainSteps/BlockchainContext";
import {useEnvironmentContext} from "@/components/App/BlockchainSteps/EnvironmentContext";
import DynamicIcon from "@/components/Icon";
import {ICONS} from "@/lib/icons";
import {useInvestContext} from "@/components/App/Offer/InvestContext";


export default function OfferDetailsInvestPhases({paramsInvestPhase}) {
    const {
        offer,
        phaseCurrent,
        session,
        refetchOfferAllocation,
        refetchUserAllocation,
        allocation,
        userInvested,
        userAllocationState,
        upgradesUse,
        premiumData,
        refetchPremiumData
    } = paramsInvestPhase;
    const {network, activeChainSettlementSymbol, activeChainCurrency} = useEnvironmentContext();
    const {
        cleanHash, setHash, hashData, getCookie
    } = useInvestContext();

    const [isUpgradeModal, setUpgradeModal] = useState(false)
    const [isErrorModal, setErrorModal] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const [isRestoreHash, setRestoreHashModal] = useState(false)
    const [allocationOld, setOldAllocation] = useState(0)

    const [isInvestModal, setInvestModal] = useState(false)
    const [isCalculateModal, setCalculateModal] = useState(false)

    const [isButtonLoading, setButtonLoading] = useState(false)

    const [currencyOption, setCurrencyOption] = useState(0)

    const [investmentAmount, setInvestmentAmount] = useState(0)
    const [investmentAmountFormatted, setInvestmentAmountFormatted] = useState("")
    const [showInputInfo, setShowInputInfo] = useState(false)
    const [showClean, setShowClean] = useState(false)
    const [investButtonDisabled, setInvestButtonDisabled] = useState(false)
    const [investButtonText, setInvestButtonText] = useState("")
    const [isError, setIsError] = useState({})

    const [allocationData, setAllocationData] = useState({
        allocationUser_max: 0,
        allocationUser_min: 0,
        allocationUser_left: 0,
        allocationUser_invested: 0,
        allocationOffer_left: 0,
        allocationUser_guaranteed: 0,
        offer_isProcessing: false,
        offer_isSettled: false,
    })


    const isStakeLock = session?.isStaked !== undefined ? !session.isStaked : false

    const selectedCurrency = activeChainSettlementSymbol[currencyOption]

    const setValue = (data) => {
        if (!data) return
        try {
            if (!Number.isInteger(data)) {
                data = data.replace(/[^0-9]/g, '');
            }
            setInvestmentAmount(data);
            let formatted = Number(data).toLocaleString();
            if (formatted == 0) {
                formatted = "";
            }
            setInvestmentAmountFormatted(formatted);
        } catch (error) {
            // Error handling: do nothing or log the error if needed
            console.error("Error in setValue:", error);
        }

    }

    const isInputActive = () => {
        return investmentAmount > 0
    }

    const onInputChange = (event) => {
        setValue(event.target.value)
    }

    const getInvestmentButtonIcon = () => {
        switch (phaseCurrent.phase) {
            case PhaseId.Pending: {
                return <DynamicIcon name={ICONS.WAIT} style={ButtonIconSize.invest} fill={"white"}/>
            }
            case PhaseId.Open:
            case PhaseId.FCFS:
            case PhaseId.Unlimited: {
                return <DynamicIcon name={ICONS.WHALE} style={ButtonIconSize.invest}/>
            }
            case PhaseId.Closed: {
                return <DynamicIcon name={ICONS.LOCK} style={ButtonIconSize.invest}/>

            }
        }
    }

    const bookingExpire = () => {
        setButtonLoading(true)
        cleanHash(true)
        setInvestModal(false)
        setRestoreHashModal(false)
        refetchOfferAllocation()
        setButtonLoading(false)
    }

    const afterInvestmentCleanup = () => {
        setButtonLoading(true)
        cleanHash()
        refetchUserAllocation()
        setButtonLoading(false)
    }

    const openInvestmentModal = () => {
        if (isStakeLock) {
            return
        }
        setInvestModal(true)
    }

    const startInvestmentProcess = async () => {
        if (
            investmentAmount > 0 &&
            allocationData.allocationUser_max > 0 &&
            allocationData.allocationUser_min > 0 &&
            allocationData.allocationUser_left > 0
        ) {
            setButtonLoading(true)
            const response = await fetchHash(offer.id, investmentAmount, activeChainCurrency[selectedCurrency]?.address, network.chainId)
            if (!response.ok) {
                await cleanHash(true)
                setErrorMsg(response.code)
                setErrorModal(true)
                refetchOfferAllocation()
            } else {
                const confirmedAmount = Number(response.amount)
                setValue(confirmedAmount)
                setHash(response.hash, Number(response.expires), confirmedAmount)
                openInvestmentModal()
            }
            setButtonLoading(false)
        }

    }

    const processExistingSession = async () => {
        setButtonLoading(true)
        try {
            const savedTimestamp = hashData.expires
            const savedAmount = hashData.amount
            if (savedTimestamp < moment.utc().unix()) {
                await cleanHash(true)
                await startInvestmentProcess()
            } else if (savedAmount === Number(investmentAmount)) {
                openInvestmentModal()
            } else {
                setOldAllocation(savedAmount)
                setRestoreHashModal(true)
            }
        } catch (e) {
            await cleanHash(true)
            await startInvestmentProcess()
        }
        setButtonLoading(false)
    }

    const bookingRestore = async () => {
        setRestoreHashModal(false)
        const cookieData = getCookie().split('_')
        setValue(Number(cookieData[1]))
        openInvestmentModal()
    }

    const bookingCreateNew = async () => {
        setButtonLoading(true)
        setRestoreHashModal(false)
        await cleanHash(true)
        await startInvestmentProcess()
    }

    const makeInvestment = async () => {
        if (!!getCookie()?.length > 0) {
            await processExistingSession()
        } else {
            await startInvestmentProcess()
        }
    }

    useEffect(() => {
        setCurrencyOption(0)
    }, [network?.chainId])

    useEffect(() => {
        if (allocationData?.allocationUser_min) {
            setValue(allocationData.allocationUser_min)
        } else {
            setValue(offer.alloMin)
        }
    }, [allocationData?.allocationUser_min]);

    useEffect(() => {
        if (showInputInfo) {
            setShowClean(showInputInfo)
        } else {
            setTimeout(() => {
                setShowClean(showInputInfo)
            }, 500);
        }
    }, [showInputInfo]);


    useEffect(() => {
        if (!offer) return
        const allocations = userInvestmentState(session, offer, phaseCurrent, upgradesUse, userInvested?.total, allocation ? allocation : {})
        setAllocationData({...allocations})
        const {allocation: allocationIsValid, message} = tooltipInvestState(offer, allocations, investmentAmount)
        setIsError({state: !allocationIsValid, msg: message})

        const {
            isDisabled,
            text
        } = buttonInvestState(offer, phaseCurrent, investmentAmount, allocationIsValid, allocations, isStakeLock)
        setInvestButtonDisabled(isDisabled)
        setInvestButtonText(text)

    }, [
        allocation?.alloFilled,
        allocation?.alloRes,
        upgradesUse?.increasedUsed?.amount,
        upgradesUse?.guaranteedUsed?.amount,
        upgradesUse?.guaranteedUsed?.alloUsed,
        userInvested?.total,
        investmentAmount,
        phaseCurrent?.phase
    ])


    const restoreModalProps = {allocationOld, investmentAmount, bookingExpire, bookingRestore, bookingCreateNew}
    const errorModalProps = {code: errorMsg}
    const upgradesModalProps = {
        phaseCurrent,
        offerId: offer.id,
        refetchUserAllocation,
        userAllocationState,
        upgradesUse,
        premiumData ,
        refetchPremiumData,
        allocationUserLeft: allocationData.allocationUser_left
    }
    const calculateModalProps = {investmentAmount, allocationData, offer}
    const investModalProps = {
        investmentAmount,
        offer,
        selectedCurrency,
        bookingExpire,
        afterInvestmentCleanup
    }

    return (
        <div className={`flex flex-1 flex-col items-center justify-center relative ${isBased ? "" : "font-accent"}`}>
            <div className={"absolute right-5 top-5"}>
                <div className={"flex flex-row items-center text-gold"}>
                    {!!upgradesUse.guaranteedUsed &&
                        <div className={"mr-3 font-bold glow select-none"}><Tooltiper wrapper={`GUARANTEED`}
                                                                                      text={`$${allocationData.allocationUser_guaranteed} left`}
                                                                                      type={TooltipType.Primary}/>
                        </div>}
                    <div className={"flex gap-2 flex-row justify-center align-center items-center"}>
                        <IconButton zoom={1.1} size={'w-12 p-3'} icon={<DynamicIcon name={ICONS.CALCULATOR}/>}
                                    noBorder={!isBased} handler={() => setCalculateModal(true)}/>
                        <IconButton zoom={1.1} size={'w-12 p-3'}
                                    icon={<DynamicIcon name={ICONS.DIAMOND} className={"text-gold"}/>}
                                    noBorder={!isBased} handler={() => setUpgradeModal(true)}/>
                    </div>
                </div>
            </div>
            <div className="lg:mt-auto">
                <div className="currency-input-group relative mt-20 ">
                    <div className={`relative centr ${investmentAmount > 0 ? 'active' : ''}`}>
                        <label className="absolute text-accent block">Investment size</label>
                        <input tabIndex="0"
                               value={investmentAmountFormatted}
                               onChange={onInputChange}
                               onKeyDown={checkIfNumberKey}
                               onFocus={() => setShowInputInfo(true)}
                               onBlur={() => setShowInputInfo(false)}
                               className={`h-17 text-xl px-4 ${isInputActive ? 'highlight' : ''} ${investmentAmount >= allocationData.allocationUser_min && investmentAmount <= allocationData.allocationUser_max ? 'valid' : ''} ${investmentAmount < allocationData.allocationUser_min || investmentAmount > allocationData.allocationUser_max ? 'invalid' : ''}`}
                        />

                        <Transition appear show={showClean} as={Fragment}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="absolute top-5 right-5 cursor-pointer " onClick={() => {
                                    setValue(allocationData.allocationUser_min)
                                }}>
                                    <IconCancel className="w-6 opacity-70"/></div>
                            </Transition.Child>
                        </Transition>
                    </div>
                    <Dropdown options={activeChainSettlementSymbol} classes={'customSize'}
                              propSelected={setCurrencyOption} position={currencyOption}/>
                    <Transition appear show={showInputInfo} as={Fragment}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div
                                className={`select-none absolute px-4 py-2 status text-sm ${isError?.state ? 'error' : ''}`}>{isError?.msg}</div>
                        </Transition.Child>
                    </Transition>

                </div>
            </div>
            <div className={"text-app-success text-center min-h-[68px] py-5 px-2"}>
                {allocationData.offer_isProcessing && allocationData.allocationUser_guaranteed === 0 && <div>
                    All spots booked! Awaiting blockchain confirmations. <br/>
                    <Linker url={ExternalLinks.LOOTBOX} text={"Check back soon."}/>
                </div>}
            </div>
            <div className="flex flex-row flex-wrap justify-center gap-2 pb-10 px-2 items-center">
                <div className={investButtonDisabled ? 'disabled' : ''}>
                    <UniButton
                        type={ButtonTypes.BASE}
                        text={investButtonText}
                        isPrimary={true}
                        state={"success"}
                        showParticles={true}
                        isLoading={isButtonLoading} is3d={true} isWide={true} zoom={1.1}
                        handler={makeInvestment}
                        size={'text-sm sm'} icon={getInvestmentButtonIcon()}
                    />
                </div>
            </div>


            <RestoreHashModal restoreModalProps={restoreModalProps} model={isRestoreHash} setter={() => {
                setRestoreHashModal(false)
            }}/>
            <CalculateModal calculateModalProps={calculateModalProps} model={isCalculateModal} setter={() => {
                setCalculateModal(false)
            }}/>
            <UpgradesModal upgradesModalProps={upgradesModalProps} model={isUpgradeModal} setter={() => {
                setUpgradeModal(false)
            }}/>
            <ErrorModal errorModalProps={errorModalProps} model={isErrorModal} setter={() => {
                setErrorModal(false)
            }}/>
            <BlockchainProvider>
                {network?.isSupported &&
                    <InvestModal investModalProps={investModalProps} model={isInvestModal} setter={() => {
                        setInvestModal(false)
                    }}/>}
            </BlockchainProvider>
        </div>
    )
}
