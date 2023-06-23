import GenericModal from "@/components/Modal/GenericModal";
import {useEffect, useState} from "react";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import PAGE from "@/routes";
import Link from "next/link";
import Input from "@/components/App/Input";
import {IconButton} from "@/components/Button/IconButton";
import IconPlus from "@/assets/svg/PlusZ.svg";
import IconMinus from "@/assets/svg/MinusZ.svg";
import IconDiscord from "@/assets/svg/Discord.svg";
import {useNetwork} from "wagmi";
import SwitchGeneric from "@/components/Switch";
import Dropdown from "@/components/App/Dropdown";
import MakeOfferInteract from "@/components/App/Otc/MakeOfferInteract";



export default function MakeOfferModal({model, setter, props}) {
    const {currentMarket, multichain, allocation, refetchVault, refetchOffers, source, currencies} = props
        // const {data: session} = useSession()
    const session = {} //todo: sesja
    const {chain} = useNetwork()

    const [isBuyer, setIsBuyer] = useState(false)
    const [dealCurrency, setDealCurrency] = useState(0)
    const [isSuccess, setIsSuccess] = useState(false)

    const [processing, setProcessing] = useState(false)


    const [amount, setAmount] = useState(0)
    const [statusAmount, setStatusAmount] = useState(false)

    const [price, setPrice] = useState(0)
    const [statusPrice, setStatusPrice] = useState(false)


    const [multiplier, setMultiplier] = useState(1)


    const multiplierParsed = multiplier.toFixed(2)

    const allocationMax = allocation.invested - allocation.locked
    const allocationMin = 50
    const priceMin = allocationMin
    const statusCheck = statusAmount || statusPrice

    const titleCopy = isBuyer ? 'Buying' : 'Selling';
    const textCopy = isBuyer ? 'buy' : 'sell';
    const selectedChain = chain?.id ? chain.id : Object.keys(currencies)[0]
    const currencyList = currencies[selectedChain] ? Object.keys(currencies[selectedChain]).map(el => {
        let currency = currencies[selectedChain][el]
        currency.address = el
        return currency
    }) : [{}]

    const currencyNames = currencyList.map(el => el.symbol)
    const selectedCurrency = currencyList[dealCurrency]

    const closeModal = async () => {
        refetchVault()
        refetchOffers()
        setter()
        setProcessing(false)

        setTimeout(() => {
            setAmount(allocationMin)
            setMultiplier(1)
            // setError(null)
            // setHash("")
        }, 1000);

    }


    const calcPrice = (multi, amt) => {setPrice(Number(Number(amt * multi).toFixed(2)))}
    const calcMulti = (price_) => {setMultiplier(Number(Number(price_) / Number(amount).toFixed(2)))}

    const setAmountHandler = (amt) => {
        setAmount(amt)
        if(amt) calcPrice(multiplier, amt)
    }

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

    const interactionProps = {
        amount,
        statusAmount,
        statusPrice,
        price,
        dealCurrency,
        isBuyer,
        session,
        allocationMax,
        currentMarket,
        selectedCurrency,
        setIsSuccess,
        statusCheck,
        processing,
        setProcessing,
        chain,
        refetchVault,
        diamond: multichain[selectedChain],
    }

    const title = () => {
        return (
            <>
                {!!isSuccess ?
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
                <lottie-player
                    autoplay
                    loop
                    style={{width: '320px', margin: '-40px auto 0px'}}
                    mode="normal"
                    src="/static/lottie/otc.json"
                />
                <div className="mt-auto fullWidth">

                    <div className="flex flex-1 justify-center items-center -mt-5 mb-5">
                        <Link href={PAGE.App} className={"w-full"}>
                            <RoundButton text={'Announce'} isLoading={false} isDisabled={false} is3d={false} isWide={true} zoom={1.1} size={'text-sm sm'} icon={<IconDiscord className={ButtonIconSize.hero}/> } />
                        </Link>
                    </div>
                <div className="mt-auto">What's next? <a href="#" target="_blank">Read more</a></div>
                </div>
            </div>
        )
    }



    const contentForm = () => {
        return (
            <div className=" flex flex-1 flex-col">
                <div className={'pt-5 flex flex-row gap-5 justify-center items-center font-bold text-xl'}>
                    <div className={"text-app-success"}>BUY</div>
                    <SwitchGeneric checked={!isBuyer} setChecked={setIsBuyer} isDisabled={processing}/>
                    <div className={"text-app-error"}>SELL</div>

                </div>
                <div className={'pt-10'}>
                    <Input type={'number'}
                           placeholder={`${titleCopy} allocation`}
                           max={allocationMax}
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
                <div className={"flex flex-row flex-1"}>
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

                <MakeOfferInteract props={interactionProps}/>

                <div className="">Before creating an offer, please <a
                    href="#" target="_blank" className="text-app-success">read more</a></div>
            </div>
        )
    }

    const content = () => {
       return isSuccess ? contentSuccess() : contentForm()
    }

    return (<GenericModal isOpen={model} closeModal={() => closeModal()} title={title()} content={content()} />)
}

