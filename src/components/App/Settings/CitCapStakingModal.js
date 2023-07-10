import GenericModal from "@/components/Modal/GenericModal";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import AllowanceStep from "@/components/App/BlockchainSteps/AllowanceStep";
import {useState , useEffect} from "react";
import LiquidityStep from "@/components/App/BlockchainSteps/LiquidityStep";
import TransactionStep, {TransactionState} from "@/components/App/BlockchainSteps/TransactionStep";
import {getButtonStep, getCitCapStakingFunction} from "@/components/App/BlockchainSteps/config";
import {sleeper} from "@/lib/utils";
export default function CitCapStakingModal({model, setter, stakingModalProps}) {
    const {stakeReq, account, refreshSession} = stakingModalProps
    const [accept, setAccept] = useState(false)


    const [liquidity, setLiquidity] = useState(false)
    const [allowance, setAllowance] = useState(false)
    const [transaction, setTransaction] = useState(false)

    const [trigger, setTrigger] = useState(false)
    const [isTransactionLoading, setIsTransactionLoading] = useState(TransactionState.Init)

    const stakeData = getCitCapStakingFunction("0x1feEFAD7c874A93056AFA904010F9982c0722dFc")

    const buttonText = getButtonStep(isTransactionLoading, "stake")

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

    useEffect(()=>{
        console.log("QQQ: wykonaj transakcje", transferReady)
        if(transferReady) {
            setTrigger(true)
        }
    }, [transferReady])



    const run = async () => {
        setAccept(false);
        setTrigger(false)
        await sleeper(500)
        setAccept(true);
        setTrigger(true)
    }


    const title = () => {
        return (
            <>
                Stake <span className="text-app-error">BYTES</span>
            </>
        )
    }


    const contentStake = () => {
        return (
            <div className={"min-w-[300px]"}>
                   <div>
                       To partake in Citadel's investments, every Citizen must stake BYTES.
                   </div>
                    <div className={"my-5"}>
                        <div className={"detailRow"}><p>Detected Citizen</p><hr className={"spacer"}/><p>{stakeReq == 200 ? "Season 1" : "Season 2"}</p></div>
                        <div className={"detailRow"}><p>Required Stake</p><hr className={"spacer"}/><p>{stakeReq} BYTES</p></div>
                    </div>

                    <div className={"mb-5 text-sm gap-3 flex flex-col"}>
                        <LiquidityStep stepProps={liquidityProps}/>
                        <AllowanceStep stepProps={allowanceProps}/>
                        <TransactionStep stepProps={transactionProps}/>
                    </div>


                    <div className={"flex flex-1 justify-end"}>
                        <UniButton type={ButtonTypes.BASE} text={buttonText} state={"danger"} isDisabled={!liquidity || isTransactionLoading !== TransactionState.Init}
                                   handler={()=> { run() }}/>
                    </div>
            </div>
        )
    }

    const contentSuccess = () => {
        return (
            <div className={"min-w-[300px]"}>
                   <div className={"text-app-success"}>
                       BYTES staked successfully.
                   </div>
                   <div className={"text-gold"}>
                       Welcome to Citizen Capital.
                   </div>
                    <div className={"my-5"}>
                        <img src="https://cdn.citizencapital.fund/webapp/staked.gif" className={"rounded-md"}/>
                     </div>

            </div>
        )
    }

    const content = () => {
        if(transaction) {
            refreshSession()
            return contentSuccess()
        } else {
            return contentStake()

        }
    }

    return (<GenericModal isOpen={model} closeModal={setter} title={title()} content={content()}/>)
}

