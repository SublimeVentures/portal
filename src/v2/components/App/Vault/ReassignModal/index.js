import { useMemo, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/v2/components/ui/dialog";
import { METHOD } from "@/components/BlockchainSteps/utils";

import useGetToken from "@/lib/hooks/useGetToken";
import BlockchainSteps from "@/v2/components/BlockchainSteps";
import BlockchainStepButton from "@/v2/components/BlockchainSteps/BlockchainStepButton";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import useReassign from "@/v2/components/App/Vault/ReassignModal/useReassign";
import { ReassignForm } from "@/v2/components/App/Vault/ReassignModal/ReassignForm";
import DefinitionItem from "@/v2/components/Definition/DefinitionItem";

export default function ReassignModal({ data = {} }) {
    const {
        account,
        getCurrencySettlement,
        network: { chainId },
        diamonds,
    } = useEnvironmentContext();
    const dropdownCurrencyOptions = useMemo(() => getCurrencySettlement(), []);
    const {
        getReassignModalProps,
        getReassignFormProps,
        inputs: { signature, expire, to, currency: currencyContract },
    } = useReassign(data, chainId, dropdownCurrencyOptions);
    const {
        useGetReassignPrice,
        currency,
        handleAddressChange,
        handleCurrencyChange,
        open,
        onOpenChange,
        openModal,
        closeModal,
    } = getReassignModalProps();
    const { form, handleSubmit } = getReassignFormProps();

    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

    const { data: reassignPrice } = useGetReassignPrice(diamonds[chainId]);

    const { offerId } = data;

    const token = useGetToken(currency?.contract || getCurrencySettlement()[0].contract);

    const blockchainInteractionData = useMemo(() => {
        return {
            steps: {
                liquidity: true,
                network: true,
                transaction: true,
            },
            params: {
                requiredNetwork: chainId,
                account: account.address,
                offer: offerId,
                currency: currencyContract,
                to,
                chain: chainId,
                contract: diamonds[chainId],
                buttonText: "Reassign",
                prerequisiteTextWaiting: "Sign transaction",
                prerequisiteTextProcessing: "Getting signature",
                prerequisiteTextSuccess: "Hash obtained",
                prerequisiteTextError: "Invalid transaction data",
                transactionType: METHOD.REASSIGN,
                liquidity: Number(reassignPrice),
            },
            token,
            setTransactionSuccessful,
        };
    }, [chainId, account.address, offerId, reassignPrice, expire, signature]);

    const { getBlockchainStepButtonProps, getBlockchainStepsProps } = useBlockchainStep({
        data: blockchainInteractionData,
    });

    return (
        <div className="max-h-screen w-full">
            <Dialog open={open} onOpenChange={onOpenChange} onClose={closeModal}>
                <DialogContent>
                    <DialogHeader className="md:items-center">
                        <DialogTitle>
                            {transactionSuccessful ? "Investment successful" : "Allocation Reassign"}
                        </DialogTitle>
                        <DialogDescription className="max-w-80 md:text-center">
                            You want to reassign your allocation in{" "}
                            <span className="text-green-500 uppercase">{data.title}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <dl className="definition-section ">
                        <dl className="definition-section definition-grid">
                            <DefinitionItem term="Market">{reassignPrice}</DefinitionItem>
                        </dl>
                        <ReassignForm
                            form={form}
                            handleSubmit={handleSubmit}
                            reassignPrice={Number(reassignPrice)}
                            dropdownCurrencyOptions={dropdownCurrencyOptions}
                            handleCurrencyChange={handleCurrencyChange}
                            handleAddressChange={handleAddressChange}
                        />
                        <BlockchainSteps {...getBlockchainStepsProps()} />
                    </dl>
                    <BlockchainStepButton className="w-full md:w-64" {...getBlockchainStepButtonProps()} />
                </DialogContent>
            </Dialog>
            <button
                onClick={openModal}
                className="text-base text-foreground transition-colors hover:bg-primary/30 rounded cursor-pointer bg-gradient-to-r from-primary to-primary-600"
            >
                Reassign My Allocation
            </button>
        </div>
    );
}
