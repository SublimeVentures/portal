import { useEffect, useMemo, useState } from "react";
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
        inputs: { to, currency: currencyContract },
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

    const activeDiamond = diamonds[chainId];

    const blockchainInteractionData = useMemo(() => {
        return {
            steps: {
                liquidity: true,
                network: true,
                transaction: true,
                allowance: true,
            },
            params: {
                requiredNetwork: chainId,
                account: account.address,
                offer: offerId,
                currency: currencyContract,
                to,
                chain: chainId,
                contract: activeDiamond,
                spender: activeDiamond,
                buttonText: "Reassign",
                prerequisiteTextWaiting: "Sign transaction",
                prerequisiteTextProcessing: "Getting signature",
                prerequisiteTextSuccess: "Hash obtained",
                prerequisiteTextError: "Invalid transaction data",
                transactionType: METHOD.REASSIGN,
                allowance: Number(reassignPrice),
                liquidity: Number(reassignPrice),
            },
            token,
            setTransactionSuccessful,
        };
    }, [chainId, account.address, offerId, currencyContract, to, reassignPrice, token, activeDiamond]);

    const { getBlockchainStepButtonProps, getBlockchainStepsProps } = useBlockchainStep({
        data: blockchainInteractionData,
    });

    useEffect(() => {
        if (transactionSuccessful) {
            void data.refetchVaults();
        }
    }, [transactionSuccessful]);

    return (
        <div className="max-h-screen w-full">
            <Dialog open={open} onOpenChange={onOpenChange} onClose={closeModal}>
                <DialogContent className="overflow-y-auto max-h-[80vh]">
                    <DialogHeader className="md:items-center">
                        <DialogTitle>
                            {transactionSuccessful ? (
                                "Reassign Successful"
                            ) : (
                                <div className="flex gap-2">
                                    <span className="text-green-500 uppercase">{data.title}</span>
                                    <span>Allocation Reassign</span>
                                </div>
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    <dl className="definition-section ">
                        <dl className="definition-section definition-grid">
                            <DefinitionItem term="Transaction Fee">{`${Number(reassignPrice)}$`}</DefinitionItem>
                        </dl>
                        <ReassignForm
                            form={form}
                            handleSubmit={handleSubmit}
                            reassignPrice={Number(reassignPrice)}
                            dropdownCurrencyOptions={dropdownCurrencyOptions}
                            handleCurrencyChange={handleCurrencyChange}
                            handleAddressChange={handleAddressChange}
                            disabled={getBlockchainStepsProps().buttonLock}
                        />
                        <BlockchainSteps {...getBlockchainStepsProps()} />
                    </dl>
                    <div className="flex w-full justify-center">
                        {currencyContract && to && !transactionSuccessful && (
                            <BlockchainStepButton className="w-full md:w-64" {...getBlockchainStepButtonProps()} />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            <button
                onClick={openModal}
                className="box-border inline-flex items-center justify-center text-xs sm:text-sm sm:leading-6 text-white rounded transition-all whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none bg-transparent border border-white hover:bg-white/20 group-hover/button:bg-white/20 py-2 px-4 sm:px-8 mb-3.5 mt-auto w-full font-xs"
            >
                Reassign My Allocation
            </button>
        </div>
    );
}
