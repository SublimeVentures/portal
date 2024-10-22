import Lottie from "lottie-react";
import { useMemo, useState } from "react";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import lottieSuccess from "@/assets/lottie/success.json";
import { METHOD } from "@/components/BlockchainSteps/utils";
import useGetToken from "@/lib/hooks/useGetToken";
import { getReferralClaimSignature } from "@/fetchers/referral.fetcher";
import { getTenantConfig } from "@/lib/tenantHelper";
import BlockchainSteps from "@/v2/components/BlockchainSteps";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import BlockchainStepButton from "@/v2/components/BlockchainSteps/BlockchainStepButton";
import BigNumber from "bignumber.js";

const { NAME } = getTenantConfig().seo;

export const blockchainPrerequisite = async (params) => {
    const { claimId, account, offerId, amount } = params;
    console.log("REFERRAL_CLAIMSIGN_VALID", params);

    const transaction = await getReferralClaimSignature(claimId, offerId, amount, account);
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

export default function ReferralClaimPayout({ props }) {
    const { amount, offerId, id: claimId, currency } = props;
    const { getCurrencySettlement, account, network, activeInvestContract } = useEnvironmentContext();
    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

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
                amount,
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
    }, [currency?.contract, amount, offerId, claimId, account, activeInvestContract]);

    const { getBlockchainStepButtonProps, getBlockchainStepsProps } = useBlockchainStep({
        data: blockchainInteractionData,
    });

    const contentQuery = () => {
        return (
            <div className="flex flex-col flex-1 items-center text-white">
                <BlockchainSteps {...getBlockchainStepsProps()} />
                <BlockchainStepButton className="mt-8 w-full md:w-64" {...getBlockchainStepButtonProps()} />
            </div>
        );
    };

    const contentSuccess = () => {
        return (
            <div className="flex flex-col flex-1">
                <div className={"flex flex-1 flex-col justify-center items-center"}>
                    <div>
                        Thank you for referring for <span className={"font-bold text-gold"}>{NAME}</span>.
                    </div>
                    <Lottie
                        animationData={lottieSuccess}
                        loop={true}
                        autoplay={true}
                        className="w-[320px] my-0 mx-auto mt-[30px]"
                    />
                </div>
            </div>
        );
    };

    return transactionSuccessful ? contentSuccess() : contentQuery()
}
