import { useState, useMemo } from "react";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import useGetToken from "@/lib/hooks/useGetToken";
import { METHOD } from "@/components/BlockchainSteps/utils";

export default function useBlockchainTakeOfferTransaction({ offerDetails, vault, currentMarket }) {
  const { getCurrencySettlement, account, currencies, activeOtcContract, otcFee } = useEnvironmentContext();
  
  const [transactionSuccessful, setTransactionSuccessful] = useState(false);
  
  const selectedCurrency = offerDetails ? currencies[offerDetails.currency] : {};
  const userAllocation = currentMarket && vault?.length > 0 ? vault.find((el) => el.id === currentMarket.offerId) : {};
  const ownedAllocation = userAllocation?.invested ? userAllocation.invested - userAllocation.locked : 0;
  const haveEnoughAllocation = offerDetails.isSell ? true : ownedAllocation >= offerDetails.amount;
  const totalPayment = offerDetails.isSell ? offerDetails.price + otcFee : otcFee;

  const customLocks = () => {
      if (!haveEnoughAllocation) return { lock: true, text: "Not enough allocation" };
      else return { lock: false };
  };

  const { lock, text } = customLocks();

  const token = useGetToken(selectedCurrency?.contract || getCurrencySettlement()[0]?.contract);

  const blockchainInteractionData = useMemo(() => {
      return {
          steps: {
              network: true,
              liquidity: true,
              allowance: true,
              transaction: true,
          },
          params: {
              requiredNetwork: offerDetails?.chainId,
              account: account.address,
              amount: Number(totalPayment),
              liquidity: Number(totalPayment),
              allowance: Number(totalPayment),
              offerDetails: offerDetails,
              spender: activeOtcContract,
              contract: activeOtcContract,
              buttonCustomText: text,
              buttonCustomLock: lock,
              buttonText: "Take Offer",
              prerequisiteTextWaiting: "Sign transaction",
              prerequisiteTextProcessing: "Getting signature",
              prerequisiteTextSuccess: "Hash obtained",
              prerequisiteTextError: "Invalid transaction data",
              transactionType: METHOD.OTC_TAKE,
          },
          token,
          setTransactionSuccessful,
      };
  }, [
      selectedCurrency,
      totalPayment,
      account,
      activeOtcContract,
      text,
      currentMarket?.id,
      offerDetails?.chainId,
      offerDetails?.otcId,
      offerDetails?.dealId,
  ]);

    return {
        totalPayment,
        transactionSuccessful,
        blockchainInteractionData,
        setTransactionSuccessful,
    };
};
