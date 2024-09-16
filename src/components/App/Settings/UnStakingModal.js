import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import GenericModal from "@/components/Modal/GenericModal";
import { METHOD } from "@/components/BlockchainSteps/utils";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import BlockchainSteps from "@/components/BlockchainSteps";
import { getTenantConfig } from "@/lib/tenantHelper";

const { NAME } = getTenantConfig().seo;

export default function UnStakingModal({ model, onClose, onSuccessClose, stakingModalProps }) {
    const { stakeSize, stakingCurrency } = stakingModalProps;

    const [transactionSuccessful, setTransactionSuccessful] = useState(false);
    const { account, activeDiamond } = useEnvironmentContext();

    const closeModal = () => {
        if (transactionSuccessful) {
            onSuccessClose();
        } else {
            onClose();
        }
        setTimeout(() => {
            setTransactionSuccessful(false);
        }, 400);
    };

    const blockchainInteractionData = useMemo(
        () => ({
            steps: {
                network: true,
                transaction: true,
            },
            params: {
                requiredNetwork: stakingCurrency.chainId,
                account: account.address,
                buttonText: "UnStake",
                contract: activeDiamond,
                transactionType: METHOD.UNSTAKE,
            },
            setTransactionSuccessful,
        }),
        [stakingCurrency, account.address, activeDiamond, model],
    );

    const title = () => (
        <>
            <span className="text-app-error">UnStake</span> {stakingCurrency.symbol}
        </>
    );

    const contentStake = () => (
        <div className={"min-w-[300px]"}>
            <div>
                To partake in <span className={"inline-block text-app-success"}>{NAME}</span> investments, every
                investor must stake {stakingCurrency.symbol}.
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

    const contentSuccess = () => (
        <div className={"min-w-[300px]"}>
            <div className={"text-app-success"}>{stakingCurrency.symbol} unstaked successfully.</div>
        </div>
    );

    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentStake();
    };

    return <GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()} />;
}

UnStakingModal.propTypes = {
    model: PropTypes.bool,
    onClose: PropTypes.func,
    onSuccessClose: PropTypes.func,
    stakingModalProps: PropTypes.object,
};
