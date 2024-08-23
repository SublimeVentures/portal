import React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import { Button } from "./button";
import FilterLIstIcon from "@/v2/assets/svg/filter-list.svg";
import RestartAltIcon from "@/v2/assets/svg/restart-alt.svg";
import { cn } from "@/lib/cn";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;

// eslint-disable-next-line react/display-name
export const DropdownMenuButton = React.forwardRef(
    ({ children, variant = "tertiary", icon: Icon = FilterLIstIcon, ...props }, forwardedRef) => {
        return (
            <DropdownMenuPrimitive.Trigger asChild ref={forwardedRef} {...props}>
                <Button variant={variant} className="px-3 flex gap-3 md:px-6 md:gap-3.5">
                    <Icon className="size-3 md:size-4" />
                    <span>{children}</span>
                </Button>
            </DropdownMenuPrimitive.Trigger>
        );
    },
);

// eslint-disable-next-line react/display-name
export const DropdownMenuContent = React.forwardRef(({ children, className, ...props }, forwardedRef) => {
    return (
        <DropdownMenuPrimitive.Portal className="z-50">
            <DropdownMenuPrimitive.Content
                {...props}
                align="start"
                sideOffset={26}
                ref={forwardedRef}
                className={cn(
                    "z-10 py-10 min-w-60 bg-navy-600 rounded [box-shadow:0px_0px_58px_rgba(0,_0,_0,_0.39)]",
                    className,
                )}
            >
                {children}
            </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
    );
});

// eslint-disable-next-line react/display-name
export const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className,
        )}
        {...props}
    />
));

// eslint-disable-next-line react/display-name
export const DropdownMenuLabel = React.forwardRef(({ children, ...props }, forwardedRef) => {
    return (
        <DropdownMenuPrimitive.Label
            {...props}
            ref={forwardedRef}
            className="mb-4 px-8 flex items-baseline justify-between text-foreground text-base leading-none"
        >
            {children}
        </DropdownMenuPrimitive.Label>
    );
});

export const DropdownMenuLabelReset = ({ children, ...props }) => {
    return (
        <button className="group flex gap-2 text-primary text-md font-semibold leading-none border-none" {...props}>
            {children}
            <RestartAltIcon className="size-3.5 transition-transform group-hover:rotate-180 group-hover:scale-x-[-1]" />
        </button>
    );
};

// eslint-disable-next-line react/display-name
export const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, ...props }, forwardedRef) => {
    return (
        <DropdownMenuPrimitive.CheckboxItem
            {...props}
            ref={forwardedRef}
            className={cn(
                "group mx-2 px-6 py-2 relative flex items-center gap-6 text-foreground bg-transparent rounded hover:bg-foreground/[.1] cursor-pointer select-none outline-none transition-colors",
                className,
            )}
        >
            <div
                className={cn(
                    "aspect-square h-4 w-4 shrink-0 rounded text-foreground border shadow cursor-pointer transition-all group-hover:border-accent group-hover:shadow-accent group-data-[state=checked]:border-accent group-data-[state=checked]:shadow-accent",
                )}
            >
                <DropdownMenuPrimitive.ItemIndicator className="w-full h-full flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-[2px] bg-accent" />
                </DropdownMenuPrimitive.ItemIndicator>
            </div>
            {children}
        </DropdownMenuPrimitive.CheckboxItem>
    );
});

// eslint-disable-next-line react/display-name
export const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <DropdownMenuPrimitive.RadioItem
            ref={ref}
            className={cn(
                "group mx-2 px-6 py-2 relative flex items-center gap-6 text-foreground bg-transparent rounded hover:bg-foreground/[.1] cursor-pointer select-none outline-none transition-colors",
                className,
            )}
            {...props}
        >
            <div
                className={cn(
                    "aspect-square h-4 w-4 shrink-0 rounded-full text-foreground border shadow cursor-pointer transition-all group-hover:border-accent group-hover:shadow-accent group-data-[state=checked]:border-accent group-data-[state=checked]:shadow-accent",
                )}
            >
                <DropdownMenuPrimitive.ItemIndicator className="w-full h-full flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-accent" />
                </DropdownMenuPrimitive.ItemIndicator>
            </div>

            {children}
        </DropdownMenuPrimitive.RadioItem>
    );
});
