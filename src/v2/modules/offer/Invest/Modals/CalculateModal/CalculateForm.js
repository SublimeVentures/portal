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
                <span className="text-base mb-2 lg:text-lg">Buying Allocation</span>
                <div className="relative w-full ">
                    <Input type="fund" value={amount} onChange={handleAmountChange} className="px-4 w-full md:px-8" />
                    <span className="px-4 absolute right-0 top-1/2 -translate-y-1/2 text-foreground/50 font-light md:px-8">
                        USD
                    </span>
                </div>
            </label>

            <div className="p-6 flex items-center justify-between w-full bg-green-500/10 rounded md:py-8 md:px-12">
                <IconButton variant="secondary" icon={FaChevronLeft} onClick={() => handleMultiplierChange(false)} />
                <div className="text-4xl text-green-500">x{multiplierParsed}</div>
                <IconButton variant="secondary" icon={FaChevronRight} onClick={() => handleMultiplierChange(true)} />
            </div>

            <label className="w-full flex flex-col text-foreground">
                <span className="text-base mb-2 lg:text-lg">Return</span>
                <div className="relative w-full ">
                    <Input value={price} className="px-4 w-full md:px-8" />
                    <span className="px-4 absolute right-0 top-1/2 -translate-y-1/2 text-foreground/50 font-light md:px-8">
                        USD
                    </span>
                </div>
            </label>
        </div>
    );
}
