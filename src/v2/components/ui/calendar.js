import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/cn";
import { buttonVariants } from "@/v2/components/ui/button";

function Calendar({ className, styles, showOutsideDays = true, ...props }) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("w-96", className)}
            classNames={{
                caption: "mb-4 p-2 relative flex justify-center items-center bg-foreground/[.1] rounded",
                caption_label: "text-sm font-light",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    buttonVariants({ variant: "link" }),
                    "h-7 w-7 bg-transparent p-0 text-foreground hover:text-foreground",
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "w-full text-foreground text-sm font-light rounded",
                row: "flex w-full mt-2",
                cell: cn(
                    "relative p-0 w-full text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
                    props.mode === "range"
                        ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                        : "[&:has([aria-selected])]:rounded-md",
                ),
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "p-0 h-10 w-10 font-light border border-transparent aria-selected:opacity-100 hover:border-accent",
                ),
                day_range_start: "day-range-start",
                day_range_end: "day-range-end",
                day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside:
                    "day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                ...styles,
            }}
            components={{
                IconLeft: () => <ChevronLeftIcon className="h-4 w-4" />,
                IconRight: () => <ChevronRightIcon className="h-4 w-4" />,
            }}
            {...props}
        />
    );
}

Calendar.displayName = "Calendar";

export { Calendar };
