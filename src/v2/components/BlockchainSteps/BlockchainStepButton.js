import { STEPS_STATE } from "./enums";
import { cn } from "@/lib/cn";
import { Button } from "@/v2/components/ui/button";

export default function BlockchainStepButton({ run, status, buttonLock, buttonText, className, variant }) {
    const isIdle = status === STEPS_STATE.PENDING;

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
