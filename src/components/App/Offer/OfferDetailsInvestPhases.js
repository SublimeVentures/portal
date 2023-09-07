import moment from 'moment'
import {useEffect, useState} from "react";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import IconWait from "@/assets/svg/Wait.svg";
import IconPantheon from "@/assets/svg/Pantheon.svg";
import IconWhale from "@/assets/svg/Whale.svg";
import IconLock from "@/assets/svg/Lock.svg";
import IconCalculator from "@/assets/svg/Calculator.svg";
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import { PhaseId, processAllocations} from "@/lib/phases";
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
import {isBased} from "@/lib/utils";
import {ACLs} from "@/lib/authHelpers";
import {IconButton} from "@/components/Button/IconButton";
import IconPremium from "@/assets/svg/Premium.svg";
import {Tooltiper, TooltipType} from "@/components/Tooltip";

const setButtonText = (isPaused, isSettled, offerIsProcessing, offerIsSettled, allocationUserGuaranteed, defaultText, investmentAmount) => {
    if(isPaused) return "Investment Paused"
    else if (isSettled) return "Filled"
    else if (allocationUserGuaranteed>0) return defaultText
    else if (offerIsSettled) return "Filled"
    else if (offerIsProcessing) return "Processing..."
    else return defaultText
}

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
        upgradesUsedRefetch,
        upgradesUsedSuccess,
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
    const [isAllocationOk, setIsAllocationOk] = useState(true)
    const [isButtonLoading, setButtonLoading] = useState(false)

    const [investmentCurrency, setInvestmentCurrency] = useState(0)
    const [hash, setHash] = useState(0)

    const [investmentAmount, setInvestmentAmount] = useState(0)
    const [investmentAmountFormatted, setInvestmentAmountFormatted] = useState("")
    const [showInputInfo, setShowInputInfo] = useState(false)
    const [showClean, setShowClean] = useState(false)
    const [isError, setIsError] = useState({})

    const [allocationData, setAllocationData] = useState({
        allocationUserMax: 0,
        allocationUserLeft: 0,
        allocationPoolLeft:0,
        canInvestMore: false,
        offerIsProcessing: false,
        offerIsSettled: false,
    })


    const [cookies, setCookie, removeCookie] = useCookies();
    const isNetworkSupported = !!chains.find(el => el.id === chain?.id)
    const {ACL, isStaked} = account
    const {id, isSettled, isPaused} = offer

    const ntStakeGuard = ACL === ACLs.NeoTokyo && !isStaked

    const investButtonDisabled =
        isPaused ||
        phaseCurrent?.controlsDisabled ||
        ntStakeGuard ||
        !investmentAmount ||
        !isAllocationOk ||
        (
            allocationData.allocationUserGuaranteed ?
            (
                allocationData.offerIsProcessing && allocationData.allocationUserGuaranteed === 0 ||
                allocationData.offerIsSettled && allocationData.allocationUserGuaranteed === 0
            )
            : (
                allocationData.offerIsProcessing ||
                allocationData.offerIsSettled
                )
        )


    const buttonText = setButtonText(isPaused, isSettled, allocationData.offerIsProcessing, allocationData.offerIsSettled, allocationData.allocationUserGuaranteed, phaseCurrent.button, investmentAmount)

    const selectedChain = chain?.id ? chain.id : Object.keys(currencies)[0]
    const currencyList = currencies[selectedChain] ? Object.keys(currencies[selectedChain]).map(el => {
        let currency = currencies[selectedChain][el]
        currency.address = el
        return currency
    }) : [{}]

    const currencyNames = currencyList.map(el => el.symbol)
    const selectedCurrency = currencyList[investmentCurrency]

    const cookieReservation = `hash_${id}`

    const checkIfNumber = (event) => {
        if (event.key.length === 1 && /\D/.test(event.key)) {
            return;
        }
    }

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
        const response = await fetchHash(id, investmentAmount, selectedCurrency.address, chain.id)
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

        if (Number(cookieData[2]) < moment().unix()) {
            removeCookie(cookieReservation)
            await startInvestmentProcess()
        } else if (Number(cookieData[1]) === Number(investmentAmount)) {
            openInvestmentModal(cookieData[0], cookieData[2])
        } else {
            setOldAllocation(Number(cookieData[1]))
            setExpires(Number(cookieData[2]))
            setRestoreHashModal(true)
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
        expireHash(id, cookieData[0])
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
        setValue(offer.alloMin)
    }, []);

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
        const allocations = processAllocations(account, phaseCurrent, upgradesUse, userAllocation, offer, allocation)
        setAllocationData(allocations)
    }, [allocation?.alloFilled, allocation?.alloRes, upgradesUse?.increasedUsed?.amount, userAllocation])

    useEffect(() => {
        if(allocationData.allocationUserGuaranteed > 0) {

            if (investmentAmount > allocationData.allocationUserLeft + allocationData.allocationUserGuaranteed) {
                setIsAllocationOk(false)
                return setIsError({state: true, msg: `Maximum investment: $${(allocationData.allocationUserLeft > allocationData.allocationUserGuaranteed ? allocationData.allocationUserLeft : allocationData.allocationUserGuaranteed).toLocaleString()}`})
            }
            else if (!allocationData.allocationUserCurrent && investmentAmount < offer.alloMin) {
                setIsAllocationOk(false)
                return setIsError({state: true, msg: `Minimum investment: $${offer.alloMin.toLocaleString()}`})
            }
            else if(investmentAmount % (allocationData.allocationUserCurrent > 0 ? 50 : 100) > 0 || investmentAmount <= 0) {
                setIsAllocationOk(false)
                return setIsError({state: true, msg: `Allocation has to be divisible by $${allocationData.allocationUserCurrent > 0 ? 50 : 100}`})
            }
            else if (investmentAmount <= allocationData.allocationUserLeft + allocationData.allocationUserGuaranteed) {
                setIsAllocationOk(true)
                return setIsError({state: false, msg: `Maximum investment: $${(allocationData.allocationUserLeft > allocationData.allocationUserGuaranteed ? allocationData.allocationUserLeft : allocationData.allocationUserGuaranteed).toLocaleString()}`})
            }
            else {
                setIsAllocationOk(true)
                return setIsError({state: false, msg: `Maximum investment: $${allocationData.allocationUserLeft.toLocaleString()}`})
            }
        } else {
            if (allocationData.allocationUserLeft === 0) {
                setIsAllocationOk(false)
                return setIsError({state: true, msg: `Maximum allocation filled`})
            }
            else if (!allocationData.allocationUserCurrent && investmentAmount < offer.alloMin) {
                setIsAllocationOk(false)
                return setIsError({state: true, msg: `Minimum investment: $${offer.alloMin.toLocaleString()}`})
            }
            else if(investmentAmount % (allocationData.allocationUserCurrent > 0 ? 50 : 100) > 0 || investmentAmount <= 0) {
                setIsAllocationOk(false)
                return setIsError({state: true, msg: `Allocation has to be divisible by $${allocationData.allocationUserCurrent > 0 ? 50 : 100}`})
            }
            else if (investmentAmount > allocationData.allocationUserLeft) {
                    setIsAllocationOk(false)
                    return setIsError({state: true, msg: `Maximum investment: $${allocationData.allocationUserLeft.toLocaleString()}`})
            }
            else if (investmentAmount <= allocationData.allocationUserLeft) {
                setIsAllocationOk(true)
                return setIsError({state: false, msg: `Maximum investment: $${(allocationData.allocationUserLeft).toLocaleString()}`})
            }
            else {
                setIsAllocationOk(true)
                return setIsError({state: false, msg: `Maximum investment: $${allocationData.allocationUserLeft.toLocaleString()}`})
            }
        }

    }, [investmentAmount, allocationData.allocationUserCurrent, allocationData.allocationUserLeft, allocationData.allocationUserGuaranteed, upgradesUse?.increasedUsed?.amount]);




    const restoreModalProps = {expires, allocationOld, investmentAmount, bookingExpire, bookingRestore, bookingCreateNew}
    const errorModalProps = {code: errorMsg}
    const upgradesModalProps = {account,  phaseCurrent, offerId: offer.id, upgradesUsedRefetch, upgradesUsedSuccess, upgradesUse, allocationUserLeft: allocationData.allocationUserLeft}
    const calculateModalProps = {investmentAmount, maxAllocation: allocationData.allocationUserMax, offer}
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
                    {!!upgradesUse.guaranteedUsed && <div className={"mr-3 font-bold glow select-none"}> <Tooltiper wrapper={`GUARANTEED`} text={`$${allocationData.allocationUserGuaranteed} left`} type={TooltipType.Primary}/> </div>}
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
                               onKeyDown={checkIfNumber}
                               onFocus={() => setShowInputInfo(true)}
                               onBlur={() => setShowInputInfo(false)}
                               className={`h-17 text-xl px-4 ${isInputActive ? 'highlight' : ''} ${investmentAmount >= offer.alloMin && investmentAmount <= allocationData.allocationUserMax ? 'valid' : ''} ${investmentAmount < offer.alloMin || investmentAmount > allocationData.allocationUserMax ? 'invalid' : ''}`}
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
                                    setValue(offer.alloMin)
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

            <div className="flex flex-row flex-wrap justify-center gap-2 py-10 px-2">
                <div className={investButtonDisabled ? 'disabled' : ''}>
                    <UniButton
                        type={ButtonTypes.BASE}
                        text={buttonText}
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
