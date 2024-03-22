import Lottie from "lottie-react";
import { useMemo, useState } from "react";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import { getSignature } from "@/fetchers/claim.fetcher";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import DynamicIcon from "@/components/Icon";
import { NETWORKS } from "@/lib/utils";
import lottieSuccess from "@/assets/lottie/success.json";
import { METHOD } from "@/components/BlockchainSteps/utils";
import BlockchainSteps from "@/components/BlockchainSteps";
import useGetToken from "@/lib/hooks/useGetToken";
import { getCopy } from "@/lib/seoConfig";
import GenericModal from "@/components/Modal/GenericModal";

export const blockchainPrerequisite = async (params) => {
    const { claimId, account } = params;
    console.log("CLAIMSIGN_VALID", params);

    const transaction = await getSignature(claimId, account);
    console.log("CLAIMSIGN", transaction);
    if (transaction.ok) {
        return {
            ok: true,
            data: { signature: transaction.data.signature },
        };
    } else {
        //todo: error handling
        return {
            ok: false,
        };
    }
};

export default function ClaimPayoutModal({ model, setter, props }) {
    const { name, currency, nextPayout, refetchVault } = props;
    const { getCurrencySettlement, account, network, activeInvestContract } = useEnvironmentContext();
    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

    console.log("propsprops", props);
    const chainDesired = network.chains.find((el) => el.id === currency?.chainId);
    const token = useGetToken(currency?.contract || getCurrencySettlement()[0].contract);

    const blockchainInteractionData = useMemo(() => {
        return {
            steps: {
                network: true,
                transaction: true,
            },
            params: {
                requiredNetwork: currency?.chainId,
                account: account.address,
                amount: Number(nextPayout?.amount),
                offerId: nextPayout.offerId,
                payoutId: nextPayout.payoutId,
                claimId: nextPayout.claimId,
                contract: activeInvestContract,
                buttonText: "Claim",
                prerequisiteTextWaiting: "Sign transaction",
                prerequisiteTextProcessing: "Getting signature",
                prerequisiteTextSuccess: "Hash obtained",
                prerequisiteTextError: "Invalid transaction data",
                transactionType: METHOD.CLAIM,
            },
            token,
            setTransactionSuccessful,
        };
    }, [
        currency?.contract,
        nextPayout?.amount,
        nextPayout.payoutId,
        nextPayout.offerId,
        nextPayout.claimId,
        account,
        activeInvestContract,
        model,
    ]);

    const closeModal = async () => {
        await refetchVault();
        setter();
        setTimeout(() => {
            setTransactionSuccessful(false);
        }, 400);
    };

    const title = () => {
        return (
            <>
                {transactionSuccessful ? (
                    <>
                        Payout <span className="text-app-success">claimed</span>
                    </>
                ) : (
                    <>
                        <span className="text-app-success">Claim</span> payout
                    </>
                )}
            </>
        );
    };

    const contentQuery = () => {
        return (
            <div className="flex flex-col flex-1">
                <div>
                    Confirm payout claim for <span className={"font-bold text-gold"}>{name}</span>.
                </div>
                <div className={"flex flex-1 flex-col py-5"}>
                    <div className={"detailRow"}>
                        <p className={"font-bold"}>NETWORK</p>
                        <hr className={"spacer"} />
                        <p className={"flex gap-1 h-[18px] font-mono"}>
                            <DynamicIcon name={NETWORKS[currency?.chainId]} style={ButtonIconSize.clicksLow} />
                            {chainDesired.name}
                        </p>
                    </div>
                    <div className={"detailRow font-bold"}>
                        <p>CLAIM</p>
                        <hr className={"spacer"} />
                        <p className={"font-mono"}>
                            {Number(nextPayout?.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
                            {currency?.symbol}
                        </p>
                    </div>
                </div>
                {model && <BlockchainSteps data={blockchainInteractionData} />}
            </div>
        );
    };

    const contentSuccess = () => {
        return (
            <div className="flex flex-col flex-1">
                <div className={"flex flex-1 flex-col justify-center items-center"}>
                    <div className={""}>
                        Thank you for investing with <span className={"font-bold text-gold"}>{getCopy("NAME")}</span>.
                    </div>
                    <Lottie
                        animationData={lottieSuccess}
                        loop={true}
                        autoplay={true}
                        style={{ width: "320px", margin: "30px auto 0px" }}
                    />
                </div>
            </div>
        );
    };

    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentQuery();
    };

    return <GenericModal isOpen={model} closeModal={() => closeModal()} title={title()} content={content()} />;
}
