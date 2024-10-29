import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import useCalculate, { MAX_MULTIPLIER, MIN_MULTIPLIER } from "./useCalculate";
import { cn } from "@/lib/cn";
import { Input } from "@/v2/components/ui/input";
import { IconButton } from "@/v2/components/ui/icon-button";

// @todo - create universal definition - taken from fundraise
const Definition = ({ term, isLoading, children }) => (
    <>
        <dt>{term}:</dt>
        <dd className="text-right justify-self-end font-medium">{children}</dd>
    </>
);

export default function CalculateForm({ fee = 10 }) {
    const {
        state: { amount, price, total, multiplier },
        handleAmountChange,
        handleMultiplierChange,
    } = useCalculate(fee);
    const multiplierParsed = multiplier.toFixed(2);

    return (
        <div className="flex flex-col gap-4">
            <label className="w-full flex flex-col text-white">
                <span className="text-base mb-2 lg:text-lg">Buying Allocation</span>
                <div className="relative w-full ">
                    <Input type="fund" value={amount} onChange={handleAmountChange} className="px-4 w-full md:px-8" />
                    <span className="px-4 absolute right-0 top-1/2 -translate-y-1/2 text-white/50 font-light md:px-8">
                        USD
                    </span>
                </div>
            </label>
            <div
                className={cn("p-6 flex items-center justify-between w-full bg-green-500/10 rounded md:py-8 md:px-12")}
            >
                <IconButton
                    variant="secondary"
                    icon={FaChevronLeft}
                    onClick={() => handleMultiplierChange(false)}
                    disabled={multiplier <= MIN_MULTIPLIER}
                    className={cn(
                        multiplier <= MIN_MULTIPLIER ? "opacity-50 cursor-not-allowed hover:bg-primary/10" : "",
                    )}
                />
                <div className="text-4xl text-green-500">x{multiplierParsed}</div>
                <IconButton
                    variant="secondary"
                    icon={FaChevronRight}
                    onClick={() => handleMultiplierChange(true)}
                    disabled={multiplier >= MAX_MULTIPLIER}
                    className={cn(
                        multiplier >= MAX_MULTIPLIER ? "opacity-50 cursor-not-allowed hover:bg-primary/10" : "",
                    )}
                />
            </div>

            <label className="w-full flex flex-col text-white">
                <span className="text-base mb-2 lg:text-lg">Return total</span>
                <div className="relative w-full ">
                    <Input value={total} className="px-4 w-full md:px-8" />
                    <span className="px-4 absolute right-0 top-1/2 -translate-y-1/2 text-white/50 font-light md:px-8">
                        USD
                    </span>
                </div>
            </label>

            <dl className="grid grid-cols-2 gap-2 text-sm font-light text-white/50 select-none">
                <Definition term="Fees">{fee}%</Definition>
                <Definition term="Subtotal">${price}</Definition>
            </dl>
        </div>
    );
}
