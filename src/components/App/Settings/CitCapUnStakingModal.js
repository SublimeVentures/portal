import GenericModal from "@/components/Modal/GenericModal";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {useState } from "react";
import TransactionStep, {TransactionState} from "@/components/App/BlockchainSteps/TransactionStep";
import {
    getButtonStep,
    getCitCapUnStakingFunction
} from "@/components/App/BlockchainSteps/config";
import {sleeper} from "@/lib/utils";
export default function CitCapStakingModal({model, setter, stakingModalProps}) {
    const {stakeSze, account,} = stakingModalProps


    const [transaction, setTransaction] = useState(false)

    const [trigger, setTrigger] = useState(false)
    const [isTransactionLoading, setIsTransactionLoading] = useState(TransactionState.Init)

    const stakeData = getCitCapUnStakingFunction("0x1feEFAD7c874A93056AFA904010F9982c0722dFc")

    const buttonText = getButtonStep(isTransactionLoading, "unstake")



    const transferReady = true
    const transactionProps = {
        transactionData: stakeData,
        account,
        isReady: transferReady,
        isFinished: transaction,
        setFinished: setTransaction,
        setIsTransactionLoading,
        trigger: trigger,
    }



    const run = async () => {
        setTrigger(false)
        await sleeper(500)
        setTrigger(true)
    }


    const title = () => {
        return (
            <>
                <span className="text-app-error">UnStake</span> BYTES
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
                        <div className={"detailRow"}><p>Current Stake</p><hr className={"spacer"}/><p>{stakeSze} BYTES</p></div>
                    </div>

                    <div className={"mb-5 text-sm gap-3 flex flex-col"}>
                        <TransactionStep stepProps={transactionProps}/>
                    </div>


                    <div className={"flex flex-1 justify-end"}>
                        <UniButton type={ButtonTypes.BASE} text={buttonText} state={"danger"} isDisabled={!transferReady || isTransactionLoading !== TransactionState.Init}
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
                        <img src="https://cdn.citizencapital.fund/webapp/staked.gif" className={"rounded-md"} alt={"staked"}/>
                     </div>

            </div>
        )
    }

    const content = () => {
        if(transaction) {
            return contentSuccess()
        } else {
            return contentStake()

        }
    }

    return (<GenericModal isOpen={model} closeModal={setter} title={title()} content={content()}/>)
}

