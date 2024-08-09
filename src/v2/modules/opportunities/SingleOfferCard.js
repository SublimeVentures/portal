import Image from "next/image";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { Card } from "@/v2/components/ui/card";
import { Badge } from "@/v2/components/ui/badge";
import { Progress } from "@/v2/components/ui/progress";

export default function SingleOfferCard({ name, slug, genre, ticker, state, btnVariant, progress, dateLabel, date }) {
    const { cdn } = useEnvironmentContext();

    return (
        <Card variant="dark" className="h-full flex flex-col">
            <div className="grow">
                <div className="relative h-24 flex gap-2 lg:mb-12 lg:h-32">
                    <Image
                        src={`${cdn}/research/${slug}/icon.jpg`}
                        className="rounded lg:absolute lg:left-4 lg:-bottom-12 lg:shadow-lg"
                        alt={`Avatar for ${name} offer`}
                        width={90}
                        height={90}
                    />
                    <Image
                        src={`${cdn}/research/${slug}/bg.jpg`}
                        alt={`Background image for ${name} offer`}
                        className="object-cover rounded"
                        width={1000}
                        height={200}
                    />
                </div>

                <div className="py-4 flex justify-between items-center lg:px-4 lg:py-0 lg:items-start">
                    <div>
                        <h3
                            data-ticker={`$${ticker}`}
                            className="relative text-foreground text-2xl font-medium after:content-[attr(data-ticker)] after:text-white after:text-2xs after:font-normal after:p-4 after:absolute after:-bottom-1"
                        >
                            {name}
                        </h3>
                        <p className="text-foreground text-base font-light">{genre}</p>
                    </div>

                    <Badge variant={btnVariant}>{state}</Badge>
                </div>
            </div>

            <div className="mt-4 mb-2 px-4">
                <Progress value={progress} />
            </div>

            <div className="m-4 px-2.5 flex justify-between items-center bg-[#174763] rounded-full">
                <p className="text-xs text-foreground lg:text-md">{dateLabel}</p>
                <time className="text-xs text-foreground lg:text-md">{date}</time>
            </div>
        </Card>
    );
}
