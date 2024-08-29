import Image from "next/image";
import { cn } from "@/lib/cn";

export const DescriptionListHelper = ({ term, children }) => (
    <>
        <dt className="mx-auto w-16 text-sm 3xl:text-base font-light text-foreground/[.5] leading-none whitespace-nowrap">
            {term}
        </dt>
        <dd className="mx-auto w-16 text-sm 3xl:text-base font-medium 3xl:font-light text-foreground leading-none whitespace-nowrap">
            {children}
        </dd>
    </>
);

export default function MarketDetails({ src, alt, offer, className }) {
    const { ticker, ppu, dealStructure, activeDealsCount } = offer;

    return (
        <dl
            className={cn(
                "relative py-4 px-8 3xl:min-w-96 grid grid-flow-col items-center bg-foreground/[.1] rounded",
                className,
            )}
        >
            <DescriptionListHelper term="Payout">${ticker}</DescriptionListHelper>
            <DescriptionListHelper term="Price">{dealStructure ? `${dealStructure}, ` : ""} {ppu ? `$${ppu}` : "TBA"}</DescriptionListHelper>
            <DescriptionListHelper term="Listed">{activeDealsCount}</DescriptionListHelper>
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
