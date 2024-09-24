import { useMemo, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/v2/components/ui/dialog";
import { METHOD } from "@/components/BlockchainSteps/utils";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/v2/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import { DynamicIcon } from "@/v2/components/ui/dynamic-icon";

export default function ReassignModal(props) {
    const {
        useGetReassignPrice,
        currency,
        handleCurrencyChange,
        open,
        onOpenChange,
        openModal,
        closeModal,
        data = {},
    } = props;
    const {
        account,
        getCurrencySettlement,
        network: { chainId },
        diamonds,
        ...args
    } = useEnvironmentContext();

    const form = useForm();

    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

    const dropdownCurrencyOptions = getCurrencySettlement();

    const { data: ReassignPrice } = useGetReassignPrice(diamonds[chainId]);

    console.log(getCurrencySettlement());

    console.log(args);

    console.log(currency);

    const { offerId } = data;

    console.log(typeof ReassignPrice);

    const blockchainInteractionData = useMemo(() => {
        return {
            steps: {
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
            },
            // token,
            setTransactionSuccessful,
        };
    }, [account]);

    return (
        <>
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
                                                            <DynamicIcon className="p-1 w-6 h-6" name={option.symbol} />
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
                    </Form>
                </DialogContent>
            </Dialog>
            <button
                onClick={openModal}
                className="text-base text-foreground transition-colors hover:bg-primary/30 rounded cursor-pointer bg-gradient-to-r from-primary to-primary-600"
            >
                Reassign My Allocation
            </button>
        </>
    );
}
