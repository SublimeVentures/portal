import Image from "next/image";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import MarketDetails from "./MarketDetails";

export default function CurrentMarket({ currentMarket }) {
    const { name, ticker, genre, slug } = currentMarket;
    const { cdn } = useEnvironmentContext();

    return (
        <div className="mb-2 w-full items-center justify-between md:flex">
            <div className="mb-2 flex items-center gap-4 2xl:gap-8">
                <Image
                    src={`${cdn}/research/${slug}/icon.jpg`}
                    className="size-16 2xl:size-32 bg-lime-500"
                    alt={slug}
                    width={100}
                    height={100}
                />
                <div>
                    <div className="flex items-center 2xl:items-start">
                        <h3 className="text-lg font-bold text-foreground leading-none 2xl:text-[42px]">{name}</h3>
                        <p className="ml-2 text-md text-foreground/[.5] leading-none whitespace-nowrap 2xl:text-5xl">${ticker}</p>
                    </div>
                    <p className="text-md text-foreground 2xl:text-9xl">{genre}</p>
                </div>
            </div>

            <MarketDetails
                src={`${cdn}/research/${slug}/icon.jpg`}
                alt={`Icon of ${name}`}
                offer={{ ticker }}
                className="w-80"
            />
        </div>
    );
};
