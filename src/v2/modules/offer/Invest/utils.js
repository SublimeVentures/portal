import * as z from "zod";

import { MIN_DIVISIBLE, MIN_ALLOCATION } from "@/lib/investment";

export const formatNumber = (value) => {
    const stringValue = typeof value === "number" ? value.toString() : value;
    const numericValue = stringValue.replace(/\D/g, "");

    return numericValue ? `$${Number(numericValue).toLocaleString("en-US")}` : "$0";
};

export const getInvestSchema = (allocation, currencies) => {
    const symbols = currencies.map((currency) => currency.symbol);

    return z.object({
        investmentAmount: z
            .union([z.string(), z.number()])
            .transform((val) => (typeof val === "string" ? Number(val) : val))
            .refine((val) => !isNaN(val), { message: "Investment amount must be a valid number" })

            // Check if user still has available allocation (allocationUser_left must be greater than 0)
            .refine(() => allocation.allocationUser_left > MIN_ALLOCATION, { message: "Maximum allocation filled" })
            .pipe(
                z
                    .number()

                    // Minimum investment validation
                    .min(
                        Math.min(
                            allocation.allocationUser_left,
                            Math.max(allocation.allocationUser_min || MIN_ALLOCATION, MIN_ALLOCATION),
                        ),
                        {
                            message: `Minimum amount is ${Math.min(
                                allocation.allocationUser_left,
                                Math.max(allocation.allocationUser_min || MIN_ALLOCATION, MIN_ALLOCATION),
                            )}`,
                        },
                    )

                    // Maximum investment validation (based on user's max allocation and remaining allocation)
                    .max(Math.min(allocation.allocationUser_max, allocation.allocationUser_left), {
                        message: `Maximum amount is ${Math.min(allocation.allocationUser_max, allocation.allocationUser_left)}`,
                    })

                    // Validation for divisibility by MIN_DIVISIBLE (investment amount must be divisible by 50)
                    .refine((val) => val % MIN_DIVISIBLE === 0, {
                        message: `Investment amount must be divisible by ${MIN_DIVISIBLE}`,
                    }),
            )

            // Validate that the investment amount does not exceed the remaining allocation
            .refine((val) => val <= allocation.allocationUser_left, {
                message: `Maximum investment: ${allocation.allocationUser_left.toLocaleString()}`,
            }),

        // Validate that the currency is one of the symbols from env data
        currency: z.enum(symbols, {
            message: `Currency must be one of: ${symbols.join(", ")}`,
        }),
    });
};
