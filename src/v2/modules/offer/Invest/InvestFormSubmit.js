import { Button } from "@/v2/components/ui/button";

export default function InvestFormSubmit({ isBtnDisabled, btnText, investmentLocked, hasAvailableFunds }) {
    return (
        <div className="w-full flex flex-wrap gap-x-4 gap-y-2">
            <Button
                type="submit"
                name="invest"
                variant="gradient"
                disabled={isBtnDisabled || investmentLocked}
                className="flex-grow basis-full sm:basis-auto"
            >
                {btnText}
            </Button>
        </div>
    );
}
