import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import useCalculate from "./useCalculate";
import { Input } from "@/v2/components/ui/input";
import { IconButton } from "@/v2/components/ui/icon-button";

export default function CalculateForm() {
    const {
        state: { amount, price, multiplier },
        handleAmountChange,
        handleMultiplierChange,
    } = useCalculate();
    const multiplierParsed = multiplier.toFixed(2);

    return (
        <div className="flex flex-col gap-4">
            <label className="w-full flex flex-col text-foreground">
                <span className="text-base mb-2 lg:text-lg">Buying allocation</span>
                <div className="relative w-full ">
                    <Input type="fund" value={amount} onChange={handleAmountChange} className="px-8 w-full" />
                    <span className="px-8 absolute right-0 top-1/2 -translate-y-1/2 text-foreground/50 font-light">
                        USD
                    </span>
                </div>
            </label>

            <div className="py-8 px-12 flex items-center justify-between w-full bg-green-500/10 rounded">
                <IconButton variant="secondary" icon={FaChevronLeft} onClick={() => handleMultiplierChange(false)} />
                <div className="text-4xl text-green-500">x{multiplierParsed}</div>
                <IconButton variant="secondary" icon={FaChevronRight} onClick={() => handleMultiplierChange(true)} />
            </div>

            <label className="w-full flex flex-col text-foreground">
                <span className="text-base mb-2 lg:text-lg">Return</span>
                <div className="relative w-full ">
                    <Input value={price} className="px-8 w-full" />
                    <span className="px-8 absolute right-0 top-1/2 -translate-y-1/2 text-foreground/50 font-light">
                        USD
                    </span>
                </div>
            </label>
        </div>
    );
}
