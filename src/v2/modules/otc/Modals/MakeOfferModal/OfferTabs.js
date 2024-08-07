import { TABS } from "./useCreateOfferModalLogic";
import { RadioGroup, RadioGroupItem } from "@/v2/components/ui/radio-group";
import { cn } from "@/lib/cn";

export default function OfferTabs({ allocationMax, selectedTab, handleSelectTab }) {
    return (
        <div className="pt-4 px-8">
            <h3 className="mb-4 text-lg font-medium text-foreground">Type</h3>
            <RadioGroup value={selectedTab} onValueChange={handleSelectTab}>
                <div className="flex items-center cursor-pointer">
                    <RadioGroupItem value={TABS.BUY} id={TABS.BUY} />
                    <label htmlFor={TABS.BUY} className="ml-8">
                        <span className="block text-lg text-foreground">Buying</span>
                        <span className="text-md text-foreground">You want to buy Tokens</span>
                    </label>
                </div>
                <div className="flex items-center cursor-pointer">
                    <RadioGroupItem value={TABS.SELL} id={TABS.SELL} disabled={allocationMax === 0} />
                    <label htmlFor={TABS.SELL} className={cn("ml-8", { "opacity-20": allocationMax === 0 })}>
                        <span className="block text-lg text-foreground">Selling</span>
                        <span className="text-md text-foreground">You want to sell your tokens</span>
                    </label>
                </div>
            </RadioGroup>
        </div>
    );
}
