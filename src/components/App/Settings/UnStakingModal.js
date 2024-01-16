import GenericModal from "@/components/Modal/GenericModal";
import {useEffect } from "react";
import {
     INTERACTION_TYPE
} from "@/components/App/BlockchainSteps/config";
import BlockchainSteps from "@/components/App/BlockchainSteps";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";

export default function CitCapStakingModal({model, setter, stakingModalProps}) {
    const { account, currency, activeDiamond} = stakingModalProps
    const { insertConfiguration, blockchainCleanup, blockchainProps } = useBlockchainContext();
    const transactionSuccessful = blockchainProps.result.transaction?.confirmation_data

    const closeModal = () => {
        setter()
        setTimeout(() => {
            blockchainCleanup()
        }, 400);
    }


    useEffect(() => {
        if(!model || !currency?.address) return;


        insertConfiguration({
            data: {
                account: account,
                requiredNetwork: currency.chainId,
                contract: activeDiamond,
                currency: currency?.symbol,
                buttonText: "UnStake",
                transactionType: INTERACTION_TYPE.UNSTAKE
            },
            steps: {
                network:true,
                transaction:true,
            }
        });
    }, [
        currency?.address,
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

