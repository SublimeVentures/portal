import PropTypes from "prop-types";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/v2/components/ui/form";
import { Input } from "@/v2/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import { DynamicIcon } from "@/v2/components/ui/dynamic-icon";

export const ReassignForm = ({
    form,
    handleSubmit,
    dropdownCurrencyOptions,
    handleCurrencyChange,
    handleAddressChange,
    disabled,
}) => {
    return (
        <Form {...form}>
            <form onSubmit={handleSubmit}>
                <FormField
                    name="to"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full m-0">
                            <FormLabel>Allocation Receiver</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    autoComplete="false"
                                    disabled={disabled}
                                    onChange={(evt) => {
                                        handleAddressChange(evt.target.value);
                                        field.onChange(evt, field.onChange);
                                    }}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <br />
                <FormField
                    name="currency"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="mt-8 relative 2xl:mt-0">
                            <FormControl>
                                <Select
                                    {...field}
                                    onValueChange={(val) => handleCurrencyChange(val, field.onChange)}
                                    disabled={disabled}
                                >
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
                            <FormLabel htmlFor="currency" className="absolute -left-0 -top-9 2xl:-top-11 2xl:text-base">
                                Select Currency
                            </FormLabel>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};

ReassignForm.propTypes = {
    reassignPrice: PropTypes.number,
    handleCurrencyChange: PropTypes.func,
    handleAddressChange: PropTypes.func,
    handleSubmit: PropTypes.func,
    form: PropTypes.object,
    dropdownCurrencyOptions: PropTypes.object,
    disabled: PropTypes.bool,
};
