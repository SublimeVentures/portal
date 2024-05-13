import { forwardRef } from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";
import CrossIcon from "@/assets/v2/svg/cross.svg";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = forwardRef(({ className, ...props }, ref) => <SheetPrimitive.Overlay className={cn("overlay", className)} {...props} ref={ref} />)

SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

// @Todo - Set the header height in the calc function. The mobile header hasn't been created yet, so I added 100px
const sheetVariants = cva(
    "bg-sheet-gradient fixed z-50 transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
    {
        variants: {
            side: {
                left: "bottom-0 left-0 h-full w-3/4 rounded-lg data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-lg sm:rounded-l-none",
                right: "bottom-0 right-0 w-full max-h-[calc(100vh_-_100px)] data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right rounded-lg sm:max-w-lg sm:max-h-full sm:max-w-lg sm:rounded-r-none",
            },
        },
        defaultVariants: {
            side: "right",
        },
    }
)

const SheetContent = forwardRef(({ side, className, children, ...props }, ref) => (
    <SheetPortal>
        <SheetOverlay className="hidden sm:block" />
        <SheetPrimitive.Content
            ref={ref}
            className={cn(sheetVariants({ side }), className)}
            {...props}
        >
            <SheetPrimitive.Close className="hidden absolute z-50 right-9 top-11 rounded ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary sm:block">
                <IconButton name="Close" icon={CrossIcon} />
            </SheetPrimitive.Close>
            
            {children}
        </SheetPrimitive.Content>
    </SheetPortal>
))

SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({ className, ...props }) => (
    <div className="p-4 gradient-border-sheet-header sm:p-0">
        <div className="bg-sheet-pattern bg-cover bg-center bg-no-repeat ] rounded-lg sm:m-[2px] sm:rounded-tr-none sm:rounded-b-none">
            <div className="bg-gray-400/[.7] rounded-lg sm:m-[2px] sm:rounded-tr-none sm:rounded-b-none">
                <div className={cn("relative pb-7 pt-11 px-9 flex flex-col items-center text-center", className)} {...props} />
            </div>
        </div>
    </div>
)

SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }) => (
    <div className={cn("px-20 py-4 mt-auto flex flex-col space-y-4 text-center", className )} {...props} />
)

SheetFooter.displayName = "SheetFooter";

const SheetBody = ({ className, ...props }) => (
    <div className={cn("mx-10 my-4 grow overflow-auto sm:px-10", className )} {...props} />
)

SheetBody.displayName = "SheetBody";

const SheetTitle = forwardRef(({ className, ...props }, ref) => (
    <SheetPrimitive.Title
        ref={ref}
        className={cn("text-10xl font-medium text-foreground", className)}
        {...props}
    />
))

SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = forwardRef(({ className, ...props }, ref) => (
    <SheetPrimitive.Description
        ref={ref}
        className={cn("text-xl text-foreground", className)}
        {...props}
    />
))

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
}
