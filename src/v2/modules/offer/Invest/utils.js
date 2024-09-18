import * as z from "zod";

export const formatNumber = (value) => {
    const stringValue = typeof value === 'number' ? value.toString() : value;
    const numericValue = stringValue.replace(/\D/g, "");
    
    return numericValue ? `$${Number(numericValue).toLocaleString("en-US")}` : "$0";
};

export const getInvestSchema = (allocation, currencies) => {
    const symbols = currencies.map(currency => currency.symbol);

    return z.object({
        investmentAmount: z
            .union([z.string(), z.number()])
            .transform(val => typeof val === "string" ? Number(val) : val)
            .refine(val => !isNaN(val), { message: "Investment amount must be a valid number" })
            .pipe(
                z.number()
                    .min(allocation.allocationUser_min, {
                        message: `Minimum amount is ${allocation.allocationUser_min}`,
                    })
                    .max(Math.min(allocation.allocationUser_max, allocation.allocationUser_left), {
                        message: `Maximum amount is ${Math.min(allocation.allocationUser_max, allocation.allocationUser_left)}`,
                    })
            ),
        currency: z.enum(symbols, {
            message: `Currency must be one of: ${symbols.join(', ')}`,
        }),
    });
};

