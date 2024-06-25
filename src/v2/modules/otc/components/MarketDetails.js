import Image from "next/image";
import { cn } from "@/lib/cn";

export default function MarketDetails({ src, alt, offer, className }) {
    const { ticker } = offer;

    return (
        <dl className={cn("relative py-2 px-4 grid grid-flow-col items-center bg-foreground/[.1] rounded", className)}>
            <dt className="mx-auto w-16 text-md text-foreground/[.5] leading-none whitespace-nowrap">Payout</dt>
            <dd className="mx-auto w-16 text-md text-foreground leading-none whitespace-nowrap">${ticker}</dd>
            <dt className="mx-auto w-16 text-md text-foreground/[.5] leading-none whitespace-nowrap">Price</dt>
            <dd className="mx-auto w-16 text-md text-foreground leading-none whitespace-nowrap">$0.02</dd>
            <dt className="mx-auto w-16 text-md text-foreground/[.5] leading-none whitespace-nowrap">Listed</dt>
            <dd className="mx-auto w-16 text-md text-foreground leading-none whitespace-nowrap">23</dd>
            <dt className="absolute">
                <span className="sr-only">Icon</span>
            </dt>
            <dd className="mx-auto w-16 row-span-2 flex items-center justify-center">
                <Image
                    src={src}
                    alt={alt}
                    className="relative flex shrink-0 bg-black overflow-hidden rounded-full"
                    width={50}
                    height={50}
                />
            </dd>
        </dl>
    );
};
