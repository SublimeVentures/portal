import GenericModal from "@/components/Modal/GenericModal";
import {useEffect } from "react";
import {
    getCitCapUnStakingFunction
} from "@/components/App/BlockchainSteps/config";
import RocketIcon from "@/assets/svg/Rocket.svg";
import BlockchainSteps from "@/components/App/BlockchainSteps";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";

export default function CitCapStakingModal({model, setter, stakingModalProps}) {
    const {stakeReq, account, stakeSze} = stakingModalProps
    const { updateBlockchainProps, blockchainCleanup, blockchainSummary } = useBlockchainContext();
    const transactionSuccessful = blockchainSummary?.transaction_result?.confirmation_data

    const closeModal = () => {
        setter()
        setTimeout(() => {
            blockchainCleanup()
        }, 400);
    }

    const selectedCurrency = {
        address: "0xa19f5264F7D7Be11c451C093D8f92592820Bea86",
        precision: 18,
        symbol: "BYTES",
        isSettlement: false
    }



    useEffect(() => {
        if(!model || !selectedCurrency?.address) return;

        const unstakingFunction = getCitCapUnStakingFunction("0x1feEFAD7c874A93056AFA904010F9982c0722dFc")


        updateBlockchainProps({
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
                icon: <RocketIcon className="w-10 mr-2"/>,
                text: "UnStake",
            },
            checkLiquidity: false,
            checkAllowance: false,
            checkTransaction: true,
            showButton: true,
            saveData: true,
        });
    }, [
        selectedCurrency?.address,
        model
    ]);

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
                     <BlockchainSteps/>

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
        return transactionSuccessful ? contentSuccess() : contentStake()
    }

    return (<GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()}/>)
}

