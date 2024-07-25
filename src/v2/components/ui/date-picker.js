import { format, parseISO } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/cn";
import { Button } from "@/v2/components/ui/button";
import { Calendar } from "@/v2/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/v2/components/ui/popover";

export function DatePicker({ label = "Select date", date = null, setDate, className, ...props }) {    
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="tertiary" className={cn("flex justify-center items-center min-w-52", className)}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(parseISO(date), "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="left" className="px-4 py-6 w-auto border-transparent text-foreground bg-navy-600 [box-shadow:0px_0px_58px_rgba(0,_0,_0,_0.39)]">
                <h3 className="mb-6 font-bold">{label}</h3>
                <Calendar label={label} mode="single" selected={date} onSelect={setDate} initialFocus {...props} />
            </PopoverContent>
        </Popover>
    );
};
