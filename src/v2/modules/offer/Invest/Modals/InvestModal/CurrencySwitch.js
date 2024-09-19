import { useCallback } from "react";
import { useFormContext } from "react-hook-form";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { DynamicIcon } from "@/v2/components/ui/dynamic-icon";
import { FormControl, FormField, FormItem } from "@/v2/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";

export default function CurrencySwitch({ handleCurrencyChange }) {
    const { getCurrencySettlement } = useEnvironmentContext();
    
    const dropdownCurrencyOptions = getCurrencySettlement();
    const { control } = useFormContext();

    const handleSelectCurrency = useCallback((value, callback) => {
        if (value) handleCurrencyChange(value, callback)
    }, []);

    return (
        <FormField
            name="currency"
            control={control}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Select {...field} onValueChange={(val) => handleSelectCurrency(val, field.onChange)}>
                            <SelectTrigger className="w-full h-full bg-foreground/[.06]">
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
                </FormItem>
            )}
        /> 
    );
};

// Code for version from design
            {/* <label
                htmlFor="usdt"
                className={cn("p-2 relative w-full font-light text-foreground/50 bg-transparent text-center cursor-pointer", { "text-foreground bg-primary": selectedCurrency === 'usdt' })}
            >
                <input
                    type="radio"
                    id="usdt"
                    name="currency"
                    value="usdt"
                    checked={selectedCurrency === 'usdt'}
                    onChange={handleChange}
                    className="absolute opacity-0"
                />
                USDT
            </label>
            <label
                htmlFor="usdc"
                className={cn("p-2 relative w-full font-light text-foreground/50 bg-transparent text-center cursor-pointer", { "text-foreground bg-primary": selectedCurrency === 'usdc' })}
            >
                <input
                    type="radio"
                    id="usdc"
                    name="currency"
                    value="usdc"
                    checked={selectedCurrency === 'usdc'}
                    onChange={handleChange}
                    className="absolute opacity-0"
                />
                USDC
            </label> */}