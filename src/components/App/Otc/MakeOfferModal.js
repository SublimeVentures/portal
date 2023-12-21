import GenericModal from "@/components/Modal/GenericModal";
import { useState, useRef} from "react";
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


export default function MakeOfferModal({model, setter, props}) {
    const {currentMarket, diamonds, allocation, refetchVault, refetchOffers, currencies, account} = props
    const {updateBlockchainProps, insertConfiguration, blockchainCleanup ,blockchainProps} = useBlockchainContext();
    const transactionSuccessful = blockchainProps.result.transaction?.confirmation_data

    const allocationMax = allocation ? (allocation.invested - allocation.locked) : 0

    const [isBuyer, setIsBuyer] = useState(allocationMax === 0)
    const [dealCurrency, setDealCurrency] = useState(0)

    const [waitingForHash, setWaitingForHash] = useState(false)

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


    const currentMarketRef = useRef(currentMarket);
    const selectedChainRef = useRef(selectedChain);
    const priceRef = useRef(price);
    const amountRef = useRef(amount);
    const isBuyerRef = useRef(isBuyer);

    useEffect(() => {
        currentMarketRef.current = currentMarket;
        selectedChainRef.current = selectedChain;
        priceRef.current = price;
        amountRef.current = amount;
        isBuyerRef.current = isBuyer;
    }, [currentMarket, selectedChain, price, amount, isBuyer]);

    const calcPrice = (multi, amt) => {
        setPrice(Number(Number(amt * multi).toFixed(2)))
    }
    const selectedCurrency = currencyList ? currencyList[dealCurrency] : {}

    const setAmountHandler = (amt) => {
        setAmount(amt)
        if (amt) calcPrice(multiplier, amt)
    }

    const customLocks = () => {
        if(statusCheck) return {lock: true, text: "Bad parameters"}
        else if(waitingForHash) return {lock: true, text: "Generating hash"}
        else return {lock: false}
    }

    useEffect(() => {
        if (!isBuyer && amount > allocationMax) setAmountHandler(allocationMax)
    }, [isBuyer]);

    useEffect(() => {
        if (!model || !selectedCurrency?.address || price === 0 || !blockchainProps.isClean) return;
        const {lock, text} = customLocks()
        insertConfiguration({
            data: {
                amount: price,
                amountAllowance: price,
                userWallet: account.address,
                currency: selectedCurrency,
                diamond: diamond,
                button: {
                    buttonFn,
                    icon: <RocketIcon className="w-10 mr-2"/>,
                    text: "Make Offer",
                    customLockState: lock,
                    customLockText: text
                },
                transaction: {
                    type: INTERACTION_TYPE.OTC_MAKE,
                    params: {
                        listen: false,
                        diamond,
                        price,
                        selectedCurrency,
                        isSell: !isBuyer,
                        market: currentMarket.market,
                    },
                },
            },
            steps: {
                liquidity:isBuyer,
                allowance:isBuyer,
                transaction:true,
                button:true,
            },
        });
    }, [
        model,
        selectedCurrency?.address,
        price,
    ]);


    useEffect(() => {
        if (!selectedCurrency?.address || price === 0 || blockchainProps.isClean) return;
        updateBlockchainProps(
            [
                {path: 'data.currency', value: selectedCurrency},
                {path: 'data.amount', value: price},
                {path: 'data.amountAllowance', value: price},
                {path: 'data.transaction.price', value: price},
                {path: 'data.transaction.selectedCurrency', value: selectedCurrency},

                {path: 'state.liquidity.isFetched', value: false},
                {path: 'state.liquidity.isFinished', value: false},
                {path: 'state.liquidity.isError', value: false},
                {path: 'state.liquidity.error', value: null},

                {path: 'state.allowance.isFinished', value: false},
                {path: 'state.allowance.isError', value: false},
                {path: 'state.allowance.error', value: null},

                {path: 'state.transaction.isFinished', value: false},
                {path: 'state.transaction.isError', value: false},
                {path: 'state.transaction.error', value: null},

                {path: 'state.liquidity.lock', value: true},
                {path: 'state.allowance.lock', value: true},
                {path: 'state.transaction.lock', value: true},
            ]
        )
    }, [
        selectedCurrency?.address,
        price
    ]);

    useEffect(() => {
        if (!selectedCurrency?.address || blockchainProps.isClean) return;
        const {lock, text} = customLocks()

        updateBlockchainProps(
            [
                {path: 'data.button.customLockState', value: lock},
                {path: 'data.button.customLockText', value: text},
            ]
        )
    }, [
        statusCheck,
        waitingForHash
    ]);

    useEffect(() => {
        if (!selectedCurrency?.address || blockchainProps.isClean) return;
        updateBlockchainProps(
            [

                {path: 'steps.liquidity', value: isBuyer},
                {path: 'steps.allowance', value: isBuyer},
                {path: 'data.transaction.params.isSell', value: !isBuyer},
                {path: 'data.transaction.params.listen', value: false},

                {path: 'state.liquidity.isFetched', value: false},
                {path: 'state.liquidity.isFinished', value: false},
                {path: 'state.liquidity.isError', value: false},
                {path: 'state.liquidity.error', value: null},

                {path: 'state.allowance.isFinished', value: false},
                {path: 'state.allowance.isError', value: false},
                {path: 'state.allowance.error', value: null},

                {path: 'state.transaction.isFinished', value: false},
                {path: 'state.transaction.isError', value: false},
                {path: 'state.transaction.error', value: null},

                {path: 'state.liquidity.lock', value: true},
                {path: 'state.allowance.lock', value: true},
                {path: 'state.transaction.lock', value: true},
             ]
        )
    }, [
        isBuyer
    ]);


    if (!selectedChain || !currentMarket) return;

    const closeModal = async () => {
        refetchVault()
        refetchOffers()
        setter()
        setWaitingForHash(false)

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


    const buttonFn = async () => {
        setWaitingForHash(true);
        const transaction = await saveTransaction(
            currentMarketRef.current.id,
            selectedChainRef.current,
            priceRef.current,
            amountRef.current,
            !isBuyerRef.current
        );
        if (transaction.ok) {
            setWaitingForHash(false);
            return [
                { param: 'hash', value: transaction.hash },
                { param: 'listen', value: true },
            ];
        } else {
            setWaitingForHash(false);
            return {ok: false};
        }
    };

    const lockActivities = waitingForHash
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

