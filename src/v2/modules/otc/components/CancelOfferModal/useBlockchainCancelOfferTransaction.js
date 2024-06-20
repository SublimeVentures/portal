import { useState, useMemo } from "react";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { METHOD } from "@/components/BlockchainSteps/utils";

export default function useBlockchainCancelOfferTransaction({ otcId, dealId, requiredNetwork }) {
    const { account, activeOtcContract } = useEnvironmentContext();

    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

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
            setTransactionSuccessful,
        };
    }, [account, activeOtcContract, otcId, dealId]);

    return {
        transactionSuccessful,
        blockchainInteractionData,
        setTransactionSuccessful,
    };
};
