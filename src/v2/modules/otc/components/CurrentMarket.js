import Image from "next/image";

import { Card } from "@/v2/components/ui/card";
import { Button } from "@/v2/components/ui/button";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import MarketDetails from "./MarketDetails";

export default function CurrentMarket({ currentMarket }) {
    const { name, ticker, genre, slug } = currentMarket;
    const { cdn } = useEnvironmentContext();

    return (
        <Card variant="none" className="p-4 w-full items-center justify-between bg-settings-gradient md:flex">
            <div className="mb-2 flex items-center gap-4 2xl:gap-8">
                <Image
                    src={`${cdn}/research/${slug}/icon.jpg`}
                    className="size-16 2xl:size-32 bg-lime-500"
                    alt={slug}
                    width={100}
                    height={100}
                />
                <div>
                    <h3 className="text-[24px] font-bold text-foreground leading-none">{name}</h3>
                    <p className="text-[20px] text-foreground">{genre}</p>
                    <Button variant="outline" className="mt-2">
                        Project Overview
                        <ArrowIcon className="ml-4 w-3 h-3" />
                    </Button>
                </div>
            </div>

            <MarketDetails
                src={`${cdn}/research/${slug}/icon.jpg`}
                alt={`Icon of ${name}`}
                offer={{ ticker }}
                className="w-96"
            />
        </Card>
    );
};
