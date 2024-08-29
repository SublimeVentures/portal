import Image from "next/image";
import Link from "next/link";
import { CiBitcoin, CiDollar, CiCircleInfo } from "react-icons/ci";

import { Tooltiper, TooltipType } from "@/components/Tooltip";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { routes } from "@/v2/routes";
import { cn } from "@/lib/cn";

export default function SingleMarket({ name, genre, slug, currentMarket, isManaged, ticker, ppu, dealStructure, activeDealsCount }) {
    const { cdn } = useEnvironmentContext();
    const isSelected = currentMarket ? currentMarket.slug === slug : false;

    return (
        <Link
            shallow
            href={{
                pathname: routes.OTC,
                query: {
                    market: slug,
                    view: "offers",
                },
            }}
            className={cn(
                "h-24 p-4 mr-2 flex items-center bg-foreground/[0.03] transition-hover rounded hover:bg-foreground/[0.09] md:flex-row",
                { "bg-foreground/[0.15] hover:bg-foreground/[0.15]": isSelected },
            )}
        >
            <Image src={`${cdn}/research/${slug}/icon.jpg`} className="rounded" alt={slug} width={70} height={70} />
            <div className="ml-4 flex flex-col gap-0.5">
                <h4 className="text-base font-medium text-foreground leading-none">{name}</h4>
                <p className="text-xs 3xl:text-sm font-light text-foreground/[.5] leading-none">{genre}</p>
                <div className="flex items-center gap-1">
                    {getPayoutStructure(isManaged, ticker)}
                    <Tooltiper 
                        wrapper={<CiCircleInfo className="text-2xl text-foreground/[.5]" />}
                        text={`${dealStructure ? `${dealStructure}, ` : ""}Price: ${ppu ? `$${ppu}` : "TBA"}`}
                        type={TooltipType.Primary}
                    />
                    <Tooltiper
                        wrapper={
                            <span className="w-5 h-5 flex items-center justify-center text-2xs text-foreground/50 border border-foreground/50 rounded-full">
                                {activeDealsCount}
                            </span>
                        }
                        text="Listed offers"
                        type={TooltipType.Primary}
                    />    
                </div>
            </div>
        </Link>
    );
}


const getPayoutStructure = (isManaged, ticker) => {
    return isManaged ? (
        <Tooltiper
            wrapper={<CiDollar className="text-2xl text-foreground/50" />}
            text="Payout in stablecoins"
            type={TooltipType.Primary}
        />
    ) : (
        <Tooltiper
            wrapper={<CiBitcoin className="text-2xl text-foreground/50" />}
            text={`Payout in $${ticker}`}
            type={TooltipType.Primary}
        />
    );
};
