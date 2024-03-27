import { useMemo, useState } from "react";
import GenericModal from "@/components/Modal/GenericModal";
import BlockchainSteps from "@/components/BlockchainSteps";
import { METHOD } from "@/components/BlockchainSteps/utils";
import useGetToken from "@/lib/hooks/useGetToken";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { getCopy } from "@/lib/seoConfig";
import { TENANTS_STAKIMG } from "@/components/App/Settings/helper";
import Input from "@/components/App/Input";

export default function StakingModal({ model, setter, stakingModalProps }) {
    const { stakeReq, isS1, stakeMulti, isStaked, stakingCurrency } = stakingModalProps;
    const { account, activeDiamond } = useEnvironmentContext();

    const [stakeSize, setStakeSize] = useState(() => (isStaked ? stakeMulti : stakeReq));
    const [isInputError, setInputError] = useState(false);
    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

    const closeModal = () => {
        setter();
        setTimeout(() => {
            setTransactionSuccessful(false);
        }, 400);
    };

    const token = useGetToken(stakingCurrency?.contract);
    const blockchainInteractionData = useMemo(() => {
        return {
            steps: {
                network: true,
                liquidity: true,
                allowance: true,
                transaction: true,
            },
            params: {
                requiredNetwork: stakingCurrency.chainId,
                account: account.address,
                allowance: stakeSize,
                liquidity: stakeSize,
                buttonText: "Stake",
                contract: activeDiamond,
                spender: activeDiamond,
                transactionType: METHOD.STAKE,
            },
            disabled: isInputError,
            token,
            setTransactionSuccessful,
        };
    }, [stakingCurrency?.contract, activeDiamond, model]);
    console.log("blockchainInteractionData", blockchainInteractionData);

    const title = () => {
        return (
            <>
                Stake <span className="text-app-error">{stakingCurrency.name}</span>
            </>
        );
    };

    console.log("status", isInputError, stakingCurrency, stakingModalProps);

    const contentStake = () => {
        return (
            <div className={"min-w-[300px]"}>
                <div>
                    To partake in <span className={"inline-block text-app-success"}>{getCopy("NAME")}</span>{" "}
                    investments, every investor must stake{" "}
                    <span className={"text-app-success"}>${stakingCurrency.symbol}</span> token.
                </div>
                <div className={"my-5"}>
                    <div className={"detailRow"}>
                        <p>Detected NFT</p>
                        <hr className={"spacer"} />
                        <p>{TENANTS_STAKIMG()[isS1 ? 0 : 1]}</p>
                    </div>

                    {/* to remove */}
                    <div className={"detailRow"}>
                        <p>{isStaked ? "Add" : "Min Required"} Stake</p>
                        <hr className={"spacer"} />
                        <p>
                            {stakeReq} {stakingCurrency.name}
                        </p>
                    </div>

                    <div className={"detailRow"}>
                        <p>Stake Amount:</p>
                        <Input
                            type="number"
                            setStatus={setInputError}
                            input={stakeSize}
                            setInput={setStakeSize}
                            dividable={stakeMulti}
                            max={5000}
                            min={stakeReq}
                            extraCurrency={stakingCurrency.symbol}
                            customCss="mt-2 border"
                        />
                    </div>
                </div>
                {model && <BlockchainSteps data={blockchainInteractionData} />}
            </div>
        );
    };

    const contentSuccess = () => {
        return (
            <div className={"min-w-[300px]"}>
                <div className={"text-app-success"}>{stakingCurrency.name} staked successfully.</div>
                <div className={"text-gold"}>Welcome to {getCopy("NAME")}.</div>
            </div>
        );
    };

    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentStake();
    };

    return <GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()} />;
}
