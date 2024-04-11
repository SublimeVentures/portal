import { useMemo, useState } from "react";
import GenericModal from "@/components/Modal/GenericModal";
import BlockchainSteps from "@/components/BlockchainSteps";
import { getMethod, METHOD } from "@/components/BlockchainSteps/utils";
import useGetToken from "@/lib/hooks/useGetToken";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { getCopy } from "@/lib/seoConfig";
import { TENANTS_STAKIMG } from "@/components/App/Settings/helper";
import StepInput from "@/components/App/StepInput";

export default function StakingModal({ model, setter, stakingModalProps }) {
    const { stakeReq, isS1, stakeMulti, isStaked, stakingCurrency } = stakingModalProps;
    const { account, activeDiamond } = useEnvironmentContext();

    const [stakeSize, setStakeSize] = useState(stakeReq);
    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

    const closeModal = () => {
        setter();
        setTimeout(() => {
            setTransactionSuccessful(false);
        }, 400);
    };

    const registeredOriginalWallet = stakingModalProps?.userWallets?.find((el) => el.isHolder)?.wallet;
    const wallet =
        registeredOriginalWallet === account.address
            ? "0x0000000000000000000000000000000000000000"
            : registeredOriginalWallet;
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
                delegated: wallet,
                transactionType: METHOD.STAKE,
            },
            token,
            setTransactionSuccessful,
        };
    }, [stakingCurrency?.contract, activeDiamond, model, stakeSize]);
    console.log("blockchainInteractionData", blockchainInteractionData, wallet, registeredOriginalWallet);

    const tempParams = {
        requiredNetwork: stakingCurrency.chainId,
        account: account.address,
        allowance: stakeSize,
        liquidity: stakeSize,
        buttonText: "Stake",
        contract: activeDiamond,
        spender: activeDiamond,
        delegated: wallet,
        transactionType: METHOD.STAKE,
    };
    const transaction_method = getMethod(tempParams.transactionType, token, {
        ...tempParams,
        prerequisite: {},
    });

    console.log("blockchainInteractionData - transaction_method", transaction_method);

    const title = () => {
        return (
            <>
                Stake <span className="text-app-error">{stakingCurrency.name}</span>
            </>
        );
    };

    const contentStake = () => {
        return (
            <div className="min-w-[300px]">
                <div>
                    To partake in <span className={"inline-block text-app-success"}>{getCopy("NAME")}</span>{" "}
                    investments, every investor must stake{" "}
                    <span className="text-app-success">${stakingCurrency.symbol}</span> token.
                </div>
                <div className="my-5 flex flex-col gap-y-2">
                    <div className="detailRow">
                        <p>Detected NFT</p>
                        <hr className="spacer" />
                        <p>{TENANTS_STAKIMG()[isS1 ? 0 : 1]}</p>
                    </div>
                    {stakingModalProps?.isFlexibleStaking ? (
                        <div className={"detailRow"}>
                            <p>Stake Amount:</p>
                            <hr className={"spacer"} />
                            <StepInput
                                step={stakeMulti}
                                min={stakeReq}
                                max={5000}
                                value={stakeSize}
                                setValue={setStakeSize}
                                aria-label={`Add ${stakeSize} ${stakingCurrency.name}`}
                            />
                        </div>
                    ) : (
                        <div className={"detailRow"}>
                            <p>{isStaked ? "Add" : "Required"} Stake</p>
                            <hr className={"spacer"} />
                            <p>
                                {stakeSize} {stakingCurrency.name}
                            </p>
                        </div>
                    )}
                </div>
                {model && <BlockchainSteps data={blockchainInteractionData} />}
            </div>
        );
    };

    const contentSuccess = () => {
        return (
            <div className="min-w-[300px]">
                <div className="text-app-success">{stakingCurrency.name} staked successfully.</div>
                <div className="text-gold">Welcome to {getCopy("NAME")}.</div>
            </div>
        );
    };

    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentStake();
    };

    return <GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()} />;
}
