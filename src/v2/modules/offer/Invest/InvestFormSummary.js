import { DynamicIcon } from "@/v2/components/ui/dynamic-icon";
import { Skeleton } from "@/v2/components/ui/skeleton";

// @TODO Reuse with fundraise component
const Definition = ({ term, isLoading, children }) => (
    <>
        <dt>{term}:</dt>
        <dd className="text-right justify-self-end font-medium">
            {isLoading ? <Skeleton className="w-8" /> : children}
        </dd>
    </>
);

export default function InvestFormSubmit({ total, subtotal, fee, currency }) {
    return (
        <div className="space-y-6">
            <dl className="grid grid-cols-2 gap-2 md:gap-3 text-sm md:text-base">
                <Definition term="Subtotal">${subtotal}</Definition>
                <Definition term="Fees">{fee}%</Definition>
            </dl>

            <div className="w-full h-[1px] bg-white/10"></div>

            <div className="grid grid-rows-3 items-center justify-center text-sm text-center lg:grid-cols-2 lg:grid-rows-1 lg:text-start">
                <h4 className="text-sm md:text-base lg:col-start-1">Total Investment:</h4>
                <div className="flex justify-center font-semibold text-3xl lg:ml-auto lg:col-start-2 lg:row-span-2">
                    <div className="flex items-center gap-2">
                        <DynamicIcon name={currency} />${total}
                    </div>
                </div>
                <p className="text-sm font-regular text-white/40 lg:col-start-1">
                    Tax fees don’t contribute to deals. The subtotal will be the total allocation.
                </p>
            </div>
        </div>
    );
}
