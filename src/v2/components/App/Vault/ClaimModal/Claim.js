import { getSymbol } from "./Details";
import { Button as ModalButton } from "@/v2/modules/upgrades/Modal";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import BlockchainSteps from "@/v2/components/BlockchainSteps";
import { METHOD } from "@/components/BlockchainSteps/utils";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import useGetToken from "@/lib/hooks/useGetToken";
import MutedText from "@/v2/components/ui/muted-text";

export default function Claim({ data }) {
    const { account, activeInvestContract, getCurrencySettlement } = useEnvironmentContext();
    const token = useGetToken(getCurrencySettlement()[0].contract);
    const symbol = getSymbol(data);
    const { getBlockchainStepButtonProps, getBlockchainStepsProps } = useBlockchainStep({
        data: {
            steps: {
                network: true,
                transaction: true,
            },
            params: {
                requiredNetwork: data.currentPayout?.chainId,
                account: account.address,
                amount: data.currentPayout?.claims?.length,
                offerId: data.currentPayout?.offerId,
                payoutId: data.currentPayout?.id,
                claimId: data.currentPayout?.claims[0]?.id,
                contract: activeInvestContract,
                buttonText: "Claim",
                prerequisiteTextWaiting: "Sign transaction",
                prerequisiteTextProcessing: "Getting signature",
                prerequisiteTextSuccess: "Hash obtained",
                prerequisiteTextError: "Invalid transaction data",
                transactionType: METHOD.CLAIM,
            },
            token,
            setTransactionSuccessful: () => {},
        },
    });
    return (
        <>
            <BlockchainSteps className="mt-auto" {...getBlockchainStepsProps()} />
            <ModalButton variant="accent" {...getBlockchainStepButtonProps()} />
            <MutedText>You will receive {symbol} after settlement.</MutedText>
        </>
    );
}
