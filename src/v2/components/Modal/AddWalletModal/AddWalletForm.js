import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignMessage } from "wagmi";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { addUserWallet } from "@/fetchers/settings.fetcher";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/v2/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import { Input } from "@/v2/components/ui/input";
import { Button } from "@/v2/components/ui/button";
import { createFormSchema } from "./schema";

const FormStatusEnum = Object.freeze({
    IDLE: 'IDLE',
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
})

// example solana: 7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV
export default function AddWalletForm({ networkList, wallets }) {
    const { account } = useEnvironmentContext();
    const { error: signMessageError, signMessageAsync: signMessageFn } = useSignMessage();
    // const newWallet = !wallets.find((el) => el.wallet === account?.address) && !!account?.address;
    
    const [status, setStatus] = useState(FormStatusEnum.IDLE);
    const [errorMessage, setErrorMessage] = useState('');

    const schema = createFormSchema(networkList);

    const { control, watch, setError, clearErrors, ...form } = useForm({
        resolver: zodResolver(schema),
        mode: "onBlur",
        // defaultValues: {
        //     address: 'H9swkY4JBxKfSMVTm8vzt5JFmQHTubsxsNwx6UgravF5',
        //     network: networkList[0].chainId ?? 0,
        // },
        defaultValues: {
            address: '',
            network: networkList[0].chainId ?? 0,
        },
    });

    const address = watch('address');

    const handleNetworkChange = useCallback((network, address, onChange) => {   
        onChange(network);

        try {
            clearErrors('address');
        } catch (e) {
            schema.parse({ address, network });
            e.errors.forEach(error => setError(error.path[0], { type: "manual", message: error.message }));
        }
    }, [schema, clearErrors, setError]);

    const handleSubmit = async (values) => {
        // if (!newWallet) return
        setStatus('loading')
        let signature;

        try {
            signature = await signMessageFn({
                account: account?.address,
                message: "I acknowledge that all linked wallets will have the capability to perform actions on my behalf, including selling assets and claiming allocations associated with my account.",
            });

        } catch (err) {
            setStatus(FormStatusEnum.ERROR);
            setError(err.shortMessage);
            
            return;
        }

        if (!signature || !!signMessageError) return;
        
        console.log('signature', signature)
        // @todo - backend
        // const result = await addUserWallet(signature, values.address, values.network);
        
        // if (result?.ok) {
        //     setStatus(FormStatusEnum.SUCCESS);
        //     refetchUserWallets();
        // } else {
        //     setErrorMessage(result?.error);
        //     setStatus(FormStatusEnum.ERROR);
        // }
        return;
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="pt-2 pb-8 px-8 flex flex-col gap-4 bg-foreground/[.06] rounded">
                        <div className="relative flex flex-col-reverse items-center md:flex-row">
                            <div className="flex items-center w-full">
                                <FormField name="address" control={control} render={({ field }) => (
                                    <FormItem className="h-24 w-full">
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                autoComplete="false"
                                                onChange={evt => field.onChange(evt, field.onChange)}
                                                // onChange={evt => handleAddressChange(evt, field.onChange)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            <FormField name="network" control={control} render={({ field }) => (
                                <FormItem className="my-2 w-full md:mt-2 md:ml-2 md:w-40">
                                    <FormLabel className="md:sr-only">Network</FormLabel>
                                    <FormControl>
                                        <Select {...field} onValueChange={(value) => handleNetworkChange(value, address, field.onChange)}>
                                            <SelectTrigger className="border text-md bg-transparent text-foreground/[.6]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {networkList.map(option => (
                                                    <SelectItem key={option.chainId} value={option.chainId}>
                                                        {option.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )} />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="gradient"
                        // disabled={!newWallet}
                        className="mt-4 w-full"
                    >
                        Add Wallet
                    </Button>
                </form>
            </Form>
        </>      
    );
};
