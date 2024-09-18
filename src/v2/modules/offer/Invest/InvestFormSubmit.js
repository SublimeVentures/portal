import { Button } from "@/v2/components/ui/button";

export default function InvestFormSubmit({ isDisabled, btnText, investmentLocked, hasAvailableFunds }) {
    return (
        <div className="w-full flex flex-wrap gap-x-4 gap-y-2">
            <Button 
                type="submit"
                name="invest"
                variant="gradient"
                disabled={isDisabled || investmentLocked} 
                className="flex-grow basis-full sm:basis-auto"
            >
                {btnText}
            </Button>

            {(investmentLocked && hasAvailableFunds) && (
                <Button 
                    type="submit"
                    name="invest"
                    variant="gradient" 
                    disabled={isDisabled} 
                    className="flex-grow basis-full sm:basis-auto"
                >
                    Restore
                </Button>
            )}
        </div>
    );
};
