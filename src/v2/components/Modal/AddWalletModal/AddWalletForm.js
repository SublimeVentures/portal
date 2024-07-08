import { useEffect } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/v2/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import { Input } from "@/v2/components/ui/input";
import { createFormSchema } from "./schema";
import { isAddressValid } from "./utils";

export default function AddWalletForm({ networkList }) {
    const formSchema = createFormSchema(networkList);

    const { control, watch, setError, clearErrors, ...form } = useForm({
        resolver: zodResolver(formSchema),
        mode: "all",
        onSubmit: (values) => {
            console.log('Submit:', values, isAddressValid[selectedNetwork](values.address))
        },
        defaultValues: {
            address: '',
            network: networkList[0].id ?? '',
        },
    });

    const network = watch('network');
    const address = watch('address');

    useEffect(() => {
        if (address) {
            try {
                formSchema.parse({ address, network });
                clearErrors('address');
            } catch (e) {
                e.errors.forEach(error => setError(error.path[0], { type: "manual", message: error.message }));
            }
        }
    }, [network, address, setError]);

    return (
        <>
            <Form {...form}>
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
                                    <Select {...field} onValueChange={val => field.onChange(val, field.onChange)}>
                                        <SelectTrigger className="border text-md bg-transparent text-foreground/[.6]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {networkList.map(option => (
                                                <SelectItem key={option.id} value={option.id}>
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
            </Form>
        </>      
    );
};
