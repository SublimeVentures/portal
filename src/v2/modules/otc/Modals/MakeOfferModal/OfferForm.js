import Image from "next/image";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/v2/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import { Input } from "@/v2/components/ui/input";
import { Button } from "@/v2/components/ui/button";
import USDCIcon from "@/v2/assets/svg/usdc.svg";
import USDTIcon from "@/v2/assets/svg/usdt.svg";
import { cn } from "@/lib/cn";

const CURRENCY_ICON = {
    USDC: USDCIcon,
    USDT: USDTIcon,
};

const CurrencyIcon = ({ className, icon: Icon }) => (
    <span
        className={cn(
            "inline w-10 h-10 mr-4 rounded shrink-0 bg-gradient-to-b from-primary-600 to-primary p-1.5",
            className,
        )}
    >
        {Icon ? <Icon /> : "X"}
    </span>
);

const OfferField = ({ name, control, handleChange, ...props }) => {
    return (
        <FormField
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormControl>
                        <Input
                            {...field}
                            {...props}
                            type="fund"
                            min={10}
                            step={10}
                            onChange={(evt) => {
                                evt.preventDefault();
                                handleChange(evt, field.onChange);
                            }}
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
                            <SelectTrigger className="text-xs md:text-sm border-none bg-transparent text-foreground/[.6] p-0 gap-1 md:gap-2">
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

const OfferMaxValue = ({ name, control, handleChange, className }) => {
    return (
        <FormField
            name={name}
            control={control}
            render={() => (
                <FormItem className={cn("w-[80px] self-center", className)}>
                    <FormControl>
                        <Button
                            className="pl-10 pr-0 pt-6 pb-0 text-primary bg-transparent border-none hover:enabled:text-white hover:enabled:bg-transparent"
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
    const selectedCurrency = getOfferFieldProps("currency").value;
    const maxProps = getOfferFieldProps("max");
    return (
        <>
            <Form {...form}>
                <div className="pt-2 pb-4 px-8 flex flex-col bg-foreground/[.06] rounded">
                    <h3 className="pt-4 pb-4 text-base font-medium text-foreground">Your offer</h3>
                    <div className="w-full flex items-center pb-2">
                        <div className="w-full flex items-center">
                            <div className="relative w-full">
                                <OfferField
                                    placeholder="Offer Amount"
                                    icon={
                                        <Image
                                            src={`${cdn}/research/${market.slug}/icon.jpg`}
                                            className="inline w-10 mr-4 rounded"
                                            alt={`Avatar of ${market.name} market`}
                                            width={40}
                                            height={40}
                                        />
                                    }
                                    {...getOfferFieldProps("amount")}
                                    after={
                                        <>
                                            {maxProps ? <OfferMaxValue {...maxProps} className="mr-5" /> : null}
                                            <span className="text-white/50">USD</span>
                                        </>
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <span className="text-base font-light pb-2 text-foreground text-center">x {multiplierParsed}</span>

                    <div className="relative flex items-center">
                        <div className="flex items-center w-full">
                            <OfferField
                                icon={<CurrencyIcon icon={CURRENCY_ICON[selectedCurrency]} />}
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
