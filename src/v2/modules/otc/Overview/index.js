import Image from "next/image";
import Link from "next/link";

import { Card } from "@/v2/components/ui/card";
import { Button } from "@/v2/components/ui/button";
import { Skeleton } from "@/v2/components/ui/skeleton";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { routes } from "@/v2/routes";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import useMarket from "../logic/useMarket";
import MarketDetails from "./MarketDetails";

export default function Overview() {
    const { currentMarket, isLoading } = useMarket();
    const { name, ticker, genre, slug } = currentMarket ?? {};
    const { cdn } = useEnvironmentContext();

    if (!currentMarket) {
        return null;
    }
    
    return (
        <Card variant="none" className="p-4 h-max flex flex-col w-full justify-between gap-4 bg-settings-gradient md:flex-row md:items-center">
            {isLoading ? <Skeleton className="h-64 md:h-24" /> : (
                <>
                    <div className="mb-2 flex items-center gap-4 2xl:gap-8">
                        <Image
                            src={`${cdn}/research/${slug}/icon.jpg`}
                            className="size-24 rounded"
                            alt={slug}
                            width={100}
                            height={100}
                        />
                        <div className="w-full">
                            <h3 className="text-[21px] font-semibold text-foreground leading-none">{name}</h3>
                            <p className="text-[16px] text-foreground">{genre}</p>
                            <Button asChild variant="outline" className="mt-2 w-full">
                                <Link href={`${routes.Opportunities}/${slug}`}>
                                    Project Overview
                                    <ArrowIcon className="ml-4 w-3 h-3" />
                                </Link>
                            </Button>
                        </div>
                    </div>
        
                    <MarketDetails src={`${cdn}/research/${slug}/icon.jpg`} alt={`Icon of ${name}`} offer={{ ticker }} />
                </>
            )}
        </Card>
    );
};
