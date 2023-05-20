import GenericModal from "@/components/Modal/GenericModal";
import {useEffect, useState} from "react";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import PAGE from "@/routes";
import Link from "next/link";
import {useSession} from "next-auth/react";
import Input from "@/components/App/Input";
import {IconButton} from "@/components/Button/IconButton";
import IconPlus from "@/assets/svg/PlusZ.svg";
import IconMinus from "@/assets/svg/MinusZ.svg";
import RocketIcon from "@/assets/svg/Rocket.svg";
import IconDiscord from "@/assets/svg/Discord.svg";
import {useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import {getOtcTradeFunction} from "@/components/App/Otc/OtcSteps";
import SwitchGeneric from "@/components/Switch";
import Dropdown from "@/components/App/Dropdown";
import {removeTransaction, saveTransaction} from "@/fetchers/otc.fetcher";


const parseError = (code) => {
    switch(code) {
        case "NOT_ENOUGH_ALLOCATION": {
            return "You don't have enough available allocation."
        }
    }
}


export default function MakeOfferModal({model, setter, props}) {
    const {currentMarket, multichain, allocation, refetchVault, refetchOffers, source, currencies} = props
    const {data: session} = useSession()
    const {chain} = useNetwork()

    const {address, ACL, id} = session.user


    const [isBuyer, setIsBuyer] = useState(false)
    const [hash, setHash] = useState("")
    const titleCopy = isBuyer ? 'Buying' : 'Selling';
    const textCopy = isBuyer ? 'buy' : 'sell';
    const [investmentCurrency, setInvestmentCurrency] = useState(0)
    const selectedChain = chain?.id ? chain.id : Object.keys(currencies)[0]
    const currencyList = currencies[selectedChain] ? Object.keys(currencies[selectedChain]).map(el => {
        let currency = currencies[selectedChain][el]
        currency.address = el
        return currency
    }) : [{}]

    const currencyNames = currencyList.map(el => el.symbol)
    const selectedCurrency = currencyList[investmentCurrency]


    const [amount, setAmount] = useState(0)
    const [price, setPrice] = useState(0)
    const [multiplier, setMultiplier] = useState(1)

    const allocationMax = allocation.invested - allocation.locked
    const allocationMin = 50
    const priceMin = allocationMin

    const [statusAmount, setStatusAmount] = useState(false)
    const [statusPrice, setStatusPrice] = useState(false)
    const [error, setError] = useState(null)
    const [processing, setProcessing] = useState(false)
    const statusCheck = statusAmount || statusPrice
    const multiplierParsed = multiplier.toFixed(2)


    const otcSellFunction = getOtcTradeFunction(isBuyer, multichain[selectedChain], currentMarket.id, amount, price, selectedCurrency, hash)

    const {config, isSuccess: isSuccessPrepare, isLoading, isError: isErrorPrep, error:errorPrep} = usePrepareContractWrite({
        address: otcSellFunction.address,
        abi: otcSellFunction.abi,
        functionName: otcSellFunction.method,
        args: otcSellFunction.args,
        overrides: {
            from: address,
        },
        enabled: !statusCheck && model && hash
    })

    const {
        data: transactionData,
        write,
        isError: isErrorWrite,
        error: errorWrite,
        isLoading: isLoadingWrite
    } = useContractWrite(config)

    const {data: confirmationData, isError: isErrorConfirmation } = useWaitForTransaction({
        confirmations: 1,
        hash: transactionData?.hash,
    })

    const buttonDisabled = statusCheck || allocationMax <= 0
    const buttonLoading = processing || (isSuccessPrepare && ( hash && !isSuccessPrepare || isLoading || isLoadingWrite)) //todo: waiting for confirmations
    console.log("SELL :: buttonLoading", buttonLoading )

    const closeModal = async () => {
        await refetchVault()
        await refetchOffers()
        setter()
        setTimeout(() => {
            setAmount(allocationMin)
            setMultiplier(1)
            setError(null)
            setHash("")
            setProcessing(false)
        }, 1000);

    }

    const makeOffer = async ()  => {
        setProcessing(true)
        setError(null);
        const result = await saveTransaction(currentMarket.id, chain.id, isBuyer, amount, price)
        if(result.ok) {
            setHash(result.hash)
        } else {
            setError(parseError(result.code))
            await refetchVault()
            setProcessing(false)
        }
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

    useEffect(()=> {
        if(isSuccessPrepare) {
            write()
        }
    }, [isSuccessPrepare])

    useEffect(()=> {
        if(isErrorWrite || isErrorConfirmation) {
            if(hash.length>0) {
                removeTransaction(currentMarket.id, hash)
                setProcessing(false)
                setHash("")
            }
        }
    }, [isErrorWrite, isErrorConfirmation])

    // useEffect(()=> {
    //     // if(!!confirmationData || isErrorWrite || Object.keys(isErrorConfirmation).length > 0) setProcessing(false)
    // }, [confirmationData, isErrorWrite, isErrorConfirmation, isLoadingWrite])


    const title = () => {
        return (
            <>
                {!!confirmationData ?
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
                <div>Congratulations! You have successfully created OTC offer to {textCopy} <span className="text-app-success font-bold">${amount}</span> allocation in <span className="font-bold text-app-success">{currentMarket.name}</span>.</div>
                <lottie-player
                    autoplay
                    loop
                    style={{width: '320px', margin: '-40px auto 0px'}}
                    mode="normal"
                    src="/static/lottie/otc.json"
                />
                <div className="mt-auto fullWidth">

                    <div className="flex flex-1 justify-center items-center -mt-5 mb-5">
                        <Link href={PAGE.Vault} className={"w-full"}>
                            <RoundButton text={'Announce'} isLoading={false} isDisabled={false} is3d={false} isWide={true} zoom={1.1} size={'text-sm sm'} icon={<IconDiscord className={ButtonIconSize.hero}/> } />
                        </Link>
                    </div>
                <div className="mt-auto"><a href="#" target="_blank" className="text-outline">What's next? Read more.</a></div>
                </div>
            </div>
        )
    }



    const contentForm = () => {
        return (
            <div className=" flex flex-1 flex-col">
                <div className={'pt-5 flex flex-row gap-5 justify-center items-center font-bold text-xl'}>
                    <div className={"text-app-success"}>BUY</div>
                    <SwitchGeneric checked={!isBuyer} setChecked={setIsBuyer}/>
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
                    <Dropdown options={currencyNames} classes={'!text-inherit blended'} propSelected={setInvestmentCurrency} position={investmentCurrency}/>

                </div>


                <div className={"fullWidth py-10 mt-auto"}>
                    <RoundButton text={'Make offer'} isWide={true} size={'text-sm sm'} isDisabled={buttonDisabled} isLoading={buttonLoading} handler={makeOffer}
                                 icon={<RocketIcon className={ButtonIconSize.hero}/>}/>
                </div>

                {(isErrorPrep) && <div className={"text-app-error -mt-3 mb-5 text-center capitalize"}>{errorPrep?.cause?.reason ? errorPrep?.cause?.reason : errorPrep.reason}</div>}
                {(isErrorWrite) && <div className={"text-app-error -mt-3 mb-5 text-center capitalize"}>{errorWrite?.cause?.reason ? errorWrite?.cause?.reason : "Unexpected wallet error"}</div>}
                {(error) && <div className={"text-app-error -mt-3 mb-5 text-center capitalize"}>{error}</div>}
                 <div className="">Before creating an offer, please make sure to <a
                    href="#" target="_blank" className="text-app-error">read more.</a></div>
            </div>
        )
    }

    const content = () => {
       return !!confirmationData ? contentSuccess() : contentForm()
    }

    return (<GenericModal isOpen={model} closeModal={() => closeModal()} title={title()} content={content()} />)
}

