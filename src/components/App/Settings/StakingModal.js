import GenericModal from "@/components/Modal/GenericModal";
import {useEffect} from "react";
import {INTERACTION_TYPE} from "@/components/App/BlockchainSteps/config";
import BlockchainSteps from "@/components/App/BlockchainSteps";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";

export default function StakingModal({model, setter, stakingModalProps}) {
    const {stakeReq, isS1, account, currency, activeDiamond} = stakingModalProps
    const {insertConfiguration, blockchainCleanup, blockchainProps} = useBlockchainContext();
    const transactionSuccessful = blockchainProps.result.transaction?.confirmation_data

    const closeModal = () => {
        setter()
        setTimeout(() => {
            blockchainCleanup()
        }, 400);
    }



    useEffect(() => {
        if (!model || !currency?.address) return;

        insertConfiguration({
            data: {
                account: account,
                requiredNetwork: currency.chainId,
                allowance: stakeReq,
                liquidity: stakeReq,
                contract: activeDiamond,
                currency: currency?.symbol,
                buttonText: "Stake",
                transactionType: INTERACTION_TYPE.STAKE,
            },
            steps: {
                network: true,
                liquidity: true,
                allowance: true,
                transaction: true,
            }
        });
    }, [
        currency?.address,
        model
    ]);

    const title = () => {
        return (
            <>
                Stake <span className="text-app-error">{currency.name}</span>
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
                    <div className={"detailRow"}><p>Detected Citizen</p>
                        <hr className={"spacer"}/>
                        <p>{isS1 ? "S1" : "S2"}</p></div>
                    <div className={"detailRow"}><p>Required Stake</p>
                        <hr className={"spacer"}/>
                        <p>{stakeReq} {currency.name}</p></div>
                </div>
                <BlockchainSteps/>
            </div>
        )
    }

    const contentSuccess = () => {
        return (
            <div className={"min-w-[300px]"}>
                <div className={"text-app-success"}>
                    {currency.name} staked successfully.
                </div>
                <div className={"text-gold"}>
                    Welcome to Citizen Capital.
                </div>
                <div className={"my-5"}>
                    <img src="https://cdn.citizencapital.fund/webapp/staked.gif" className={"rounded-md"}
                         alt={"staked"}/>
                </div>

            </div>
        )
    }

    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentStake()
    }

    return (<GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()}/>)
}

