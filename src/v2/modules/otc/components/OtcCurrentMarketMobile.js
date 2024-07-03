import Image from "next/image";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { Card } from "@/v2/components/ui/card";
import { Button } from "@/v2/components/ui/button";
import MarketDetails from "./MarketDetails";

import ArrowIcon from "@/v2/assets/svg/arrow.svg";                    <span>Back</span>

export default function CurrentMarket({ currentMarket }) {
    const { name, ticker, genre, slug } = currentMarket;
    const { cdn } = useEnvironmentContext();

    return (
        <Card variant="static">
            <div className="mb-2 flex items-center gap-4">
                <div className="h-24 w-full flex items-center gap-8">
                    <Image
                        src={`${cdn}/research/${slug}/icon.jpg`}
                        className="rounded-full"
                        alt={slug}
                        width={100}
                        height={100}
                    />
                    
                    <div className="h-full w-full flex flex-col gap-2">
                        <h3 className="text-lg font-bold text-foreground leading-none">{name}</h3>
                        <p className="text-md text-foreground leading-none whitespace-nowrap 2xl:text-5xl">{genre}</p>
                        <Button variant="outline" className="mt-auto w-full">
                            Project Overview
                            <ArrowIcon className="ml-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <MarketDetails
                src={`${cdn}/research/${slug}/icon.jpg`}
                alt={`Icon of ${name}`}
                offer={{ ticker }}
                className="mt-6"
            />
        </Card>
    );
};
