import moment from "moment";
import { CalendarIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/cn";
import { Button } from "@/v2/components/ui/button";
import { Calendar } from "@/v2/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/v2/components/ui/popover";
import CrossIcon from "@/v2/assets/svg/cross.svg";

export function DatePicker({
    label = "Select date",
    variant = "tertiary",
    align = "left",
    value = null,
    onChange,
    className,
    ...props
}) {
    const handleReset = (event) => {
        event.stopPropagation();
        onChange(null);
    };
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={variant} className={cn("flex justify-center items-center sm:min-w-52", className)}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? (
                        <>
                            <span className="hidden sm:inline">{moment(value).format("LL")}</span>
                            <span className="sm:hidden">{moment(value).format("L")}</span>
                            <Button variant="secondary" className="p-0 sm:p-2 -mr-5 ml-3" onClick={handleReset} asChild>
                                <span>
                                    <CrossIcon className="size-2" />
                                </span>
                            </Button>
                        </>
                    ) : (
                        <span>Pick a date</span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align={align}
                className="px-4 py-6 w-auto border-transparent text-white bg-primary-900 [box-shadow:0px_0px_58px_rgba(0,_0,_0,_0.39)]"
            >
                <h3 className="mb-6 font-base text-lg">{label}</h3>
                <Calendar
                    label={label}
                    mode="single"
                    selected={value ? new Date(value) : value}
                    onSelect={onChange}
                    initialFocus
                    {...props}
                />
            </PopoverContent>
        </Popover>
    );
}
