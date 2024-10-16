import { TABS } from "./useCreateOfferModalLogic";
import { RadioGroup, RadioGroupItem } from "@/v2/components/ui/radio-group";
import { cn } from "@/lib/cn";

const Label = ({ label, text, description }) => (
    <>
        <span className="text-sm md:text-base text-foreground">
            <span className="hidden md:inline">{text}</span>
            <span className="inline md:hidden">{label}</span>
        </span>
        <span className="hidden md:block text-sm font-light text-foreground">{description}</span>
    </>
);

export default function OfferTabs({ allocationMax, selectedTab, handleSelectTab }) {
    return (
        <div className="pt-4 px-8">
            <h3 className="mb-4 text-base font-medium text-foreground">Type</h3>
            <RadioGroup value={selectedTab} onValueChange={handleSelectTab} className="flex flex-row md:flex-col">
                <div className="flex items-center cursor-pointer" onClick={() => handleSelectTab(TABS.BUY)}>
                    <RadioGroupItem value={TABS.BUY} id={TABS.BUY} />
                    <label htmlFor={TABS.BUY} className="ml-2 md:ml-8">
                    <Label label="Buy Tokens" text="Buying" description="You want to buy Tokens" />
                    </label>
                </div>
                <div className="flex items-center cursor-pointer" onClick={() => handleSelectTab(TABS.SELL)}>
                    <RadioGroupItem value={TABS.SELL} id={TABS.SELL} disabled={allocationMax === 0} />
                    <label htmlFor={TABS.SELL} className={cn("ml-2 md:ml-8", { "opacity-20": allocationMax === 0 })}>
                    <Label label="Sell Tokens" text="Selling" description="You want to sell your tokens" />
                    </label>
                </div>
            </RadioGroup>
        </div>
    );
}
