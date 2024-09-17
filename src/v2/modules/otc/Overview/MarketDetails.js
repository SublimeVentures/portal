import Image from "next/image";
import { cn } from "@/lib/cn";

export const DescriptionListHelper = ({ term, children }) => (
    <>
        <dt className="text-center md:text-left text-sm 3xl:text-base font-light text-foreground/[.5] leading-none whitespace-nowrap">
            {term}
        </dt>
        <dd className="text-center md:text-left text-sm 3xl:text-base font-medium 3xl:font-light text-foreground leading-none whitespace-nowrap">
            {children}
        </dd>
    </>
);

export default function MarketDetails({ src, alt, offer, className }) {
    const { ticker, ppu, dealStructure, activeDealsCount, partnerLogo } = offer;

    return (
        <dl
            className={cn(
                "relative py-4 px-8 3xl:min-w-96 grid grid-flow-col items-center bg-foreground/[.1] rounded md:gap-x-4",
                className,
            )}
        >
            <DescriptionListHelper term="Payout">${ticker}</DescriptionListHelper>
            <DescriptionListHelper term="Price">
                {dealStructure ? `${dealStructure}, ` : ""} {ppu ? `$${ppu}` : "TBA"}
            </DescriptionListHelper>
            <DescriptionListHelper term="Listed">{activeDealsCount}</DescriptionListHelper>
            {partnerLogo && (
                <>
                    <dt className="absolute">
                        <span className="sr-only">Icon</span>
                    </dt>
                    <dd className="row-span-2 w-f16 flex items-center justify-center shrink-0">
                        <Image
                            src={partnerLogo}
                            alt={alt}
                            className="relative flex shrink-0 bg-black overflow-hidden rounded-full"
                            width={50}
                            height={50}
                        />
                    </dd>
                </>
            )}
        </dl>
    );
}
