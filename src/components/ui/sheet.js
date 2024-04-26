import { forwardRef } from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cva } from "class-variance-authority";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/cn";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = forwardRef(({ className, ...props }, ref) => (
    <SheetPrimitive.Overlay
        className={cn(
            "fixed inset-0 z-50 bg-[#0A1728]/[.7] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
        ref={ref}
    />
))

SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
    "bg-sheet-gradient fixed z-50 overflow-hidden transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
    {
        variants: {
            side: {
                top: "inset-x-0 top-0 rounded-b-lg data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
                bottom: "inset-x-0 bottom-0 rounded-t-lg data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
                left: "inset-y-0 left-0 h-full w-3/4 rounded-r-lg data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-lg sm:rounded-l-none",
                right: "inset-y-0 right-0 h-full w-full rounded-lg data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-lg sm:rounded-r-none",
            },
        },
        defaultVariants: {
            side: "right",
        },
    }
)

const SheetContent = forwardRef(({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Content
            ref={ref}
            className={cn(sheetVariants({ side }), className)}
            {...props}
        >
            <SheetPrimitive.Close className="absolute z-50 right-[38px] top-[46px] rounded ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <IconButton name="Close" icon={Cross2Icon} />
            </SheetPrimitive.Close>
            {children}
        </SheetPrimitive.Content>
    </SheetPortal>
))

SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({ className, ...props }) => (
    <div className="bg-[#163D50] cardBorderPrimary-sheet">
        <div className={cn("relative pb-[27px] pt-[46px] px-[38px] flex flex-col items-center text-center", className )} {...props} />
    </div>
)

SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }) => (
  <div className={cn("px-20 py-4 mt-auto flex flex-col space-y-4 text-center", className )} {...props} />
)

SheetFooter.displayName = "SheetFooter";

const SheetBody = ({ className, ...props }) => (
  <div className={cn("mx-10 px-10 my-4 grow overflow-auto", className )} {...props} />
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
