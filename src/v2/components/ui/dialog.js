import { forwardRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cva } from "class-variance-authority";
import { IconButton } from "@/v2/components/ui/icon-button";
import { cn } from "@/lib/cn";
import CrossIcon from "@/v2/assets/svg/cross.svg";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay ref={ref} className={cn("overlay", className)} {...props} />
));

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const dialogVariants = cva([], {
    variants: {
        variant: {
            accent: "dialog-gradient",
            default: "bg-gradient angle-[114deg] from-[#06162E] via-[#11354B] to-[#06162E]",
            pattern: "bg-pattern",
        },
    },
    defaultVariants: {
        variant: "accent",
    },
});

const DialogContent = forwardRef(
    (
        {
            className,
            children,
            variant,
            handleClose,
            close = true,
            closeClassName = "hidden md:block",
            closeProps,
            ...props
        },
        ref,
    ) => (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    dialogVariants({ variant }),
                    "max-w-[700px] w-11/12 fixed left-[50%] top-[50%] z-50 grid rounded translate-x-[-50%] translate-y-[-50%] gap-8 px-4 md:px-13 py-8 shadow-[0_0_58px_hsla(0, 0%, 0%, 0.38)]",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 md:w-full data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
                    className,
                )}
                {...props}
            >
                {children}
                {close && (
                    <DialogPrimitive.Close
                        className={cn(
                            "absolute top-2.5 right-2.5 p-2.5 3xl:right-13 3xl:top-8 3xl:p-3.5 rounded opacity-70 ring-offset-background transition-base hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                            closeClassName,
                        )}
                        onClick={handleClose}
                        asChild
                    >
                        <IconButton name="Close" icon={CrossIcon} />
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPortal>
    ),
);

DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }) => (
    <div
        className={cn(
            "flex flex-col items-center justify-center gap-y-8 text-center md:text-left md:justify-start md:items-start",
            className,
        )}
        {...props}
    />
);

DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }) => <div className={cn("flex flex-col gap-4", className)} {...props} />;

DialogFooter.displayName = "DialogFooter";

const DialogTitle = forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn("text-xl md:text-3xl font-normal md:font-medium text-foreground", className)}
        {...props}
    />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-xs font-normal text-foreground text-center md:text-lg md:text-left", className)}
        {...props}
    />
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
