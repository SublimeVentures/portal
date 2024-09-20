import { useCallback } from "react";
import { useFormContext } from "react-hook-form";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { useOfferDetailsStore } from "@/v2/modules/offer/store";
import { DynamicIcon } from "@/v2/components/ui/dynamic-icon";
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/v2/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import { Input } from "@/v2/components/ui/input";
import { Button } from "@/v2/components/ui/button";
import { formatNumber } from "./utils";

export default function InvestFormFields({ amount, handleAmountChange, handleCurrencyChange }) {
    const { getCurrencySettlement } = useEnvironmentContext();
    const { control, setValue, formState: { errors } } = useFormContext();
    
    const { allocationData } = useOfferDetailsStore();
    const dropdownCurrencyOptions = getCurrencySettlement();

    const handleSelectCurrency = useCallback((value, callback) => {
        if (value) handleCurrencyChange(value, callback)
    }, []);
    
    const handleChange = useCallback((event, fieldOnChange) => {
        const { value } = event.target;
        const newValue = value.replace(/\D/g, "");
        const numericValue = newValue ? Number(newValue) : 0;
        const formattedValue = formatNumber(value);

        handleAmountChange(numericValue, fieldOnChange, [numericValue])
        event.target.value = formattedValue;
    }, []);

    const handleSetMin = useCallback(() => {
        const newValue = allocationData?.allocationUser_min;
        if (newValue != null) handleAmountChange(newValue, setValue, ["investmentAmount", newValue, { shouldValidate: true }]);
    }, [allocationData?.allocationUser_min]);

    const handleSetHalf = useCallback(() => {
        const maxValue = allocationData?.allocationUser_max;
        const leftValue = allocationData?.allocationUser_left;
        
        if (maxValue != null && leftValue != null) {
            const minValue = Math.min(maxValue, leftValue);
            const half = minValue * 0.5;
            handleAmountChange(half, setValue, ["investmentAmount", half, { shouldValidate: true }]);
        }
    }, [allocationData?.allocationUser_max, allocationData?.allocationUser_left]);
    
    const handleSetMax = useCallback(() => {
        const maxValue = allocationData?.allocationUser_max;
        const leftValue = allocationData?.allocationUser_left;
        
        if (maxValue != null && leftValue != null) {
            const minValue = Math.min(maxValue, leftValue);
            handleAmountChange(minValue, setValue, ["investmentAmount", minValue, { shouldValidate: true }]);
        }
    }, [allocationData?.allocationUser_max, allocationData?.allocationUser_left]);

    return (
        <div>
            <div className="flex flex-col rounded gap-2 2xl:p-2 2xl:flex-row 2xl:bg-foreground/[.03]">
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
                                    value={formatNumber(amount || "")}
                                    aria-invalid={errors.investmentAmount ? "true" : "false"}
                                    className="w-full bg-foreground/[.06] text-sm 2xl:text-base"
                                />
                            </FormControl>
                            <FormLabel htmlFor="investmentAmount" className="absolute left-0 -top-9 text-sm 2xl:-top-11 2xl:-left-2 2xl:text-base">Investment Size</FormLabel>
                        </FormItem>
                    )}
                />
                
                <div className="w-full flex items-center gap-2 2xl:w-max 3xl:gap-4">
                    <Button 
                        type="button" 
                        className="px-1 h-full w-full text-primary bg-foreground/[.06] text-sm 2xl:text-base 2xl:px-4 3xl:px-8" 
                        onClick={handleSetMin}
                    >
                        Min.
                    </Button>
                    <Button 
                        type="button" 
                        className="px-1 h-full w-full text-primary bg-foreground/[.06] text-sm 2xl:text-base 2xl:px-4 3xl:px-8"
                        onClick={handleSetHalf}
                    >
                        50%
                    </Button>
                    <Button 
                        type="button" 
                        className="px-1 h-full w-full text-primary bg-foreground/[.06] text-sm 2xl:text-base 2xl:px-4 3xl:px-8"
                        onClick={handleSetMax}
                    >
                        Max.
                    </Button>
                </div>

                <FormField
                    name="currency"
                    control={control}
                    render={({ field }) => (
                        <FormItem className="mt-8 relative 2xl:mt-0">
                            <FormControl>
                                <Select {...field} onValueChange={(val) => handleSelectCurrency(val, field.onChange)}>
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
                            <FormLabel htmlFor="currency" className="absolute -left-0 -top-9 text-sm 2xl:-top-11 2xl:text-base">Select Currency</FormLabel>
                        </FormItem>
                    )}
                />
            </div>

            {errors.investmentAmount && <FormMessage className="mt-2">{errors.investmentAmount.message}</FormMessage>}
        </div>
    );
};
