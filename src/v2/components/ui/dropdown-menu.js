import React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Button } from "./button";
import { cn } from "@/lib/cn";
import FilterLIstIcon from "@/v2/assets/svg/filter-list.svg";
import RadioUncheckedIcon from "@/v2/assets/svg/radio-unchecked.svg";
import RadioCheckedIcon from "@/v2/assets/svg/radio-checked.svg";
import RestartAltIcon from "@/v2/assets/svg/restart-alt.svg";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

// eslint-disable-next-line react/display-name
export const DropdownMenuButton = React.forwardRef(
    ({ children, variant, icon: Icon = FilterLIstIcon, ...props }, forwardedRef) => {
        return (
            <DropdownMenuPrimitive.Trigger asChild ref={forwardedRef} {...props}>
                <Button variant={variant} className="flex gap-3 md:gap-3.5 px-3 md:px-6">
                    <Icon className="size-3 md:size-4" />
                    <span>{children}</span>
                </Button>
            </DropdownMenuPrimitive.Trigger>
        );
    },
);

// eslint-disable-next-line react/display-name
export const DropdownMenuContent = React.forwardRef(({ children, ...props }, forwardedRef) => {
    return (
        <DropdownMenuPrimitive.Portal className="z-50">
            <DropdownMenuPrimitive.Content
                {...props}
                align="start"
                sideOffset={26}
                ref={forwardedRef}
                className="bg-navy-600 rounded-md py-5 [box-shadow:0px_0px_58px_rgba(0,_0,_0,_0.39)] z-10 min-w-60"
            >
                {children}
            </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
    );
});

// eslint-disable-next-line react/display-name
export const DropdownMenuLabel = React.forwardRef(({ children, ...props }, forwardedRef) => {
    return (
        <DropdownMenuPrimitive.Label
            {...props}
            ref={forwardedRef}
            className="px-8 mb-3.5 text-white text-2xl leading-none flex items-end justify-between"
        >
            {children}
        </DropdownMenuPrimitive.Label>
    );
});

export const DropdownMenuLabelReset = ({ children, ...props }) => {
    return (
        <button
            className="text-primary text-md leading-none border-none flex gap-2 hover:font-semibold group"
            {...props}
        >
            {children}
            <RestartAltIcon className="size-3.5 group-hover:rotate-180 group-hover:scale-x-[-1] transition-transform" />
        </button>
    );
};

export const DropdownMenuItem = DropdownMenuPrimitive.Item;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const commonCheckClassNames = "size-5 rounded-full shadow-accent transition-shadow";
const CheckedIndicator = ({ className }) => {
    return (
        <RadioCheckedIcon
            className={cn(
                commonCheckClassNames,
                "text-accent [box-shadow:0px_3px_30px_var(--tw-shadow-color)]",
                className,
            )}
        />
    );
};
const UncheckedIndicator = ({ className }) => {
    return (
        <RadioUncheckedIcon
            className={cn(
                commonCheckClassNames,
                "group-hover:[box-shadow:0px_3px_30px_var(--tw-shadow-color)]",
                className,
            )}
        />
    );
};

// eslint-disable-next-line react/display-name
export const DropdownMenuCheckboxItem = React.forwardRef(({ children, ...props }, forwardedRef) => {
    return (
        <DropdownMenuPrimitive.CheckboxItem
            {...props}
            ref={forwardedRef}
            className="group flex items-center gap-5 px-8 py-2 text-white text-md cursor-pointer leading-none"
        >
            {props.checked === true && <CheckedIndicator />}
            {props.checked === false && <UncheckedIndicator />}
            {children}
        </DropdownMenuPrimitive.CheckboxItem>
    );
});

export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// eslint-disable-next-line react/display-name
export const DropdownMenuRadioItem = React.forwardRef(({ children, ...props }, forwardedRef) => {
    return (
        <DropdownMenuPrimitive.RadioItem
            {...props}
            ref={forwardedRef}
            className="group flex items-center gap-5 px-8 py-2 text-white text-md cursor-pointer leading-none"
        >
            <UncheckedIndicator className="group-aria-[checked=true]:hidden" />
            <CheckedIndicator className="group-aria-[checked=false]:hidden" />
            {children}
        </DropdownMenuPrimitive.RadioItem>
    );
});

export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
