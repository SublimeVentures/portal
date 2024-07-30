import { Skeleton } from "@/v2/components/ui/skeleton";

export default function MarketLoader({ count = 8 }) {
    return (
        <div className="h-full flex flex-col gap-4 overflow-hidden"> 
            <Skeleton count={count} className="h-24 shrink-0" />
        </div>
    );
};
