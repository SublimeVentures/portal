import { forwardRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { IconButton } from "@/v2/components/ui/icon-button";
import { cn } from "@/lib/cn";
import CrossIcon from "@/v2/assets/svg/cross.svg";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = forwardRef(({ className, ...props }, ref) => <DialogPrimitive.Overlay ref={ref} className={cn("overlay", className)} {...props} />)

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = forwardRef(({ className, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "dialog-gradient max-w-[700px] w-11/12 fixed left-[50%] top-[50%] z-50 grid rounded translate-x-[-50%] translate-y-[-50%] gap-8 px-[53px] py-[32px] shadow-[0_0_58px_hsla(0, 0%, 0%, 0.38)]",
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 md:w-full data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
                className,
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close 
                className="absolute right-[53px] top-[32px] rounded opacity-70 ring-offset-background transition-base hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                onClick={props.handleClose}
            >
                <IconButton name="Close" icon={CrossIcon} className="hidden md:block" />
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPortal>
))

DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }) => <div className={cn("flex flex-col items-center justify-center space-y-1.5 text-center md:text-left md:justify-start md:items-start", className)} {...props} />

DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }) => <div className={cn("flex flex-col gap-4", className )} {...props} />

DialogFooter.displayName = "DialogFooter";

const DialogTitle = forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Title ref={ref} className={cn("text-2xl font-medium text-foreground md:text-10xl", className)} {...props} />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cn("text-md font-light text-foreground text-center md:text-3xl md:text-left", className)} {...props} />
));

DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
};
