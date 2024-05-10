import { Alert, AlertTitle, AlertDescription, AlertIcon } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import ExclamationMark from "@/assets/v2/svg/exclamation-mark.svg";
import { cn } from "@/lib/cn";

const AlertDestructive = ({ variant = "default", title = "Error", description = "Unknown error occurs", btnText = "Refetch", actionFn }) => (
  <Alert variant="destructive" className={cn("flex items-center", { "py-12 flex-col justify-center": variant === "column" })}>
      <AlertIcon icon={ExclamationMark} className="bg-destructive" />
      <div className={cn("pt-4 pb-8 flex flex-col items-center", { "p-0 ml-4 items-start": variant === "default" })}>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
      </div>
        
      {actionFn && <Button variant="destructive" className={cn("max-w-xs", { "ml-auto": variant === "default" })} onClick={actionFn}>{btnText}</Button>}
  </Alert>
)

export default AlertDestructive;
