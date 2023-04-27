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
import {useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import { getOtcSellFunction} from "@/components/App/Otc/OtcSteps";


export default function SellModal({model, setter, props}) {
    const {currentMarket, allocation, refetchVault, refetchOffers, source} = props
    const {data: session} = useSession()
    const {address, ACL, id} = session.user

    const [amount, setAmount] = useState(0)
    const [price, setPrice] = useState(0)
    const [multiplier, setMultiplier] = useState(1)

    const allocationMax = allocation.invested
    const allocationMin = 50
    const priceMin = allocationMin

    const [statusAmount, setStatusAmount] = useState(false)
    const [statusPrice, setStatusPrice] = useState(false)
    const [processing, setProcessing] = useState(false)
    const statusCheck = !statusAmount || !statusPrice
    const multiplierParsed = multiplier.toFixed(2)

    const otcSellFunction = getOtcSellFunction(source, currentMarket.id, amount, price, ACL, address, id)

    const {config, isSuccess: isSuccessPrepare, isLoading, isError: isErrorPrep, error:errorPrep} = usePrepareContractWrite({
        address: otcSellFunction.address,
        abi: otcSellFunction.abi,
        functionName: otcSellFunction.method,
        args: otcSellFunction.args,
        enabled: !statusCheck && model
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

    const buttonDisabled = statusCheck || !isSuccessPrepare || isLoading || processing

    const closeModal = async () => {
        await refetchVault()
        await refetchOffers()
        setter()
        setTimeout(() => {
            setAmount(allocationMin)
            setMultiplier(1)
        }, 1000);

    }

    const makeOffer = async ()  => {
        setProcessing(true)
        write()
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
        if(!!transactionData || isErrorWrite || isErrorConfirmation) setProcessing(false)
    }, [transactionData, isErrorWrite, isErrorConfirmation])

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
            <div className="min-h-[442px] flex flex-col flex-1">
                <div>Congratulations! You have successfully created OTC offer to sell <span className="text-app-success font-bold">${amount}</span> allocation in <span className="font-bold text-app-success">{currentMarket.name}</span>.</div>
                <lottie-player
                    autoplay
                    loop
                    style={{width: '320px', margin: '30px auto 0px'}}
                    mode="normal"
                    src="/static/lottie/otc.json"
                />
                <div className="flex flex-1 justify-center items-center -mt-5 mb-5">
                    <Link href={PAGE.Vault}>
                        <RoundButton text={'Announce on Discord'} isLoading={false} isDisabled={false} is3d={false} isWide={true} zoom={1.1} size={'text-sm sm'} icon={<IconDiscord className={ButtonIconSize.hero}/> } />
                    </Link>
                </div>
                <div className="mt-auto"><a href="#" target="_blank" className="text-outline">What's next? Read more.</a></div>
            </div>
        )
    }



    const contentForm = () => {
        return (
            <div className="min-h-[442px] flex flex-col">
                <div className={'pt-10'}>
                    <Input type={'number'}
                           placeholder={'Selling allocation'}
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
                <div className={"py-10 flex flex-row justify-center items-center"}>
                    <IconButton zoom={1.1} size={''} noBorder={true} icon={<IconMinus className={"w-8"}/>} handler={() => setMultiplierHandler(false)}/>
                    <div className={`px-6 font-bold tabular-nums transition-colors duration-300 text-2xl ${multiplier>1 ? ' text-app-success' : ' text-app-error'}`}>x<span className={"text-5xl"}>{multiplierParsed}</span></div>
                    <IconButton zoom={1.1} size={''} noBorder={true} icon={<IconPlus className={"w-8"}/>} handler={() => setMultiplierHandler(true)}/>
                </div>
                <div>
                    <Input type={'number'}
                           placeholder={'Selling price'}
                           min={priceMin}
                           setStatus={setStatusPrice}
                           setInput={setPriceHandler}
                           input={price}
                           light={true}
                           full={true}
                           after={"USD"}
                    />
                </div>

                <div className={"fullWidth py-10"}>
                    <RoundButton text={'Make offer'} isWide={true} size={'text-sm sm'} isDisabled={buttonDisabled} handler={makeOffer}
                                 isLoading={processing}
                                 icon={<RocketIcon className={ButtonIconSize.hero}/>}/>
                </div>

                {(isErrorPrep) && <div className={"text-app-error -mt-2 mb-5 text-center"}>{errorPrep?.cause?.reason ? errorPrep?.cause?.reason : errorPrep.reason}</div>}
                {(isErrorWrite) && <div className={"text-app-error -mt-2 mb-5 text-center"}>{errorWrite?.cause?.reason ? errorWrite?.cause?.reason : "Unexpected wallet error"}</div>}
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

