import Image from "next/image";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/v2/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import { Input } from "@/v2/components/ui/input";
import { Button } from "@/v2/components/ui/button";

const mockedIcon = `https://cdn.basedvc.fund/research/blockgames/icon.jpg`;

const OfferField = ({ name, control, handleChange, ...props }) => {
    return (
        <FormField
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem className="h-24 w-full">
                    <FormControl>
                        <Input
                            {...field}
                            {...props}
                            type="fund"
                            onChange={(evt) => handleChange(evt, field.onChange)}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

const OfferSelect = ({ name, control, options, handleChange }) => {
    return (
        <FormField
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem className="w-[80px] self-center">
                    <FormControl>
                        <Select {...field} onValueChange={(val) => handleChange(val, field.onChange)}>
                            <SelectTrigger className="text-md border-none bg-transparent text-foreground/[.6]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((option) => (
                                    <SelectItem key={option.symbol} value={option.symbol}>
                                        {option.symbol}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                </FormItem>
            )}
        />
    );
};

const OfferMaxValue = ({ name, control, handleChange }) => {
    return (
        <FormField
            name={name}
            control={control}
            render={() => (
                <FormItem className="w-[80px] self-center">
                    <FormControl>
                        <Button
                            className="pl-10 pr-0 pt-6 pb-0 text-primary hover:enabled:text-white hover:enabled:bg-transparent hover:enabled:bg-transparent bg-transparent border-none"
                            onClick={handleChange}
                        >
                            max
                        </Button>
                    </FormControl>
                </FormItem>
            )}
        />
    );
};

export default function OfferForm({ form, cdn, market, multiplierParsed, getOfferFieldProps }) {
    return (
        <>
            <Form {...form}>
                <div className="pt-2 pb-4 px-8 flex flex-col bg-foreground/[.06] rounded">
                    <h3 className="pt-4 pb-4 text-lg font-medium text-foreground">Your offer</h3>
                    <div className="w-full flex items-center">
                        <div className="w-full flex items-center">
                            <div className="relative w-full">
                                <OfferField
                                    placeholder="Offer Amount"
                                    icon={
                                        <Image
                                            src={`${cdn}/research/${market.slug}/icon.jpg`}
                                            className="inline w-10 h-10 mr-4 rounded"
                                            alt={`Avatar of ${market.name} market`}
                                            width={40}
                                            height={40}
                                        />
                                    }
                                    {...getOfferFieldProps("amount")}
                                    after={<OfferMaxValue {...getOfferFieldProps("max")} />}
                                />
                            </div>
                        </div>
                    </div>

                    <span className="text-lg pb-4 text-foreground text-center">x {multiplierParsed}</span>

                    <div className="relative flex items-center">
                        <div className="flex items-center">
                            <OfferField
                                icon={
                                    <Image
                                        src={mockedIcon}
                                        className="inline w-10 h-10 mr-4 rounded"
                                        alt="Avatar of selected currency"
                                        width={40}
                                        height={40}
                                    />
                                }
                                after={<OfferSelect {...getOfferFieldProps("currency")} />}
                                {...getOfferFieldProps("price")}
                            />
                        </div>
                    </div>
                </div>
            </Form>
        </>
    );
}
