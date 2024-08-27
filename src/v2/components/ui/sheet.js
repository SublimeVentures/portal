import { forwardRef } from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";

import { IconButton } from "@/v2/components/ui/icon-button";
import { cn } from "@/lib/cn";
import CrossIcon from "@/v2/assets/svg/cross.svg";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = forwardRef(({ className, ...props }, ref) => (
    <SheetPrimitive.Overlay className={cn("overlay", className)} {...props} ref={ref} />
));

SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

// @Todo - Set the header height in the calc function. The mobile header hasn't been created yet, so I added 100px
const sheetVariants = cva(
    "bg-sheet-gradient fixed z-50 transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 w-full md:h-dvh md:w-[595px]",
    {
        variants: {
            side: {
                left: "bottom-0 left-0 h-full w-3/4 rounded-lg data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-lg sm:rounded-l-none",
                right: "bottom-0 right-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:rounded-l-4xl",
            },
        },
        defaultVariants: {
            side: "right",
        },
    },
);

const SheetContent = forwardRef(({ side, className, children, ...props }, ref) => (
    <SheetPortal>
        <SheetOverlay className="hidden sm:block" />
        <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
            <SheetPrimitive.Close className="hidden absolute z-50 right-9 top-11 rounded transition-opacity outline-none hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-secondary sm:block">
                <IconButton name="Close" variant="secondary" comp="div" icon={CrossIcon} className="p-3.5" />
            </SheetPrimitive.Close>

            {children}
        </SheetPrimitive.Content>
    </SheetPortal>
));

SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }) => (
    <div className="gradient-border-sheet-header before:rounded-l-4xl">
        <div className="bg-sheet-pattern bg-cover bg-center bg-no-repeat sm:rounded-l-4xl sm:mt-0.5 sm:ml-0.5">
            <div className="bg-primary-950/[.6] sm:rounded-l-4xl">
                <div
                    className={cn(
                        "min-h-44 relative pb-7 pt-11 px-9 flex flex-col items-center text-center",
                        className,
                    )}
                    {...props}
                />
            </div>
        </div>
    </div>
);

SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }) => (
    <div className={cn("px-20 py-4 mt-auto flex flex-col space-y-4 text-center", className)} {...props} />
);

SheetFooter.displayName = "SheetFooter";

const SheetBody = ({ className, ...props }) => <div className={cn("relative grow w-full", className)} {...props} />;

SheetBody.displayName = "SheetBody";

const SheetTitle = forwardRef(({ className, ...props }, ref) => (
    <SheetPrimitive.Title
        ref={ref}
        className={cn("text-2xl md:text-3xl font-medium text-foreground", className)}
        {...props}
    />
));

SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = forwardRef(({ className, ...props }, ref) => (
    <SheetPrimitive.Description ref={ref} className={cn("text-lg font-light text-foreground", className)} {...props} />
));

SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
    Sheet,
    SheetPortal,
    SheetOverlay,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetBody,
    SheetTitle,
    SheetDescription,
};
