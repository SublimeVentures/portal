import moment from 'moment'
import {useEffect, useState} from "react";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import IconWait from "@/assets/svg/Wait.svg";
import IconPantheon from "@/assets/svg/Pantheon.svg";
import IconWhale from "@/assets/svg/Whale.svg";
import IconLock from "@/assets/svg/Lock.svg";
import IconCalculator from "@/assets/svg/Calculator.svg";
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import { PhaseId} from "@/lib/phases";
import {expireHash, fetchHash} from "@/fetchers/invest.fetcher";
import ErrorModal from "@/components/App/Offer/ErrorModal";
import UpgradesModal from "@/components/App/Offer/UpgradesModal";
import InvestModal from "@/components/App/Offer/InvestModal";
import {useCookies} from 'react-cookie';
import RestoreHashModal from "@/components/App/Offer/RestoreHashModal";
import CalculateModal from "@/components/App/Offer/CalculateModal";
import {useNetwork} from "wagmi";
import {Transition} from "@headlessui/react";
import {Fragment} from "react";
import IconCancel from "@/assets/svg/Cancel.svg";
import Dropdown from "@/components/App/Dropdown";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {checkIfNumberKey, isBased} from "@/lib/utils";
import {ACLs} from "@/lib/authHelpers";
import {IconButton} from "@/components/Button/IconButton";
import IconPremium from "@/assets/svg/Premium.svg";
import {Tooltiper, TooltipType} from "@/components/Tooltip";
import {buttonInvestState, tooltipInvestState, userInvestmentState} from "@/lib/investment";
import Linker from "@/components/link";
import {ExternalLinks} from "@/routes";


export default function OfferDetailsInvestPhases({paramsInvestPhase}) {
    const {
        offer,
        phaseCurrent,
        account,
        currencies,
        refetchAllocation,
        refetchUserAllocation,
        allocation,
        userAllocation,
        isSuccessUserAllocation,
        upgradesUse,
    } = paramsInvestPhase;


    const {chain, chains} = useNetwork()

    const [isUpgradeModal, setUpgradeModal] = useState(false)
    const [isErrorModal, setErrorModal] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const [isRestoreHash, setRestoreHashModal] = useState(false)
    const [allocationOld, setOldAllocation] = useState(0)

    const [isInvestModal, setInvestModal] = useState(false)
    const [isCalculateModal, setCalculateModal] = useState(false)

    const [expires, setExpires] = useState(0)
    const [isButtonLoading, setButtonLoading] = useState(false)

    const [investmentCurrency, setInvestmentCurrency] = useState(0)
    const [hash, setHash] = useState(0)

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
        allocationOffer_left:0,
        allocationUser_guaranteed:0,
        offer_isProcessing: false,
        offer_isSettled: false,
    })


    const [cookies, setCookie, removeCookie] = useCookies();
    const isNetworkSupported = !!chains.find(el => el.id === chain?.id)
    console.log("upgradesUse",upgradesUse)

    //migrated
    const {ACL, isStaked} = account
    const ntStakeGuard = ACL === ACLs.NeoTokyo && !isStaked
    //migrated end


    const selectedChain = chain?.id ? chain.id : Object.keys(currencies)[0]
    const currencyList = currencies[selectedChain] ? Object.keys(currencies[selectedChain]).map(el => {
        let currency = currencies[selectedChain][el]
        currency.address = el
        return currency
    }) : [{}]

    const currencyNames = currencyList.map(el => el.symbol)
    const selectedCurrency = currencyList[investmentCurrency]

    const cookieReservation = `hash_${offer.id}`


    const setValue = (data) => {
        if (!Number.isInteger(data)) {
            data = data.replace(/[^0-9]/g, '')
        }
        setInvestmentAmount(data)
        let formatted = Number(data).toLocaleString()
        if(formatted==0) {
            formatted = ""
        }
        setInvestmentAmountFormatted(formatted)
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
                return <IconWait className={ButtonIconSize.invest}/>
            }
            case PhaseId.Vote: {
                return <IconPantheon className={ButtonIconSize.invest}/>
            }
            case PhaseId.Open:
            case PhaseId.FCFS:
            case PhaseId.Unlimited: {
                return <IconWhale className={ButtonIconSize.invest}/>
            }
            case PhaseId.Closed: {
                return <IconLock className={ButtonIconSize.invest}/>
            }
        }
    }

    const bookingExpire = () => {
        removeCookie(cookieReservation)
        setHash(0)
        setExpires(0)
        setInvestModal(false)
        setRestoreHashModal(false)
        refetchAllocation()
    }

    const afterInvestmentCleanup = () => {
        removeCookie(cookieReservation)
        refetchUserAllocation()
    }

    const openInvestmentModal = (hash, expires) => {
        setHash(hash)
        setExpires(Number(expires))

        if(ntStakeGuard) {
            return
        }
        setInvestModal(true)
    }

    const startInvestmentProcess = async () => {
        setButtonLoading(true)
        const response = await fetchHash(offer.id, investmentAmount, selectedCurrency.address, chain.id)
        console.log("response", response)
        if (!response.ok) {
            setErrorMsg(response.code)
            setErrorModal(true)
            refetchAllocation()
        } else {
            setCookie(cookieReservation, `${response.hash}_${investmentAmount}_${response.expires}`, {expires: new Date(response.expires * 1000)})
            openInvestmentModal(response.hash, response.expires)
        }
        setButtonLoading(false)
    }

    const processExistingSession = async (cookie) => {
        setButtonLoading(true)
        const cookieData = cookie.split('_')
        console.log("cookie", cookieData)
        try {
            const savedTimestamp = Number(cookieData[2])
            const savedAmount = Number(cookieData[1])
            const savedHash = cookieData[0]

            if (savedTimestamp < moment.utc().unix()) {
                removeCookie(cookieReservation)
                await startInvestmentProcess()
            } else if (savedAmount === Number(investmentAmount)) {
                openInvestmentModal(savedHash, savedTimestamp)
            } else {
                setOldAllocation(savedAmount)
                setExpires(savedTimestamp)
                setRestoreHashModal(true)
            }
        }catch(e) {
            console.log("bad cookie")
            removeCookie(cookieReservation)
            await startInvestmentProcess()
        }


        setButtonLoading(false)
    }

    const bookingRestore = async () => {
        setRestoreHashModal(false)
        const cookieData = cookies[cookieReservation].split('_')
        setValue(Number(cookieData[1]))
        openInvestmentModal(cookieData[0], cookieData[2])
    }

    const bookingCreateNew = async () => {
        setButtonLoading(true)
        removeCookie(cookieReservation)
        setRestoreHashModal(false)
        const cookieData = cookies[cookieReservation].split('_')
        expireHash(offer.id, cookieData[0])
        await startInvestmentProcess()
    }

    const makeInvestment = async () => {
        if (!!cookies && Object.keys.length > 0 && cookies[cookieReservation]?.length > 0) {
            await processExistingSession(cookies[cookieReservation])
        } else {
            await startInvestmentProcess()
        }
    }

    useEffect(() => {
        setInvestmentCurrency(0)
    }, [chain])

    useEffect(() => {
        if(allocationData?.allocationUser_min) {
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
        if(!offer) return
        console.log("refresh")
        const allocations = userInvestmentState(account, offer, phaseCurrent, upgradesUse, userAllocation, allocation ? allocation : {})
        setAllocationData({...allocations})
        const {allocation: allocationIsValid, message} = tooltipInvestState(offer, allocations, investmentAmount)
        setIsError({state: !allocationIsValid, msg: message})

        const {isDisabled, text} = buttonInvestState(offer, phaseCurrent, investmentAmount, allocationIsValid, allocations, ntStakeGuard)
        setInvestButtonDisabled(isDisabled)
        setInvestButtonText(text)
        console.log("refresh allocations",allocations)

    }, [
        allocation?.alloFilled,
        allocation?.alloRes,
        upgradesUse?.increasedUsed?.amount,
        upgradesUse?.guaranteedUsed?.amount,
        upgradesUse?.guaranteedUsed?.alloUsed,
        userAllocation,
        investmentAmount,
        phaseCurrent?.phase
    ])


    const restoreModalProps = {expires, allocationOld, investmentAmount, bookingExpire, bookingRestore, bookingCreateNew}
    const errorModalProps = {code: errorMsg}
    const upgradesModalProps = {account,  phaseCurrent, offerId: offer.id, refetchUserAllocation, isSuccessUserAllocation, upgradesUse, allocationUserLeft: allocationData.allocationUser_left}
    const calculateModalProps = {investmentAmount, allocationData, offer}
    const investModalProps = {
        expires,
        investmentAmount,
        offer,
        account,
        bookingExpire,
        hash,
        selectedCurrency,
        afterInvestmentCleanup
    }

    return (
        <div className={`flex flex-1 flex-col items-center justify-center relative ${isBased ? "" : "font-accent"}`}>
            <div className={"absolute right-5 top-5"} >
                <div className={"flex flex-row items-center text-gold"}>
                    {!!upgradesUse.guaranteedUsed && <div className={"mr-3 font-bold glow select-none"}> <Tooltiper wrapper={`GUARANTEED`} text={`$${allocationData.allocationUser_guaranteed} left`} type={TooltipType.Primary}/> </div>}
                    <div onClick={()=> {setUpgradeModal(true)}}>
                        <IconButton zoom={1.1} size={'w-12 p-3'} icon={<IconPremium className={"text-gold"}/>} noBorder={!isBased} />
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
                                }}><IconCancel className="w-6 opacity-70"/></div>
                            </Transition.Child>
                        </Transition>
                    </div>
                    <Dropdown options={currencyNames} classes={'customSize'} propSelected={setInvestmentCurrency} position={investmentCurrency}/>
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
            <div className={"text-app-success text-center min-h-[88px] py-5 px-2"}>
                {allocationData.offer_isProcessing && <div>
                    All spots booked! Awaiting blockchain confirmations. <br/>
                    <Linker url={ExternalLinks.LOOTBOX} text={"Check back soon."}/>

                </div> }
            </div>

            <div className="flex flex-row flex-wrap justify-center gap-2 pb-10 px-2">
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
                <div className="hidden sinvest:flex">
                    <UniButton
                        type={ButtonTypes.BASE}
                        text={'Calculate'}
                        isWide={true}
                        zoom={1.1}
                        size={'text-sm sm'}
                        handler={() => setCalculateModal(true)}
                        icon={<IconCalculator className={ButtonIconSize.hero}/>}
                    />
                </div>
                <div className="flex sinvest:hidden">
                    <UniButton
                        type={ButtonTypes.BASE}
                        text={'Calculate'}
                        isWide={true}
                        zoom={1.1}
                        size={'text-sm icon'}
                        handler={() => setCalculateModal(true)}
                        icon={<IconCalculator className={ButtonIconSize.small}/>}
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
            {isNetworkSupported && <InvestModal investModalProps={investModalProps} model={isInvestModal} setter={() => {
                setInvestModal(false)
            }}/> }
        </div>
    )
}
