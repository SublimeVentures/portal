import GenericModal from "@/components/Modal/GenericModal";
import {useState} from "react";
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
import RocketIcon from "@/assets/svg/Rocket.svg";
import {saveTransaction} from "@/fetchers/otc.fetcher";
import BlockchainSteps from "@/components/App/BlockchainSteps";
import {useEffect} from "react";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";
import {INTERACTION_TYPE} from "@/components/App/BlockchainSteps/config";

export const blockchainPrerequisite = async (params) => {
    const {currentMarket, selectedChain, price, amount, isBuyer} = params
    const transaction = await saveTransaction(currentMarket.id, selectedChain, price, amount, !isBuyer)
    if (transaction.ok) {
        return {
            ok: true,
            data: {hash: transaction.hash}
        }
    } else {
        return {
            ok: false
        }
    }
}

export default function MakeOfferModal({model, setter, props}) {
    const {currentMarket, diamonds, allocation, refetchVault, refetchOffers, currencies, account} = props
    const {updateBlockchainProps, insertConfiguration, blockchainCleanup, blockchainProps, DEFAULT_STEP_STATE} = useBlockchainContext();
    const transactionSuccessful = blockchainProps.result.transaction?.confirmation_data

    const allocationMax = allocation ? (allocation.invested - allocation.locked) : 0

    const [isBuyer, setIsBuyer] = useState(allocationMax === 0)
    const [dealCurrency, setDealCurrency] = useState(0)



    const [amount, setAmount] = useState(50)
    const [statusAmount, setStatusAmount] = useState(false)

    const [price, setPrice] = useState(50)
    const [statusPrice, setStatusPrice] = useState(false)
    const [multiplier, setMultiplier] = useState(1)

    const multiplierParsed = multiplier.toFixed(2)
    const allocationMin = 50
    const priceMin = allocationMin
    const statusCheck = statusAmount || statusPrice

    const titleCopy = isBuyer ? 'Buying' : 'Selling';
    const textCopy = isBuyer ? 'buy' : 'sell';

    const {selectedChain, currencyList, currencyNames, diamond} = useGetChainEnvironment(currencies, diamonds)

    const calcPrice = (multi, amt) => {
        setPrice(Number(Number(amt * multi).toFixed(2)))
    }
    const selectedCurrency = currencyList ? currencyList[dealCurrency] : {}

    const setAmountHandler = (amt) => {
        setAmount(amt)
        if (amt) calcPrice(multiplier, amt)
    }

    const customLocks = () => {
        if (statusCheck) return {lock: true, text: "Bad parameters"}
        else return {lock: false}
    }

    useEffect(() => {
        if (!isBuyer && amount > allocationMax) setAmountHandler(allocationMax)
    }, [isBuyer]);

    useEffect(() => {
        if (!model || !selectedCurrency?.address || price === 0 || !currentMarket?.market ||  !blockchainProps.isClean) return;
        const {lock, text} = customLocks()
        insertConfiguration({
            data: {
                amount: price,
                amountAllowance: price,
                userWallet: account.address,
                currency: selectedCurrency,
                diamond: diamond,
                button: {
                    icon: <RocketIcon className="w-10 mr-2"/>,
                    text: "Make Offer",
                    customLockState: lock,
                    customLockText: text
                },
                prerequisite: {
                    currentMarket,
                    selectedChain,
                    price,
                    amount,
                    isBuyer,
                    textProcessing: "Generating hash",
                    textError: "Couldn't generate hash"
                },
                transaction: {
                    type: INTERACTION_TYPE.OTC_MAKE,
                    params: {
                        //hash <-- from prerequisite
                        diamond,
                        price,
                        selectedCurrency,
                        isSell: !isBuyer,
                        market: currentMarket.market,
                    }
                },
            },
            steps: {
                prerequisite: true,
                liquidity: isBuyer,
                allowance: isBuyer,
                transaction: true,
                button: true,
            },
        });
    }, [
        model,
        selectedCurrency?.address,
        price,
    ]);


    useEffect(() => {
        if (!model || !selectedCurrency?.address || price === 0 || blockchainProps.isClean || !currentMarket?.market) return;
        updateBlockchainProps(
            [
                {path: 'data.amount', value: price},
                {path: 'data.amountAllowance', value: price},
                {path: 'data.currency', value: selectedCurrency},
                {path: 'data.diamond', value: diamond},

                {path: 'data.transaction.ready', value: false},
                {path: 'data.transaction.method', value: {}},

                {path: 'data.prerequisite.currentMarket', value: currentMarket},
                {path: 'data.prerequisite.selectedChain', value: selectedChain},
                {path: 'data.prerequisite.price', value: price},
                {path: 'data.prerequisite.amount', value: amount},

                {path: 'data.transaction.params.diamond', value: diamond},
                {path: 'data.transaction.params.price', value: price},
                {path: 'data.transaction.params.selectedCurrency', value: selectedCurrency},
                {path: 'data.transaction.params.market', value: currentMarket.market},

                {path: 'state.prerequisite', value: { ...DEFAULT_STEP_STATE }},
                {path: 'state.liquidity', value: { ...DEFAULT_STEP_STATE }},
                {path: 'state.allowance', value: { ...DEFAULT_STEP_STATE }},
                {path: 'state.transaction', value: { ...DEFAULT_STEP_STATE }},
            ],"make offer val change"
        )
    }, [
        selectedCurrency?.address,
        currentMarket?.market,
        price,
        amount,
        diamond
    ]);

    useEffect(() => {
        if (!selectedCurrency?.address || blockchainProps.isClean) return;
        updateBlockchainProps(
            [
                {path: 'steps.liquidity', value: isBuyer},
                {path: 'steps.allowance', value: isBuyer},

                {path: 'state.prerequisite', value: { ...DEFAULT_STEP_STATE }},
                {path: 'state.liquidity', value: { ...DEFAULT_STEP_STATE }},
                {path: 'state.allowance', value: { ...DEFAULT_STEP_STATE }},
                {path: 'state.transaction', value: { ...DEFAULT_STEP_STATE }},

                {path: 'data.prerequisite.isBuyer', value: isBuyer},

                {path: 'data.transaction.params.isSell', value: !isBuyer},
                {path: 'data.transaction.ready', value: false},
                {path: 'data.transaction.method', value: {}},
                {path: 'result.allowance', value: {}},

            ],"make order - buyer change"
        )
    }, [
        isBuyer
    ]);

    useEffect(() => {
        if (!selectedCurrency?.address || blockchainProps.isClean) return;
        const {lock, text} = customLocks()

        updateBlockchainProps(
            [
                {path: 'data.button.customLockState', value: lock},
                {path: 'data.button.customLockText', value: text},
            ],"make offer button lock"
        )
    }, [
        statusCheck,
    ]);



    if (!selectedChain || !currentMarket) return;

    const closeModal = async () => {
        refetchVault()
        refetchOffers()
        setter()

        setTimeout(() => {
            setAmount(allocationMin)
            setMultiplier(1)
            blockchainCleanup()
        }, 400);

    }

    const calcMulti = (price_) => {
        setMultiplier(Number(Number(price_) / Number(amount).toFixed(2)))
    }
    const setPriceHandler = (amt) => {
        setPrice(amt)
        if (amt && amount) calcMulti(amt)
    }
    const setMultiplierHandler = (add) => {
        if (add) {
            setMultiplier((current) => {
                calcPrice(current + 0.25, amount)
                return current + 0.25
            })
        } else {
            setMultiplier((current) => {
                if (current - 0.25 < 0) {
                    return 0
                } else {
                    calcPrice(current - 0.25, amount)
                    return current - 0.25
                }
            })
        }
    }


    const lockActivities = false
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
                <div>Congratulations! You have successfully created OTC offer to <span
                    className="text-app-success font-bold">{textCopy} ${amount}</span> allocation in <span
                    className="font-bold text-app-success">{currentMarket.name}</span>.
                </div>
                <Lottie animationData={lottieOtc} loop={true} autoplay={true}
                        style={{width: '320px', margin: '-40px auto 0px'}}/>
                <div className="mt-auto fullWidth">
                    <div className="flex flex-1 justify-center items-center -mt-5">
                        <a href={ExternalLinks.OTC_ANNOUNCE} target={"_blank"} className={"w-full"}>
                            <RoundButton text={'Announce'} isLoading={false} isDisabled={false} is3d={false}
                                         isWide={true} zoom={1.1} size={'text-sm sm'}
                                         icon={<IconDiscord className={ButtonIconSize.hero}/>}/>
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    const contentForm = () => {
        return (
            <div className={`flex flex-1 flex-col`}>
                <div className={`${lockActivities ? "disabled" : ""} flex flex-1 flex-col`}>
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
                        <IconButton zoom={1.1} size={''} noBorder={true} icon={<IconMinus className={"w-8"}/>}
                                    handler={() => setMultiplierHandler(false)}/>
                        <div
                            className={`px-6 font-bold tabular-nums transition-colors duration-300 text-2xl ${multiplier > 1 ? ' text-app-success' : ' text-app-error'}`}>x<span
                            className={"text-5xl"}>{multiplierParsed}</span></div>
                        <IconButton zoom={1.1} size={''} noBorder={true} icon={<IconPlus className={"w-8"}/>}
                                    handler={() => setMultiplierHandler(true)}/>
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
                        <Dropdown options={currencyNames} classes={'!text-inherit blended'}
                                  propSelected={setDealCurrency} position={dealCurrency}/>
                    </div>
                    <BlockchainSteps/>
                </div>

                <div className="mt-auto text-center"><Linker url={ExternalLinks.OTC}/> <span className={"ml-5"}>before creating an offer.</span>
                </div>

            </div>
        )
    }

    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentForm()
    }

    return (<GenericModal isOpen={model} closeModal={() => closeModal()} title={title()} content={content()}
                          persistent={blockchainProps.state.button.lock}/>)
}

