import { forwardRef } from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/cn";

const alertVariants = cva(
  "relative w-full rounded px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "text-destructive [&>svg]:text-destructive bg-destructive-dark",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = forwardRef(({ className, variant, ...props }, ref) => <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />)
Alert.displayName = "Alert"

const AlertTitle = forwardRef(({ className, ...props }, ref) => <h4 ref={ref} className={cn("mb-1 text-2xl font-semibold leading-none tracking-tight", className)} {...props} />)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn("text-md font-light[&_p]:leading-relaxed", className)} {...props} />)
AlertDescription.displayName = "AlertDescription"

const AlertIcon = forwardRef(({ icon: Icon, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("size-12 flex items-center justify-center shrink-0 text-foreground rounded-full", className)} {...props}>
        <Icon className="p-3 w-full h-full" />
    </div>
  )
})

AlertIcon.displayName = "AlertIcon"

export { Alert, AlertTitle, AlertDescription, AlertIcon }
