import { useMemo, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/v2/components/ui/dialog";
import { METHOD } from "@/components/BlockchainSteps/utils";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/v2/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import { DynamicIcon } from "@/v2/components/ui/dynamic-icon";
import DefinitionItem from "@/v2/components/Definition/DefinitionItem";
import useGetToken from "@/lib/hooks/useGetToken";
import BlockchainSteps from "@/v2/components/BlockchainSteps";
import BlockchainStepButton from "@/v2/components/BlockchainSteps/BlockchainStepButton";
import useBlockchainStep from "@/v2/components/BlockchainSteps/useBlockchainStep";
import { Input } from "@/v2/components/ui/input";
import useReassign from "@/v2/components/App/Vault/ReassignModal/useReassign";

export default function ReassignModal({ data = {} }) {
    const {
        account,
        getCurrencySettlement,
        network: { chainId },
        diamonds,
    } = useEnvironmentContext();
    const dropdownCurrencyOptions = useMemo(() => getCurrencySettlement(), []);
    const { getReassignModalProps, getReassignFormProps } = useReassign(data, chainId, dropdownCurrencyOptions);
    const { useGetReassignPrice, currency, handleCurrencyChange, open, onOpenChange, openModal, closeModal } =
        getReassignModalProps();
    const { form, handleSubmit } = getReassignFormProps();

    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

    const { data: ReassignPrice } = useGetReassignPrice(diamonds[chainId]);

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
                offerId: offerId,
                contract: diamonds[chainId],
                buttonText: "Reassign",
                prerequisiteTextWaiting: "Sign transaction",
                prerequisiteTextProcessing: "Getting signature",
                prerequisiteTextSuccess: "Hash obtained",
                prerequisiteTextError: "Invalid transaction data",
                transactionType: METHOD.REASSIGN,
                liquidity: Number(ReassignPrice),
                inputs: ["0xbcda58cc5ca1A3caE1298991d9C067fdA111E165", currency.contract, 12],
            },
            token,
            setTransactionSuccessful,
        };
    }, [chainId, account.address, offerId, ReassignPrice]);

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
                    <Form {...form}>
                        <form onSubmit={handleSubmit}>
                            <dl className="definition-section definition-grid">
                                <DefinitionItem term="Market">{Number(ReassignPrice)}</DefinitionItem>
                            </dl>
                            <FormField
                                name="to"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full m-0">
                                        <FormLabel>Allocation Receiver</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                autoComplete="false"
                                                onChange={(evt) => field.onChange(evt, field.onChange)}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="currency"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="mt-8 relative 2xl:mt-0">
                                        <FormControl>
                                            <Select
                                                {...field}
                                                onValueChange={(val) => handleCurrencyChange(val, field.onChange)}
                                            >
                                                <SelectTrigger className="w-full h-full bg-foreground/[.06] 2xl:w-46 3xl:w-52">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {dropdownCurrencyOptions.map((option) => (
                                                        <SelectItem key={option.symbol} value={option.symbol}>
                                                            <div className="flex items-center gap-2">
                                                                <DynamicIcon
                                                                    className="p-1 w-6 h-6"
                                                                    name={option.symbol}
                                                                />
                                                                {option.symbol}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormLabel
                                            htmlFor="currency"
                                            className="absolute -left-0 -top-9 text-sm 2xl:-top-11 2xl:text-base"
                                        >
                                            Select Currency
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                            <button type="submit">Submit</button>
                        </form>
                    </Form>
                    {/*<dl className="definition-section ">*/}
                    {/*    <BlockchainSteps {...getBlockchainStepsProps()} />*/}
                    {/*</dl>*/}
                    {/*<BlockchainStepButton className="w-full md:w-64" {...getBlockchainStepButtonProps()} />*/}
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
