import moment from 'moment'
import {useEffect, useState} from "react";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconWait from "@/assets/svg/Wait.svg";
import IconPantheon from "@/assets/svg/Pantheon.svg";
import IconWhale from "@/assets/svg/Whale.svg";
import IconLock from "@/assets/svg/Lock.svg";
import IconCalculator from "@/assets/svg/Calculator.svg";
import CurrencyInput from "@/components/App/CurrencyInput";
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import {parseMaxAllocation} from "@/lib/phases/parsePhase";
import {expireHash, fetchHash} from "@/fetchers/invest.fetcher";
import {useSession} from "next-auth/react";
import ErrorModal from "@/components/App/Offer/ErrorModal";
import InvestModal from "@/components/App/Offer/InvestModal";
import {useCookies} from 'react-cookie';
import RestoreHashModal from "@/components/App/Offer/RestoreHashModal";
import CalculateModal from "@/components/App/Offer/CalculateModal";
import {useNetwork} from "wagmi";

export default function OfferDetailsInvestPhases({paramsInvestPhase}) {
    const {
        offer,
        phases,
        activePhase,
        isLastPhase,
        feedPhases: refreshInvestmentPhase,
        currencies,
        refetchAllocation,
        refetchUserAllocation,
        allocation
    } = paramsInvestPhase;
    const {data: session} = useSession()
    const { chain } = useNetwork()

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

    const [investmentSize, setInvestmentSize] = useState(0)
    const [investmentCurrency, setInvestmentCurrency] = useState(0)
    const [maxAllocation, setMaxAllocation] = useState(0)
    const [hash, setHash] = useState(0)

    const [cookies, setCookie, removeCookie] = useCookies();

    const {ACL, amt} = session.user
    const {id, alloTotal, tax, isPaused} = offer

    const currentPhase = phases[activePhase]
    const nextPhase = isLastPhase ? currentPhase : phases[activePhase + 1]

    const isProcessing = alloTotal <= allocation?.alloFilled + allocation?.alloRes
    const investButtonDisabled = currentPhase?.isDisabled || isAllocationOk || isFilled || isPaused || isProcessing

    const selectedChain = chain?.id ? chain.id : Object.keys(currencies)[0]
    const currencyList = currencies[selectedChain] ? Object.keys(currencies[selectedChain]).map(el => {
        let currency = currencies[selectedChain][el]
        currency.address = el
        return currency
    }) : [{}]

    const currencyNames = currencyList.map(el => el.symbol)
    const selectedCurrency = currencyList[investmentCurrency]

    const cookieReservation = `hash_${id}`

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
        const response = await fetchHash(id, investmentSize, selectedCurrency.address, chain.id)
        if (!response.ok) {
            setErrorMsg(response.code)
            setErrorModal(true)
            refetchAllocation()
        } else {
            setCookie(cookieReservation, `${response.hash}_${investmentSize}_${response.expires}`, {expires: new Date(response.expires * 1000)})
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
        } else if (Number(cookieData[1]) === Number(investmentSize)) {
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
        setInvestmentSize(Number(cookieData[1]))
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
        const calcMaxAllo = parseMaxAllocation(ACL, amt, offer, activePhase, allocationLeft)
        setMaxAllocation(calcMaxAllo)
    }, [allocation?.alloFilled, allocation?.alloRes])

    useEffect(() => {
        setInvestmentCurrency(0)
    }, [chain])

    const restoreModalProps = {expires, allocationOld, investmentSize, bookingExpire, bookingRestore, bookingCreateNew}
    const errorModalProps = {code: errorMsg}
    const calculateModalProps = { investmentSize, maxAllocation, offer}
    const investModalProps = {expires, investmentSize, offer, bookingExpire, hash, selectedCurrency, afterInvestmentCleanup}

    return (
        <div className="flex flex-1 flex-col items-center">
            <div
                className="flex flex-col flex-wrap justify-center items-center pt-5 sinvest:flex-row sinvest:pr-5 sinvest:self-end sinvest:items-start">
                <div className="text-lg mt-3 mb-5 sinvest:mb-0 sinvest:mr-3 sinvest:mt-[0.70rem]">Phase <span
                    className="text-gold uppercase  font-[500]">{currentPhase.step}</span> ends in
                </div>
                <FlipClockCountdown
                    className="flip-clock"
                    onComplete={() => refreshInvestmentPhase()}
                    to={moment.unix(nextPhase.start)}
                    labels={['DAYS', 'HOURS', 'MINUTES', 'SECONDS']}
                />
            </div>

            <div className="mt-15 xl:mt-auto">
                <CurrencyInput
                    type={'number'}
                    placeholder={'Investment size'}
                    max={maxAllocation}
                    min={offer.alloMin}
                    currencies={currencyNames}
                    setStatus={setIsAllocationOk}
                    shareInput={setInvestmentSize}
                    shareCurrency={setInvestmentCurrency}
                    investmentCurrency={investmentCurrency}/>
            </div>

            <div className="flex flex-row flex-wrap justify-center gap-2 pt-10 pb-10">
                <div className={investButtonDisabled ? 'disabled' : ''}>
                    <RoundButton text={isFilled ? 'Processing...' : currentPhase.copy} isPrimary={true}
                                 showParticles={true}
                                 isLoading={isButtonLoading} is3d={true} isWide={true} zoom={1.1}
                                 handler={makeInvestment}
                                 size={'text-sm sm'} icon={getInvestmentButtonIcon()}/>
                </div>
                <div className="hidden sinvest:flex">
                    <RoundButton text={'Calculate'} isWide={true} zoom={1.1} size={'text-sm sm'} handler={() => setCalculateModal(true)}
                                 icon={<IconCalculator className={ButtonIconSize.hero}/>}/>
                </div>
                <div className="flex sinvest:hidden">
                    <RoundButton text={''} isWide={true} zoom={1.1} size={'text-sm icon'} handler={() => setCalculateModal(true)}
                                 icon={<IconCalculator className={ButtonIconSize.small}/>}/>
                </div>
            </div>

            <RestoreHashModal restoreModalProps={restoreModalProps} model={isRestoreHash} setter={() => {setRestoreHashModal(false)}}/>
            <CalculateModal calculateModalProps={calculateModalProps} model={isCalculateModal} setter={() => {setCalculateModal(false)}}/>
            <ErrorModal errorModalProps={errorModalProps} model={isErrorModal} setter={() => {setErrorModal(false)}} />
            <InvestModal investModalProps={investModalProps} model={isInvestModal} setter={() => {setInvestModal(false)}}/>
        </div>
    )
}
