import { useCallback, useEffect, useMemo, useState } from "react";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { DialogContent, DialogHeader, DialogTitle, Dialog } from "@/v2/components/ui/dialog";
import { METHOD } from "@/components/BlockchainSteps/utils";

import useGetToken from "@/lib/hooks/useGetToken";
import BlockchainSteps from "@/v2/components/BlockchainSteps";
import BlockchainStepButton from "@/v2/components/BlockchainSteps/BlockchainStepButton";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import useReassign from "@/v2/components/App/Vault/ReassignModal/useReassign";
import { ReassignForm } from "@/v2/components/App/Vault/ReassignModal/ReassignForm";
import DefinitionItem from "@/v2/components/Definition/DefinitionItem";

export default function ReassignModal({ data = {}, isReassignModalOpen: open, closeReassignModal: closeModal }) {
    const {
        account,
        getCurrencySettlement,
        network: { chainId },
        diamonds,
    } = useEnvironmentContext();
    const dropdownCurrencyOptions = useMemo(() => getCurrencySettlement(), [getCurrencySettlement]);
    const {
        getReassignModalProps,
        getReassignFormProps,
        inputs: { to, currency: currencyContract },
    } = useReassign(data, chainId, dropdownCurrencyOptions);
    const { useGetReassignPrice, currency, handleAddressChange, handleCurrencyChange, onOpenChange } =
        getReassignModalProps();
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
                prerequisite: true,
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

    const buttonProps = getBlockchainStepButtonProps();

    const closeDialog = useCallback(
        () => (buttonProps.buttonLock ? null : closeModal(transactionSuccessful)),
        [buttonProps.buttonLock, closeModal, transactionSuccessful],
    );

    return (
        <div className="max-h-screen w-full">
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent handleClose={closeDialog}>
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
                    <div className="overflow-y-auto max-h-[60vh]">
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
                                disabled={buttonProps.buttonLock}
                            />
                            <BlockchainSteps {...getBlockchainStepsProps()} />
                        </dl>
                        <div className="flex w-full justify-center">
                            {currencyContract && to && !transactionSuccessful && (
                                <BlockchainStepButton className="w-full md:w-64" {...buttonProps} />
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
