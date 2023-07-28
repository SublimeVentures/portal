import GenericModal from "@/components/Modal/GenericModal";
import {useState } from "react";

import LiquidityStep from "@/components/App/BlockchainSteps/LiquidityStep";
import TransactionStep, {TransactionState} from "@/components/App/BlockchainSteps/TransactionStep";


import {ButtonIconSize} from "@/components/Button/RoundButton";
import PAGE, {ExternalLinks} from "@/routes";
import Link from "next/link";

import Linker from "@/components/link";
import {getButtonStep, getCitCapStakingFunction, getInvestFunction} from "@/components/App/BlockchainSteps/config";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {is3VC, sleeper} from "@/lib/utils";
import RocketIcon from "@/assets/svg/Rocket.svg";
import Lottie from "lottie-react";
import lottieSuccess from "@/assets/lottie/success.json";
import {useNetwork} from "wagmi";

export const StakeSteps = {
    Select: 0,
    Use: 1,
    Skip: 2
}

export default function BuyStoreItemModal({model, setter, buyModalProps, networkOk}) {
    if(!model || !networkOk) return;
    const {chain} = useNetwork()
    const {account, order, setOrder, contract, currency} = buyModalProps


    const chainId = chain?.id
    const contractAddress = contract[chainId]
    const currencyDetails = currency[chainId]
    console.log("BuyStoreItemModal", chain, contractAddress,currencyDetails )

    const [liquidity, setLiquidity] = useState(false)
    const [allowance, setAllowance] = useState(false)
    const [transaction, setTransaction] = useState(false)

    const [trigger, setTrigger] = useState(false)
    const [isTransactionLoading, setIsTransactionLoading] = useState(TransactionState.Init)

    // const {ACL, id} = account

    // const stepLiquidityReady = (ACL === ACLs.Whale && stake === StakeSteps.Skip) || ACL !== ACLs.Whale
    // const stepLiquidityFinished = liquidity || usingStakedFunds

    //todo: extract citcap diamond to env
    const stakeData = getCitCapStakingFunction("0x1feEFAD7c874A93056AFA904010F9982c0722dFc")
    const buttonText = getButtonStep(isTransactionLoading, "Buy")

    const closeModal = () => {
        setter()
        // if(transaction) {
        //     afterInvestmentCleanup()
        // }
        setTimeout(() => {
            setOrder(null)
            // setStake(StakeSteps.Select)
            // setLiquidity(false)
            // setTransaction(false)
        }, 1000);
    }

    const run = async () => {
        // setAccept(false);
        // setTrigger(false)
        // await sleeper(500)
        // setAccept(true);
        // setTrigger(true)
    }

    const liquidityProps = {
        currencyAddress: "0xa19f5264F7D7Be11c451C093D8f92592820Bea86",
        currencyPrecision: 18,
        currencySymbol: "BYTES",
        isReady: model,
        account,
        amount: stakeReq,
        isFinished: liquidity,
        setFinished: setLiquidity,
    }

    const allowanceReady = liquidity && accept
    const allowanceProps = {
        currencyAddress: "0xa19f5264F7D7Be11c451C093D8f92592820Bea86",
        currencyPrecision: 18,
        currencySymbol: "BYTES",
        allowanceFor: "0x1feEFAD7c874A93056AFA904010F9982c0722dFc",
        isReady: allowanceReady,
        account,
        amount: stakeReq,
        isFinished: allowance,
        setFinished: setAllowance,
        setIsTransactionLoading,

    }

    const transferReady = allowanceReady && allowance
    const transactionProps = {
        transactionData: stakeData,
        account,
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
                    <><span className="text-app-success">Buy</span> Upgrade</>
                }
            </>
        )
    }

    const contentSuccess = () => {
        return (
            <div className=" flex flex-col flex-1">
                <div>Congratulations! You have successfully invested <span className="text-app-success font-bold">${amountLocale}</span> in <span className="font-bold text-app-success">{offer.name}</span>.</div>
                <Lottie animationData={lottieSuccess} loop={true} autoplay={true} style={{width: '320px', margin: '30px auto 0px'}}/>;

                <div className="flex flex-1 justify-center items-center py-10 fullWidth">
                    <Link href={PAGE.App} className={` w-full fullWidth ${is3VC ? "" : "flex flex-1 justify-center"}`}>
                        <UniButton type={ButtonTypes.BASE} text={'Check Vault'} state={"danger"} isLoading={false} isDisabled={false} is3d={false} isWide={true} zoom={1.1} size={'text-sm sm'} />
                    </Link>
                </div>
                <div className="mt-auto">What's next? <Linker url={ExternalLinks.AFTER_INVESTMENT} /></div>
            </div>
        )
    }
    const contentSteps = () => {
        return (
            <div className={`flex flex-1 flex-col`}>
                <div className={`flex flex-col gap-2 mt-5 ${is3VC ? "" : "font-accent"}`}>
                    <div className={"detailRow"}><p>Item</p><hr className={"spacer"}/><p>{order.name}</p></div>
                    <div className={"detailRow"}><p>Total Cost</p><hr className={"spacer"}/><p className="font-bold text-gold ">{order.price}  {is3VC ? "USD" : "BYTES"}</p></div>
                </div>
                <div className="flex flex-col flex-1 gap-2 pb-10 justify-content">
                        <LiquidityStep stepProps={liquidityProps} />
                        <TransactionStep stepProps={transactionProps}/>
                </div>
                <div className={` pb-5 ${is3VC ? "fullWidth": "flex flex-1 justify-center"}`}>
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

