import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAddress } from "web3-validator";

import { createFormSchema } from "./schema";
import { addUserWallet } from "@/fetchers/settings.fetcher";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/v2/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import { Input } from "@/v2/components/ui/input";
import { Button } from "@/v2/components/ui/button";
import { settingsKeys } from "@/v2/constants";

const FormStatusEnum = Object.freeze({
    IDLE: "IDLE",
    LOADING: "LOADING",
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
});

export default function AddWalletForm({ wallets, networkList }) {
    const queryClient = useQueryClient();

    const [status, setStatus] = useState(FormStatusEnum.IDLE);
    const [errorMessage, setErrorMessage] = useState("");

    const schema = createFormSchema(networkList);

    const { control, watch, setError, clearErrors, ...form } = useForm({
        resolver: zodResolver(schema),
        mode: "onBlur",
        defaultValues: {
            address: "",
            network: networkList[0].chainId ?? 0,
        },
    });

    const address = watch("address");

    const handleNetworkChange = useCallback(
        (network, address, onChange) => {
            onChange(network);

            try {
                clearErrors("address");
            } catch (e) {
                schema.parse({ address, network });
                e.errors.forEach((error) => setError(error.path[0], { type: "manual", message: error.message }));
            }
        },
        [schema, clearErrors, setError],
    );

    const handleSubmit = async (values) => {
        setStatus("loading");

        try {
            const isNewWallet = wallets.some((el) => el.wallet !== values.address);
            if (!isNewWallet) throw new Error("Wallet already exists");

            const isSupportedWallet = isAddress(values.address);
            if (isSupportedWallet) throw new Error("You have to provide airdrop wallet");

            await addUserWallet(values.address, values.network);
            setStatus(FormStatusEnum.SUCCESS);
            queryClient.invalidateQueries(settingsKeys.wallets);
        } catch (error) {
            setErrorMessage(error.message ?? "An unknown error occurred");
            setStatus(FormStatusEnum.ERROR);
        }
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="pt-2 pb-8 px-8 flex flex-col gap-4 bg-foreground/[.06] rounded">
                        <div className="relative flex flex-col-reverse items-center md:flex-row">
                            <div className="flex items-center w-full">
                                <FormField
                                    name="address"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem className="h-24 flex flex-col w-full">
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    autoComplete="false"
                                                    onChange={(evt) => field.onChange(evt, field.onChange)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                name="network"
                                control={control}
                                render={({ field }) => (
                                    <FormItem className="my-1 flex flex-col w-full md:mt-2 md:ml-2 md:w-40 md:-mb-0.5">
                                        <FormLabel className="md:sr-only">Network</FormLabel>
                                        <FormControl>
                                            <Select
                                                {...field}
                                                onValueChange={(value) =>
                                                    handleNetworkChange(value, address, field.onChange)
                                                }
                                            >
                                                <SelectTrigger className="border text-md bg-transparent text-foreground/[.6]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {networkList.map((option) => (
                                                        <SelectItem key={option.chainId} value={option.chainId}>
                                                            {option.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Button type="submit" variant="gradient" className="mt-4 w-full">
                        Add Wallet
                    </Button>
                </form>

                {status === FormStatusEnum.ERROR && <div className="text-error-500 text-center">{errorMessage}</div>}
            </Form>
        </>
    );
}
