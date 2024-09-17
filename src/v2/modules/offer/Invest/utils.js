import * as z from "zod";

export const formatNumber = (value) => {
    const stringValue = typeof value === "number" ? value.toString() : value;
    const numericValue = stringValue.replace(/\D/g, "");

    return numericValue ? `$${Number(numericValue).toLocaleString("en-US")}` : "$0";
};

export const getInvestSchema = (allocation) =>
    z.object({
        investmentAmount: z
            .string()
            .min(1, "Investment amount is required")
            .refine((val) => !isNaN(Number(val.replace(/\s/g, ""))), {
                message: "Please enter a valid number",
            })
            .transform((val) => val.replace(/\s/g, ""))
            .refine((val) => Number(val) >= allocation.allocationUser_min, {
                message: `Minimum amount is ${allocation.allocationUser_min}`,
            })
            .refine((val) => Number(val) <= allocation.allocationUser_max, {
                message: `Maximum amount is ${allocation.allocationUser_max}`,
            }),
        currency: z.string(),
    });
