import Image from "next/image";
import Link from "next/link";

import useMarket from "../logic/useMarket";
import MarketDetails from "./MarketDetails";
import { Card } from "@/v2/components/ui/card";
import { Button } from "@/v2/components/ui/button";
import { Skeleton } from "@/v2/components/ui/skeleton";
import { routes } from "@/v2/routes";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import useImage from "@/v2/hooks/useImage";

export default function Overview() {
    const { currentMarket, isLoading } = useMarket();
    const { name, ticker, genre, slug, dealStructure, ppu, activeDealsCount, partnerLogo, partnerName } =
        currentMarket ?? {};
    const { getResearchIconSrc } = useImage();

    if (!currentMarket) {
        return null;
    }

    return (
        <Card
            variant="none"
            className="p-4 h-max flex flex-col w-full justify-between gap-4 bg-base md:flex-row md:items-center cursor-default border-alt"
        >
            {isLoading ? (
                <Skeleton className="h-64 md:h-24" />
            ) : (
                <>
                    <div className="flex items-center gap-4 2xl:gap-8 select-none">
                        <Image
                            src={getResearchIconSrc(slug)}
                            className="size-22 3xl:size-26 rounded pointer-events-none"
                            alt={slug}
                            width={100}
                            height={100}
                        />
                        <div className="w-full select-none">
                            <h3 className="text-base font-medium 3xl:text-3xl text-white leading-none">
                                {name}
                                <small className="ml-1.5 font-light align-super text-2xs 3xl:text-base">
                                    ${ticker}
                                </small>
                            </h3>
                            <p className="text-xs 3xl:text-xl font-light text-white">{genre}</p>
                            <Button asChild variant="outline" className="3xl:hidden mt-2 w-full">
                                <Link href={`${routes.Opportunities}/${slug}`}>
                                    Project Overview
                                    <ArrowIcon className="ml-4 w-3 h-3" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <MarketDetails
                        alt={`Launched in ${partnerName}`}
                        offer={{ ticker, dealStructure, ppu, activeDealsCount, partnerLogo }}
                    />
                </>
            )}
        </Card>
    );
}
