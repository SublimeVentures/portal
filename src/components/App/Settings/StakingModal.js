import GenericModal from "@/components/Modal/GenericModal";
import {useMemo, useState} from "react";
import BlockchainSteps from "@/components/BlockchainSteps";
import {METHOD} from "@/components/BlockchainSteps/utils";
import useGetToken from "@/lib/hooks/useGetToken";
import {useEnvironmentContext} from "@/lib/context/EnvironmentContext";

export default function StakingModal({model, setter, stakingModalProps}) {
    const {stakeReq, isS1} = stakingModalProps
    const {currencyStaking, account, activeDiamond} = useEnvironmentContext();

    const [transactionSuccessful, setTransactionSuccessful] = useState(false)


    const closeModal = () => {
        setter()
        setTimeout(() => {
            setTransactionSuccessful(false)

        }, 400);
    }


    const token = useGetToken(currencyStaking?.contract)
    console.log("selectedCurrency?.contract",currencyStaking?.contract, token)

    const blockchainInteractionData = useMemo(() => {
        return {
            steps: {
                network: true,
                liquidity: true,
                allowance: true,
                transaction: true,
            },
            params: {
                requiredNetwork: currencyStaking.chainId,
                account: account.address,
                allowance: stakeReq,
                liquidity: stakeReq,
                buttonText: "Stake",
                contract: activeDiamond,
                spender: activeDiamond,
                transactionType: METHOD.STAKE,
            },
            token,
            setTransactionSuccessful
        }
    }, [
        currencyStaking?.contract,
        activeDiamond,
        model,
    ])
    console.log("blockchainInteractionData",blockchainInteractionData)



    const title = () => {
        return (
            <>
                Stake <span className="text-app-error">{currencyStaking.name}</span>
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
                        <p>{stakeReq} {currencyStaking.name}</p></div>
                </div>
                {model && <BlockchainSteps data={blockchainInteractionData}/>}

            </div>
        )
    }

    const contentSuccess = () => {
        return (
            <div className={"min-w-[300px]"}>
                <div className={"text-app-success"}>
                    {currencyStaking.name} staked successfully.
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

