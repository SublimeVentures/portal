import GenericModal from "@/components/Modal/GenericModal";
import {useRef, useState} from "react";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import {ExternalLinks} from "@/routes";
import Input from "@/components/App/Input";
import {IconButton} from "@/components/Button/IconButton";
import IconPlus from "@/assets/svg/PlusZ.svg";
import IconMinus from "@/assets/svg/MinusZ.svg";
import IconDiscord from "@/assets/svg/Discord.svg";
import SwitchGeneric from "@/components/Switch";
import Dropdown from "@/components/App/Dropdown";
import Lottie from "lottie-react";
import lottieOtc from "@/assets/lottie/otc.json";
import useGetChainEnvironment from "@/lib/hooks/useGetChainEnvironment";
import Linker from "@/components/link";
import {getOtcMakeFunction} from "@/components/App/Otc/OtcSteps";
import RocketIcon from "@/assets/svg/Rocket.svg";
import {saveTransaction} from "@/fetchers/otc.fetcher";
import BlockchainSteps from "@/components/App/BlockchainSteps";
import {useEffect} from "react";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";


export default function MakeOfferModal({model, setter, props}) {
    const {currentMarket, diamonds, allocation, refetchVault, refetchOffers, currencies, account} = props
    const { updateBlockchainProps, blockchainCleanup, blockchainSummary, blockchainRunProcess } = useBlockchainContext();
    const transactionSuccessful = blockchainSummary?.transaction_result?.confirmation_data

    const allocationMax = allocation ? (allocation.invested - allocation.locked) : 0

    const [isBuyer, setIsBuyer] = useState(allocationMax === 0)
    const [dealCurrency, setDealCurrency] = useState(0)


    const [waitingForHash, setWaitingForHash] = useState(false)

    const [hash, setHash] = useState("")
    const [amount, setAmount] = useState(0)
    const [statusAmount, setStatusAmount] = useState(false)

    const [price, setPrice] = useState(0)
    const [statusPrice, setStatusPrice] = useState(false)
    const [multiplier, setMultiplier] = useState(1)

    const multiplierParsed = multiplier.toFixed(2)
    const allocationMin = 50
    const priceMin = allocationMin
    const statusCheck = statusAmount || statusPrice

    const titleCopy = isBuyer ? 'Buying' : 'Selling';
    const textCopy = isBuyer ? 'buy' : 'sell';

    const {selectedChain, currencyList, currencyNames, diamond} = useGetChainEnvironment(currencies, diamonds)

    const calcPrice = (multi, amt) => {setPrice(Number(Number(amt * multi).toFixed(2)))}
    const selectedCurrency = currencyList ? currencyList[dealCurrency] : {}

    const setAmountHandler = (amt) => {
        setAmount(amt)
        if(amt) calcPrice(multiplier, amt)
    }
    useEffect(() => {
        if(!isBuyer && amount > allocationMax) setAmountHandler(allocationMax)
    }, [isBuyer]);


    useEffect(() => {
        if(!model || !selectedCurrency?.address) return;
        const otcSellFunction = getOtcMakeFunction(hash, currentMarket.market, price, selectedCurrency, !isBuyer, diamond)


        updateBlockchainProps({
            processingData: {
                amount: price,
                amountAllowance: price,
                userWallet: account.address,
                currency: selectedCurrency,
                diamond: diamond,
                transactionData: otcSellFunction
            },
            buttonData: {
                buttonFn,
                icon: <RocketIcon className="w-10 mr-2"/>,
                text: "Make Offer",
                customLock: true,
                customLockParams: [
                    {check: statusCheck, error: "Bad parameters"},
                    {check: waitingForHash, error: "Generating hash"},
                ],
            },
            checkLiquidity: isBuyer,
            checkAllowance: isBuyer,
            checkTransaction: true,
            showButton: true,
            saveData: true,
        });
    }, [
        selectedCurrency?.address,
        model
    ]);


    if(!selectedChain || !currentMarket) return;

    const closeModal = async () => {
        refetchVault()
        refetchOffers()
        setter()
        setWaitingForHash(false)

        setTimeout(() => {
            setAmount(allocationMin)
            setMultiplier(1)
            setHash("")
            blockchainCleanup()
        }, 400);

    }

    const calcMulti = (price_) => {setMultiplier(Number(Number(price_) / Number(amount).toFixed(2)))}

    const setPriceHandler = (amt) => {
        setPrice(amt)
        if(amt && amount) calcMulti(amt)
    }
    const setMultiplierHandler = (add) => {
        if(add) {
            setMultiplier((current) => {
                calcPrice(current+0.25, amount)
                return current+0.25
            })
        } else {
            setMultiplier((current) => {
                if(current-0.25 <0) {
                    return 0
                } else {
                    calcPrice(current-0.25, amount)
                    return current-0.25
                }
            })
        }
    }

    const buttonFn = async () => {
        setWaitingForHash(true)
        const transaction = await saveTransaction(currentMarket.id, selectedChain, price, amount, !isBuyer)
        if (transaction.ok) {
            setHash(transaction.hash)
            setWaitingForHash(false)
            blockchainRunProcess();
        } else {
            setWaitingForHash(false)
            //todo: error handling
        }
    }



    const lockActivities = waitingForHash || blockchainSummary.buttonLock
    const title = () => {
        return (
            <>
                {!!transactionSuccessful ?
                    <>OTC offer <span className="text-app-success">created</span></>
                    :
                    <><span className="text-app-success">Create</span> OTC offer</>
                }
            </>
        )
    }

    const contentSuccess = () => {
        return (
            <div className=" flex flex-col flex-1">
                <div>Congratulations! You have successfully created OTC offer to <span className="text-app-success font-bold">{textCopy} ${amount}</span> allocation in <span className="font-bold text-app-success">{currentMarket.name}</span>.</div>
                <Lottie animationData={lottieOtc} loop={true} autoplay={true} style={{width: '320px', margin: '-40px auto 0px'}}/>
                <div className="mt-auto fullWidth">
                    <div className="flex flex-1 justify-center items-center -mt-5">
                        <a href={ExternalLinks.OTC_ANNOUNCE} target={"_blank"} className={"w-full"}>
                            <RoundButton text={'Announce'} isLoading={false} isDisabled={false} is3d={false} isWide={true} zoom={1.1} size={'text-sm sm'} icon={<IconDiscord className={ButtonIconSize.hero}/> } />
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    const contentForm = () => {
        return (
            <div className={`flex flex-1 flex-col`} >
                <div className={`${lockActivities ? "disabled" : ""} flex flex-1 flex-col`} >
                    <div className={'pt-5 flex flex-row gap-5 justify-center items-center font-bold text-xl'}>
                        <div className={"text-app-success"}>BUY</div>
                        <SwitchGeneric checked={!isBuyer} setChecked={setIsBuyer} isDisabled={allocationMax === 0}/>
                        <div className={"text-app-error"}>SELL</div>

                    </div>
                    <div className={'pt-10'}>
                        <Input type={'number'}
                               placeholder={`${titleCopy} allocation`}
                               max={isBuyer ? null : allocationMax}
                               min={allocationMin}
                               setStatus={setStatusAmount}
                               setInput={setAmountHandler}
                               input={amount}
                               light={true}
                               full={true}
                               dividable={10}
                               after={"USD"}
                        />
                    </div>
                    <div className={"py-10 flex flex-row justify-center items-center select-none"}>
                        <IconButton zoom={1.1} size={''} noBorder={true} icon={<IconMinus className={"w-8"}/>} handler={() => setMultiplierHandler(false)}/>
                        <div className={`px-6 font-bold tabular-nums transition-colors duration-300 text-2xl ${multiplier>1 ? ' text-app-success' : ' text-app-error'}`}>x<span className={"text-5xl"}>{multiplierParsed}</span></div>
                        <IconButton zoom={1.1} size={''} noBorder={true} icon={<IconPlus className={"w-8"}/>} handler={() => setMultiplierHandler(true)}/>
                    </div>
                    <div className={"flex flex-row w-full"}>
                        <Input type={'number'}
                               placeholder={`For price`}
                               min={priceMin}
                               setStatus={setStatusPrice}
                               setInput={setPriceHandler}
                               input={price}
                               light={true}
                               full={true}
                               customCss={"flex-1"}
                        />
                        <Dropdown options={currencyNames} classes={'!text-inherit blended'} propSelected={setDealCurrency} position={dealCurrency}/>
                    </div>
                    <BlockchainSteps/>
                </div>

                <div className="mt-auto text-center"> <Linker url={ExternalLinks.OTC} /> <span className={"ml-5"}>before creating an offer.</span></div>

            </div>
        )
    }

    const content = () => {
       return transactionSuccessful ? contentSuccess() : contentForm()
    }

    return (<GenericModal isOpen={model} closeModal={() => closeModal()} title={title()} content={content()} persistent={blockchainSummary.buttonLock}/>)
}

