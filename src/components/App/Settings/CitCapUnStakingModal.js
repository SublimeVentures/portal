import GenericModal from "@/components/Modal/GenericModal";
import {useState, useRef } from "react";
import {
    getCitCapUnStakingFunction
} from "@/components/App/BlockchainSteps/config";
import RocketIcon from "@/assets/svg/Rocket.svg";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import BlockchainSteps from "@/components/App/BlockchainSteps";
export default function CitCapStakingModal({model, setter, stakingModalProps}) {
    const {stakeReq, account, stakeSze} = stakingModalProps
    const [blockchainData, setBlockchainData] = useState(false)

    const {transactionData} = blockchainData

    const unstakingFunction = getCitCapUnStakingFunction("0x1feEFAD7c874A93056AFA904010F9982c0722dFc")

    const closeModal = () => {
        setter()
        setTimeout(() => {
            setBlockchainData(false)
        }, 400);
    }

    const selectedCurrency = {
        address: "0xa19f5264F7D7Be11c451C093D8f92592820Bea86",
        precision: 18,
        symbol: "BYTES",
        isSettlement: false
    }

    const blockchainProps = {
        processingData: {
            amount: stakeReq,
            amountAllowance: stakeReq,
            userWallet: account.address,
            currency: selectedCurrency,
            diamond: "0x1feEFAD7c874A93056AFA904010F9982c0722dFc",
            transactionData: unstakingFunction
        },
        buttonData: {
            // buttonFn,
            icon: <RocketIcon className={ButtonIconSize.hero}/>,
            text: "UnStake",
        },
        checkLiquidity: false,
        checkAllowance: false,
        checkTransaction: true,
        showButton: true,
        saveData: true,
        saveDataFn: setBlockchainData,
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
                     <BlockchainSteps blockchainProps={blockchainProps}/>

            </div>
        )
    }

    const contentSuccess = () => {
        return (
            <div className={"min-w-[300px]"}>
                   <div className={"text-app-success"}>
                       BYTES unstaked successfully.
                   </div>

            </div>
        )
    }

    const content = () => {
        if(transactionData?.transferConfirmed) {
            return contentSuccess()
        } else {
            return contentStake()

        }
    }

    return (<GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()}/>)
}

