import { useCallback } from "react";
import { useFormContext } from "react-hook-form";

import { RadioGroup, RadioGroupItem } from "@/v2/components/ui/inline-radio-group";
import { FormControl, FormField, FormItem } from "@/v2/components/ui/form";

export default function CurrencySwitch({ currency, handleCurrencyChange }) {
    const { control } = useFormContext();

    const handleSelectCurrency = useCallback((value, callback) => {
        if (value) handleCurrencyChange(value, callback);
    }, []);

    return (
        <FormField
            control={control}
            name="currency"
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormControl>
                        <RadioGroup {...field} onValueChange={(val) => handleSelectCurrency(val, field.onChange)}>
                            <FormItem className="w-full">
                                <FormControl>
                                    <RadioGroupItem value="USDT" checked={currency === "USDT"}>
                                        USDT
                                    </RadioGroupItem>
                                </FormControl>
                            </FormItem>
                            <FormItem className="w-full">
                                <FormControl>
                                    <RadioGroupItem value="USDC" checked={currency === "USDC"}>
                                        USDC
                                    </RadioGroupItem>
                                </FormControl>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                </FormItem>
            )}
        />
    );
}
