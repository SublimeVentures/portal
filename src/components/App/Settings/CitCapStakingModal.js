import GenericModal from "@/components/Modal/GenericModal";
import { useEffect} from "react";
import {getCitCapStakingFunction} from "@/components/App/BlockchainSteps/config";
import BlockchainSteps from "@/components/App/BlockchainSteps";
import RocketIcon from "@/assets/svg/Rocket.svg";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import {isBased} from "@/lib/utils";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";

export default function CitCapStakingModal({model, setter, stakingModalProps}) {
    const { account, isS1} = stakingModalProps
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
        const stakingFunction = getCitCapStakingFunction("0x1feEFAD7c874A93056AFA904010F9982c0722dFc")

        updateBlockchainProps({
            processingData: {
                requiredNetwork: 1,
                amount: account.stakeReq,
                amountAllowance: account.stakeReq,
                userWallet: account.address,
                currency: selectedCurrency,
                diamond: "0x1feEFAD7c874A93056AFA904010F9982c0722dFc",
                transactionData: stakingFunction
            },
            buttonData: {
                icon: <RocketIcon className={ButtonIconSize.hero}/>,
                text: "Stake",
            },
            checkNetwork: !isBased,
            checkLiquidity: true,
            checkAllowance: true,
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
                        <div className={"detailRow"}><p>Detected Citizen</p><hr className={"spacer"}/><p>{isS1 ? "S1" : "S2"}</p></div>
                        <div className={"detailRow"}><p>Required Stake</p><hr className={"spacer"}/><p>{account.stakeReq} BYTES</p></div>
                    </div>
                    <BlockchainSteps/>
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
        return transactionSuccessful ?  contentSuccess() : contentStake()
    }

    return (<GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()}/>)
}

