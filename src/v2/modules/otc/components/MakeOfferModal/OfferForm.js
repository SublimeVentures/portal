import Image from "next/image";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/v2/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import { Input } from "@/v2/components/ui/input";

const mockedIcon = `https://cdn.basedvc.fund/research/blockgames/icon.jpg`

const OfferField = ({ name, label, control, handleChange, ...props }) => {
    return (
        <FormField name={name} control={control} render={({ field }) => (
            <FormItem className="h-24 w-full">
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input {...field} {...props} type="number" onChange={evt => handleChange(evt, field.onChange)} />
                  </FormControl>
                  <FormMessage />
              </FormItem>
            )}
        />
    )
};

const OfferSelect = ({ name, control, options, handleChange }) => {
    return (
        <FormField name={name} control={control}
            render={({ field }) => (
                <FormItem className="absolute ml-2 mt-2 right-0 w-[80px] self-center">
                    <FormControl>
                        <Select {...field} onValueChange={val => handleChange(val, field.onChange)}>
                            <SelectTrigger className="text-md bg-transparent text-foreground/[.6]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map(option => (
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
    )
};

export default function OfferForm({ form, cdn, market, multiplierParsed, getOfferFieldProps }) {
    return (
        <>
            <h3 className="pt-4 px-8 text-lg font-medium text-foreground">Your offer</h3>
            <Form {...form}>
                <div className="pt-2 pb-4 px-8 flex flex-col gap-4 bg-foreground/[.06] rounded">
                    <div className="w-full flex items-center">
                        <div className="w-full flex items-center">
                            <Image
                                src={`${cdn}/research/${market.slug}/icon.jpg`}
                                className="inline mr-2 rounded-full"
                                alt={`Avatar of ${market.name} market`}
                                width={40}
                                height={40}
                            />

                            <div className="relative w-full">
                                <OfferField {...getOfferFieldProps("amount")} />
                                <div className="absolute right-4 bottom-0 transform -translate-y-8">
                                    <p className="text-md text-foreground/[.6]">USD</p>
                                </div>   
                            </div>                     
                        </div>                                          
                    </div>
                 </div>

                <span className="text-lg text-foreground text-center">x {multiplierParsed}</span>

                <div className="pt-2 pb-4 px-8 flex flex-col gap-4 bg-foreground/[.06] rounded">
                    <div className="relative flex items-center">
                        <div className="flex items-center">
                            <Image
                                src={mockedIcon}
                                className="inline mr-2 rounded-full"
                                alt="Avatar of selected currency"
                                width={40}
                                height={40}
                            />
                            <OfferField {...getOfferFieldProps("price")} />
                        </div>

                        <OfferSelect {...getOfferFieldProps("currency")} />
                    </div>
                </div>
            </Form>
        </>            
    )
}
