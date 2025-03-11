import { useMemo, useState } from "react";
import GenericModal from "@/components/Modal/GenericModal";
import { METHOD } from "@/components/BlockchainSteps/utils";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import BlockchainSteps from "@/components/BlockchainSteps";
import { getCopy } from "@/lib/seoConfig";

export default function CitCapStakingModal({ model, setter, stakingModalProps }) {
    const { stakeSize, stakingCurrency } = stakingModalProps;

    const [transactionSuccessful, setTransactionSuccessful] = useState(false);
    const { account, activeDiamond } = useEnvironmentContext();

    const closeModal = () => {
        setter();
        setTimeout(() => {
            setTransactionSuccessful(false);
        }, 400);
    };

    const registeredOriginalWallet = stakingModalProps?.userWallets?.find(
        (el) => !el.isDelegate && el.isHolder,
    )?.wallet;
    const wallet =
        registeredOriginalWallet === account.address
            ? "0x0000000000000000000000000000000000000000"
            : registeredOriginalWallet;

    const blockchainInteractionData = useMemo(() => {
        return {
            steps: {
                network: true,
                transaction: true,
            },
            params: {
                requiredNetwork: stakingCurrency.chainId,
                account: account.address,
                buttonText: "UnStake",
                contract: activeDiamond,
                delegated: wallet,
                transactionType: METHOD.UNSTAKE,
            },
            setTransactionSuccessful,
        };
    }, [stakingCurrency?.contract, activeDiamond, model]);

    const title = () => {
        return (
            <>
                <span className="text-app-error">UnStake</span> {stakingCurrency.symbol}
            </>
        );
    };

    const contentStake = () => {
        return (
            <div className={"min-w-[300px]"}>
                <div>
                    To partake in <span className={"inline-block text-app-success"}>{getCopy("NAME")}</span>{" "}
                    investments, every investor must stake {stakingCurrency.symbol}.
                </div>
                <div className={"my-5"}>
                    <div className={"detailRow"}>
                        <p>Current Stake</p>
                        <hr className={"spacer"} />
                        <p>
                            {stakeSize} {stakingCurrency.symbol}
                        </p>
                    </div>
                </div>
                {model && <BlockchainSteps data={blockchainInteractionData} />}
            </div>
        );
    };

    const contentSuccess = () => {
        return (
            <div className={"min-w-[300px]"}>
                <div className={"text-app-success"}>{stakingCurrency.symbol} unstaked successfully.</div>
            </div>
        );
    };

    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentStake();
    };

    return <GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()} />;
}
