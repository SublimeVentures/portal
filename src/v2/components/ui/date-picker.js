import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/cn";
import { Button } from "@/v2/components/ui/button";
import { Calendar } from "@/v2/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/v2/components/ui/popover";

export function DatePicker({ date = null, setDate, className }) {    
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className={cn("justify-center min-w-52", className)}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(parseISO(date), "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
        </Popover>
    );
};
