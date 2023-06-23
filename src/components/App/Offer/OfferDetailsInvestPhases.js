import moment from 'moment'
import {useEffect, useState} from "react";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconWait from "@/assets/svg/Wait.svg";
import IconPantheon from "@/assets/svg/Pantheon.svg";
import IconWhale from "@/assets/svg/Whale.svg";
import IconLock from "@/assets/svg/Lock.svg";
import IconCalculator from "@/assets/svg/Calculator.svg";
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import {parseMaxAllocation} from "@/lib/phases";
import {expireHash, fetchHash} from "@/fetchers/invest.fetcher";
import ErrorModal from "@/components/App/Offer/ErrorModal";
import InvestModal from "@/components/App/Offer/InvestModal";
import {useCookies} from 'react-cookie';
import RestoreHashModal from "@/components/App/Offer/RestoreHashModal";
import CalculateModal from "@/components/App/Offer/CalculateModal";
import {useNetwork} from "wagmi";
import {Transition} from "@headlessui/react";
import {Fragment} from "react";
import IconCancel from "@/assets/svg/Cancel.svg";
import Dropdown from "@/components/App/Dropdown";

export default function OfferDetailsInvestPhases({paramsInvestPhase}) {
    const {
        offer,
        activePhase,
        currentPhase,
        account,
        currencies,
        refetchAllocation,
        refetchUserAllocation,
        allocation
    } = paramsInvestPhase;

    const {chain, chains} = useNetwork()

    const [isErrorModal, setErrorModal] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const [isRestoreHash, setRestoreHashModal] = useState(false)
    const [allocationOld, setOldAllocation] = useState(0)

    const [isInvestModal, setInvestModal] = useState(false)
    const [isCalculateModal, setCalculateModal] = useState(false)

    const [expires, setExpires] = useState(0)
    const [isAllocationOk, setIsAllocationOk] = useState(true)
    const [isButtonLoading, setButtonLoading] = useState(false)
    const [isFilled, setFilled] = useState(false)

    const [investmentCurrency, setInvestmentCurrency] = useState(0)
    const [maxAllocation, setMaxAllocation] = useState(0)
    const [hash, setHash] = useState(0)

    const [investmentAmount, setInvestmentAmount] = useState(0)
    const [investmentAmountFormatted, setInvestmentAmountFormatted] = useState("")
    const [showInputInfo, setShowInputInfo] = useState(false)
    const [showClean, setShowClean] = useState(false)
    let [isError, setIsError] = useState({})


    const [cookies, setCookie, removeCookie] = useCookies();

    const {ACL, multi} = account
    const {id, alloTotal, isPaused} = offer




    const isProcessing = alloTotal <= allocation?.alloFilled + allocation?.alloRes
    const investButtonDisabled = currentPhase?.isDisabled || isAllocationOk || isFilled || isPaused || isProcessing

    const isNetworkSupported = !!chains.find(el => el.id === chain?.id)

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
        switch (currentPhase.icon) {
            case "wait": {
                return <IconWait className={ButtonIconSize.invest}/>
            }
            case "vote": {
                return <IconPantheon className={ButtonIconSize.invest}/>
            }
            case "invest": {
                return <IconWhale className={ButtonIconSize.invest}/>
            }
            case "closed": {
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
        if (alloTotal <= allocation?.alloFilled + allocation?.alloRes) {
            setFilled(true)
        } else {
            setFilled(false)
        }
        const allocationLeft = alloTotal - allocation?.alloFilled - allocation?.alloRes
        const calcMaxAllo = parseMaxAllocation(ACL, multi, offer, activePhase, allocationLeft)
        setMaxAllocation(calcMaxAllo)
    }, [allocation?.alloFilled, allocation?.alloRes])

    useEffect(() => {
        setInvestmentCurrency(0)
    }, [chain])

    useEffect(() => {
          setValue(offer.alloMin)
    }, []);

    useEffect(() => {
        if (investmentAmount < offer.alloMin) {
            setIsAllocationOk(true)
            return setIsError({state: true, msg: `Minimum investment: $${offer.alloMin.toLocaleString()}`})
        } else if (investmentAmount > maxAllocation) {
            setIsAllocationOk(true)
            return setIsError({state: true, msg: `Maximum investment: $${maxAllocation.toLocaleString()}`})
        } else {
            if(investmentAmount % 100 > 0) {
                setIsAllocationOk(true)
                return setIsError({state: true, msg: `Allocation has to be divisible by $100`})
            }
            setIsAllocationOk(false)
            return setIsError({state: false, msg: `Minimum investment: $${offer.alloMin.toLocaleString()}`})
        }

    }, [investmentAmount]);

    useEffect(() => {
        if (showInputInfo) {
            setShowClean(showInputInfo)
        } else {
            setTimeout(() => {
                setShowClean(showInputInfo)
            }, 500);
        }
    }, [showInputInfo]);



    const restoreModalProps = {expires, allocationOld, investmentAmount, bookingExpire, bookingRestore, bookingCreateNew}
    const errorModalProps = {code: errorMsg}
    const calculateModalProps = {investmentAmount, maxAllocation, offer}
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
        <div className="flex flex-1 flex-col items-center justify-center ">


            <div className="mt-15 lg:mt-auto">
                <div className="currency-input-group relative">
                    <div className={`relative centr ${investmentAmount > 0 ? 'active' : ''}`}>
                        <label className="absolute text-accent block">Investment size</label>
                        <input tabIndex="0"
                               value={investmentAmountFormatted}
                               onChange={onInputChange}
                               onKeyDown={checkIfNumber}
                               onFocus={() => setShowInputInfo(true)}
                               onBlur={() => setShowInputInfo(false)}
                               className={`h-17 text-xl px-4 ${isInputActive ? 'highlight' : ''} ${investmentAmount >= offer.alloMin && investmentAmount <= maxAllocation ? 'valid' : ''} ${investmentAmount < offer.alloMin || investmentAmount > maxAllocation ? 'invalid' : ''}`}
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
                    <RoundButton text={isFilled ? 'Processing...' : currentPhase.action} isPrimary={true}
                                 showParticles={true}
                                 isLoading={isButtonLoading} is3d={true} isWide={true} zoom={1.1}
                                 handler={makeInvestment}
                                 size={'text-sm sm'} icon={getInvestmentButtonIcon()}/>
                </div>
                <div className="hidden sinvest:flex">
                    <RoundButton text={'Calculate'} isWide={true} zoom={1.1} size={'text-sm sm'}
                                 handler={() => setCalculateModal(true)}
                                 icon={<IconCalculator className={ButtonIconSize.hero}/>}/>

                </div>
                <div className="flex sinvest:hidden">
                    <RoundButton text={''} isWide={true} zoom={1.1} size={'text-sm icon'}
                                 handler={() => setCalculateModal(true)}
                                 icon={<IconCalculator className={ButtonIconSize.small}/>}/>
                </div>
            </div>

            <RestoreHashModal restoreModalProps={restoreModalProps} model={isRestoreHash} setter={() => {
                setRestoreHashModal(false)
            }}/>
            <CalculateModal calculateModalProps={calculateModalProps} model={isCalculateModal} setter={() => {
                setCalculateModal(false)
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
