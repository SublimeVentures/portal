import Lottie from "lottie-react";
import { useMemo, useState } from "react";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import DynamicIcon from "@/components/Icon";
import { NETWORKS } from "@/lib/utils";
import lottieSuccess from "@/assets/lottie/success.json";
import { METHOD } from "@/components/BlockchainSteps/utils";
import BlockchainSteps from "@/components/BlockchainSteps";
import useGetToken from "@/lib/hooks/useGetToken";
import GenericModal from "@/components/Modal/GenericModal";
import { getReferralClaimSignature } from "@/fetchers/referral.fetcher";
import { getTenantConfig } from "@/lib/tenantHelper";

const { NAME } = getTenantConfig().seo;

export const blockchainPrerequisite = async (params) => {
    const { claimId, account } = params;
    console.log("REFERRAL_CLAIMSIGN_VALID", params);

    const transaction = await getReferralClaimSignature(claimId, account);
    console.log("REFERRAL_CLAIMSIGN", transaction);
    if (transaction.ok) {
        return {
            ok: true,
            data: { signature: transaction.data.signature },
        };
    } else {
        return {
            ok: false,
        };
    }
};

export default function ReferralClaimPayoutModal({ model, setter, props }) {
    const { amount, offerId, id: claimId, currency, refetchReferralClaims } = props;
    const { getCurrencySettlement, account, network, activeInvestContract } = useEnvironmentContext();
    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

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
                amount: Number(amount),
                offerId: offerId,
                claimId: claimId,
                contract: activeInvestContract,
                buttonText: "Claim",
                prerequisiteTextWaiting: "Sign transaction",
                prerequisiteTextProcessing: "Getting signature",
                prerequisiteTextSuccess: "Hash obtained",
                prerequisiteTextError: "Invalid transaction data",
                transactionType: METHOD.REFERRAL_CLAIM,
            },
            token,
            setTransactionSuccessful,
        };
    }, [
        currency?.contract,
        amount,
        offerId,
        claimId,
        account,
        activeInvestContract,
        model,
    ]);

    const closeModal = async () => {
        await refetchReferralClaims();
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
                        Referral Payout <span className="text-app-success">claimed</span>
                    </>
                ) : (
                    <>
                        <span className="text-app-success">Claim</span> referral payout
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
                            {chainDesired?.name}
                        </p>
                    </div>
                    <div className={"detailRow font-bold"}>
                        <p>CLAIM</p>
                        <hr className={"spacer"} />
                        <p className={"font-mono"}>
                            {Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
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
                        Thank you for referring for <span className={"font-bold text-gold"}>{NAME}</span>.
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
