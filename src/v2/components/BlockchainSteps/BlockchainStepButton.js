import { stepsStatus } from "./reducer";
import { Button } from "@/v2/components/ui/button";
import { cn } from "@/lib/cn";

export default function BlockchainStepButton({ run, status, buttonLock, buttonText, className, variant }) {
    const isIdle = status === stepsStatus.IDLE;

    return (
        <Button
            variant={isIdle ? variant : "outline"}
            className={cn(className, { "border-accent text-accent": !isIdle })}
            onClick={run}
            disabled={buttonLock}
        >
            {buttonText}
        </Button>
    );
}
