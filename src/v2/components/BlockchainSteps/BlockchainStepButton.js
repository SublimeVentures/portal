import { Button } from "@/v2/components/ui/button";

import { stepsStatus } from "./reducer";

export default function BlockchainStepButton({ run, status, buttonLock, buttonText }) {
    return (
        <Button
            variant={status === stepsStatus.IDLE ? "accent" : "outline"}
            className={status === stepsStatus.IDLE ? "" : "border-accent text-accent"}
            onClick={run}
            disabled={buttonLock}
        >
            {buttonText}
        </Button>
    );
};
