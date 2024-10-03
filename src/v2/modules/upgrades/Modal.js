import NextImage from "next/image";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import USDCIcon from "@/v2/assets/svg/usdc.svg";
import USDTIcon from "@/v2/assets/svg/usdt.svg";
import { SelectSimple as Select, SelectItem as Option } from "@/v2/components/ui/select";
import { Label as FormLabel } from "@/v2/components/ui/label";
import { Button as BaseButton } from "@/v2/components/ui/button";
import { Dialog, DialogContent } from "@/v2/components/ui/dialog";
import Logo from "@/assets/svg/logo_1.svg";

export const Image = forwardRef(({ className, ...props }, ref) => {
    return (
        <div className="h-40 md:h-auto -mx-4 -mt-8 md:mr-0 md:-ml-13 md:-my-8 relative md:w-3/5">
            <NextImage fill {...props} ref={ref} className={cn("rounded-t md:rounded-l object-cover", className)} />
            <Logo className="absolute bottom-3 left-3 md:bottom-6 md:left-6 size-9 md:size-13" />
        </div>
    );
});
Image.displayName = "Image";

export const Content = forwardRef((props, ref) => {
    return <div {...props} ref={ref}></div>;
});
Content.displayName = "Content";

export const Title = forwardRef(({ className, children, ...props }, ref) => {
    return (
        <h1 {...props} ref={ref} className={cn("text-xl md:text-2xl mb-2 md:mb-6", className)}>
            {children}
        </h1>
    );
});
Title.displayName = "Title";

export const Description = forwardRef(({ className, children, ...props }, ref) => {
    return (
        <p {...props} ref={ref} className={cn("text-xs md:text-sm mb-6 md:mb-10 md:font-light", className)}>
            {children}
        </p>
    );
});
Description.displayName = "Description";

export const Grid = forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div {...props} ref={ref} className={cn("grid grid-cols-2 gap-4 md:gap-4 mb-6", className)}>
            {children}
        </div>
    );
});
Grid.displayName = "Grid";

const UpgradeCurrency = ({ className, icon: Icon, style }) => (
    <span className={cn("rounded size-5 inline-block p-1 shrink-0", className)} style={style}>
        <Icon />
    </span>
);

const CURRENCY_ICON = {
    USDC: USDCIcon,
    USDT: USDTIcon,
};

const CURRENCY_BG_COLOR = {
    USDC: "#2775CA",
    USDT: "#53AE94",
};

const UpgradeCurrencyPicker = ({ symbol }) => {
    return <UpgradeCurrency icon={CURRENCY_ICON[symbol]} style={{ backgroundColor: CURRENCY_BG_COLOR[symbol] }} />;
};

export const SelectCurrency = forwardRef(({ className, options = [], ...props }, ref) => {
    return (
        <Select {...props} ref={ref} className={cn("w-full", className)}>
            {options.map((currency) => {
                return (
                    <Option value={currency} key={currency.symbol}>
                        <span className="flex items-center gap-3">
                            <UpgradeCurrencyPicker symbol={currency.symbol} />
                            <span className="overflow-hidden truncate">{currency.symbol}</span>
                        </span>
                    </Option>
                );
            })}
        </Select>
    );
});
SelectCurrency.displayName = "SelectCurrency";

export const Button = forwardRef(({ className, run, buttonLock, buttonText, variant }, ref) => {
    return (
        <BaseButton variant={variant} className={cn(className)} onClick={run} disabled={buttonLock} ref={ref}>
            {buttonText}
        </BaseButton>
    );
});
Button.displayName = "Button";

export const Label = forwardRef(({ className, children, ...props }, ref) => {
    return (
        <FormLabel
            {...props}
            ref={ref}
            className={cn("!font-normal block text-xs md:text-sm leading-5 mb-1.5 md:mb-3", className)}
        >
            {children}
        </FormLabel>
    );
});
Label.displayName = "Label";

export const Kicker = forwardRef(({ className, children, ...props }, ref) => {
    return (
        <p
            {...props}
            ref={ref}
            className={cn("hidden md:block md:text-sm text-white leading-10 mb-2.5 md:mb-5", className)}
        >
            {children}
        </p>
    );
});
Kicker.displayName = "Kicker";

export default function Modal({ open, onClose, variant, children, className, ...props }) {
    return (
        <Dialog open={open}>
            <DialogContent
                handleClose={onClose}
                className={cn(
                    "flex flex-col md:flex-row max-w-5xl gap-6 md:gap-13 text-white md:min-h-[556px]",
                    className,
                )}
                variant={variant}
                closeClassName="size-7 md:size-10"
                {...props}
            >
                {children}
            </DialogContent>
        </Dialog>
    );
}
