import { useCallback } from "react";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/v2/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import { Input } from "@/v2/components/ui/input";
import { Button } from "@/v2/components/ui/button";
import { formatNumber } from "./utils";

export default function InvestForm({ allocationData, control, watch, setValue, formState: { errors }, ...form }) {
    const { network, getCurrencySettlement } = useEnvironmentContext();
    
    const dropdownCurrencyOptions = getCurrencySettlement();
    const investmentAmountValue = watch("investmentAmount");
    
    const handleChange = useCallback((event, fieldOnChange) => {
        const { value } = event.target;
        const numericValue = value.replace(/\D/g, "");
        const formattedValue = formatNumber(value);

        fieldOnChange(numericValue);
        event.target.value = formattedValue;
    }, []);

    const handleSetMin = useCallback(() => {
        if (allocationData?.allocationUser_min != null) {
            setValue("investmentAmount", allocationData.allocationUser_min);
        }
    }, [allocationData?.allocationUser_min]);

    const handleSetHalf = useCallback(() => {
        if (allocationData?.allocationUser_max != null) {
            const half = allocationData.allocationUser_max * 0.5;
            setValue("investmentAmount", half);
        }
    }, [allocationData?.allocationUser_max]);

    const handleSetMax = useCallback(() => {
        if (allocationData?.allocationUser_max != null) {
            setValue("investmentAmount", allocationData.allocationUser_max);
        }
    }, [allocationData?.allocationUser_max]);

    return (
        <Form {...form}>
            <div className="flex flex-col rounded gap-2 lg:p-2 lg:flex-row lg:bg-foreground/[.03]">
                <FormField
                    name="investmentAmount"
                    control={control}
                    render={({ field }) => (
                        <FormItem className="relative w-full">
                            <FormControl>
                                <Input
                                    {...field}
                                    id="investmentAmount"
                                    onChange={(evt) => handleChange(evt, field.onChange)}
                                    value={formatNumber(investmentAmountValue || "")}
                                    aria-invalid={errors.investmentAmount ? "true" : "false"}
                                    className="w-full bg-foreground/[.06] text-sm lg:text-base"
                                />
                            </FormControl>
                            <FormLabel htmlFor="investmentAmount" className="absolute left-0 -top-9 text-sm lg:-top-11 lg:-left-2 lg:text-base">Investment Size</FormLabel>
                        </FormItem>
                    )}
                />
                
                <div className="w-full flex items-center gap-2 lg:w-max 2xl:gap-4">
                    <Button 
                        type="button" 
                        className="px-1 h-full w-full text-primary bg-foreground/[.06] text-sm lg:text-base lg:px-4 2xl:px-8" 
                        onClick={handleSetMin}
                    >
                        Min.
                    </Button>
                    <Button 
                        type="button" 
                        className="px-1 h-full w-full text-primary bg-foreground/[.06] text-sm lg:text-base lg:px-4 2xl:px-8"
                        onClick={handleSetHalf}
                    >
                        50%
                    </Button>
                    <Button 
                        type="button" 
                        className="px-1 h-full w-full text-primary bg-foreground/[.06] text-sm lg:text-base lg:px-4 2xl:px-8"
                        onClick={handleSetMax}
                    >
                        Max.
                    </Button>
                </div>

                <FormField
                    name="currency"
                    control={control}
                    render={({ field }) => (
                        <FormItem className="mt-8 relative lg:mt-0">
                            <FormControl>
                                <Select {...field} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full h-full bg-foreground/[.06] lg:w-52">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dropdownCurrencyOptions.map((option) => (
                                            <SelectItem key={option.symbol} value={option.symbol}>
                                                {option.symbol}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormLabel htmlFor="currency" className="absolute -left-0 -top-9 text-sm lg:-top-11 lg:text-base">Select Currency</FormLabel>
                        </FormItem>
                    )}
                />
            </div>

            {errors.investmentAmount && <FormMessage>{errors.investmentAmount.message}</FormMessage>}
        </Form>
    );
};
