import Image from "next/image";
import { Card } from "@/v2/components/ui/card";
import { Badge } from "@/v2/components/ui/badge";
import { Progress } from "@/v2/components/ui/progress";
import useImage from "@/v2/hooks/useImage";

export default function SingleOfferCard({ name, slug, genre, ticker, state, btnVariant, progress, dateLabel, date }) {
    const { getResearchIconSrc, getResearchBgSrc } = useImage();

    return (
        <Card variant="dark" className="h-full flex flex-col lg:p-3">
            <div className="grow">
                <div className="relative h-22 flex gap-2 lg:mb-12 lg:h-32">
                    <Image
                        src={getResearchIconSrc(slug)}
                        className="rounded lg:absolute lg:left-4 lg:-bottom-12 lg:shadow-lg select-none pointer-events-none bg-primary-800 aspect-square"
                        alt={`Avatar for ${name} offer`}
                        width={88}
                        height={88}
                        priority
                    />
                    <Image
                        src={getResearchBgSrc(slug)}
                        alt={`Background image for ${name} offer`}
                        className="object-cover rounded select-none pointer-events-none bg-primary-800 w-full"
                        width={500}
                        height={130}
                        priority
                        sizes="(max-width: 768px) 75vw, (max-width: 1023px) 33vw, (max-width: 1920px) 25vw, 20vw"
                    />
                </div>

                <div className="w-full py-4 flex justify-between items-center lg:px-4 lg:py-0 lg:items-start">
                    <div>
                        <h3
                            data-ticker={`$${ticker}`}
                            className="relative text-white text-2xl font-medium leading-none mb-2 after:content-[attr(data-ticker)] after:text-white after:text-2xs after:font-normal after:px-3 after:leading-none after:align-top md:after:align-middle font-heading"
                        >
                            {name}
                        </h3>
                        <p className="text-white text-base font-light">{genre}</p>
                    </div>

                    <Badge variant={btnVariant}>{state}</Badge>
                </div>
            </div>

            <div className="mt-4 mb-2 px-4">
                <Progress value={progress} aria-label={`${name} fundraising progress`} />
            </div>

            <div className="m-4 px-2.5 lg:px-4 flex justify-between items-center bg-primary-600 rounded-xl text-xs font-light text-white lg:text-sm leading-5 lg:leading-7">
                <p>{dateLabel}</p>
                <time>{date}</time>
            </div>
        </Card>
    );
}
