import GenericModal from "@/components/Modal/GenericModal";
import { useState} from "react";
import LiquidityStep from "@/components/App/BlockchainSteps/LiquidityStep";
import AllowanceStep from "@/components/App/BlockchainSteps/AllowanceStep";
import TransactionStep, {TransactionState} from "@/components/App/BlockchainSteps/TransactionStep";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import PAGE, {ExternalLinks} from "@/routes";
import Linker from "@/components/link";
import {
    getButtonStep,
    getUpgradesFunction
} from "@/components/App/BlockchainSteps/config";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {isBased, sleeper} from "@/lib/utils";
import RocketIcon from "@/assets/svg/Rocket.svg";
import Lottie from "lottie-react";
import lottieSuccess from "@/assets/lottie/success.json";
import {useRouter} from "next/router";

export default function BuyMysteryBoxModal({model, setter, buyModalProps, networkOk}) {
    if(!model || !networkOk) return;
    const {account, order, setOrder, contract, currency} = buyModalProps
    const router = useRouter()

    // const {chain} = useNetwork()
    // const chainId = chain?.id
    // const contractAddress = contract[chainId]
    // const currencyDetails = currency[chainId]

    const [liquidity, setLiquidity] = useState(false)
    const [allowance, setAllowance] = useState(false)
    const [transaction, setTransaction] = useState(false)

    const [accept, setAccept] = useState(false)
    const [trigger, setTrigger] = useState(false)
    const [isTransactionLoading, setIsTransactionLoading] = useState(TransactionState.Init)

    const purchaseData = getUpgradesFunction(contract, currency, order.id, order.price, 1)

    const buttonText = getButtonStep(isTransactionLoading, "Buy")

    const closeModal = () => {
        setter()
        setTimeout(() => {
            setOrder(null)
            setTransaction(false)
            setAllowance(false)
            setLiquidity(false)
            setTrigger(false)
            setAccept(false)
            setIsTransactionLoading(TransactionState.Init)
        }, 1000);
    }

    const redirect = () => {
        router.push(PAGE.Settings).then(e=> {
            closeModal()
        })
    }

    const run = async () => {
        setAccept(false);
        setTrigger(false)
        await sleeper(500)
        setAccept(true);
        setTrigger(true)
    }




    const liquidityProps = {
        currencyAddress: currency.address,
        currencyPrecision: currency.precision,
        currencySymbol: currency.symbol,
        isReady: model,
        account: account.address,
        amount: order.price,
        isFinished: liquidity,
        setFinished: setLiquidity,
    }

    const allowanceReady = liquidity && accept
    const allowanceProps = {
        currencyAddress: currency.address,
        currencyPrecision: currency.precision,
        currencySymbol: currency.symbol,
        allowanceFor: contract,
        isReady: allowanceReady,
        account: account.address,
        amount: order.price,
        isFinished: allowance,
        setFinished: setAllowance,
        setIsTransactionLoading,
    }


    const transferReady = allowanceReady && allowance
    const transactionProps = {
        transactionData: purchaseData,
        account: account.address,
        isReady: transferReady,
        isFinished: transaction,
        setFinished: setTransaction,
        setIsTransactionLoading,
        trigger: trigger,
    }



    const title = () => {
        return (
            <>
                {transaction ?
                    <>Transaction <span className="text-app-success">successful</span></> :
                    <><span className="text-app-success">Buy</span> MysteryBox</>
                }
            </>
        )
    }

    const contentSuccess = () => {
        return (
            <div className=" flex flex-col flex-1">
                <div>Congratulations! You have successfully bought <span className="text-app-success font-bold">{order.name}</span>.</div>
                <Lottie animationData={lottieSuccess} loop={true} autoplay={true} style={{width: '320px', margin: '30px auto 0px'}}/>

                <div className="flex flex-1 justify-center items-center py-10 fullWidth">
                    {/*<Link href={PAGE.Settings} className={` w-full fullWidth ${isBased ? "" : "flex flex-1 justify-center"}`}>*/}
                    <div className={` w-full fullWidth ${isBased ? "" : "flex flex-1 justify-center"}`}>
                        <UniButton type={ButtonTypes.BASE} text={'Check PROFILE'} state={"danger"} isLoading={false} isDisabled={false} is3d={false} isWide={true} zoom={1.1} size={'text-sm sm'}  handler={()=> redirect()}/>
                    </div>
                </div>
                <div className="mt-auto">What's next? <Linker url={ExternalLinks.LOOTBOX} /></div>
            </div>
        )
    }
    const contentSteps = () => {
        return (
            <div className={`flex flex-1 flex-col`}>
                <div className={`flex flex-col gap-2 mt-5 ${isBased ? "" : "font-accent"}`}>
                    <div className={"detailRow"}><p>Item</p><hr className={"spacer"}/><p>{order.name}</p></div>
                    <div className={"detailRow"}><p>Total Cost</p><hr className={"spacer"}/><p className="font-bold text-gold ">{order.price}  {isBased ? "USD" : "BYTES"}</p></div>
                </div>
                <div className="flex flex-col flex-1 gap-2 pt-5 pb-2 justify-content">
                        <LiquidityStep stepProps={liquidityProps} />
                        <AllowanceStep stepProps={allowanceProps}/>
                        <TransactionStep stepProps={transactionProps}/>
                </div>
                <div className={` pb-5 ${isBased ? "fullWidth": "flex flex-1 justify-center"}`}>
                    <UniButton
                        type={ButtonTypes.BASE}
                        isWide={true}
                        size={'text-sm sm'}
                        text={buttonText}
                        state={"danger"}
                        icon={<RocketIcon className={ButtonIconSize.hero}/>}
                        isDisabled={!liquidity || isTransactionLoading !== TransactionState.Init}
                        handler={()=> { run() }}/>
                </div>
            </div>
        )
    }


    const content = () => {
       return transaction ? contentSuccess() : contentSteps()
    }

    return (<GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()} persistent={true}/>)
}

