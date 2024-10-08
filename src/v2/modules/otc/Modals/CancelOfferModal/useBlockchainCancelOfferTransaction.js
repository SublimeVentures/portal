import { useState, useMemo } from "react";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { METHOD } from "@/components/BlockchainSteps/utils";
import useGetToken from "@/lib/hooks/useGetToken";

export default function useBlockchainCancelOfferTransaction({ otcId, dealId, requiredNetwork, currency }) {
    const { account, activeOtcContract } = useEnvironmentContext();

    const [transactionSuccessful, setTransactionSuccessful] = useState(false);
    const token = useGetToken(currency);

    const blockchainInteractionData = useMemo(() => {
        return {
            steps: {
                network: true,
                transaction: true,
            },
            params: {
                dealId,
                otcId,
                requiredNetwork,
                account: account.address,
                buttonText: "Cancel Offer",
                contract: activeOtcContract,
                transactionType: METHOD.OTC_CANCEL,
            },
            token,
            setTransactionSuccessful,
        };
    }, [account, activeOtcContract, otcId, dealId, token]);

    return {
        transactionSuccessful,
        blockchainInteractionData,
        setTransactionSuccessful,
    };
}
