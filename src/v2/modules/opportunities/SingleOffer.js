import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { phases } from "@/lib/phases";
import { fetchOfferProgress } from "@/fetchers/offer.fetcher";
import { Card } from "@/v2/components/ui/card";
import { Badge } from "@/v2/components/ui/badge";
import { Progress } from "@/v2/components/ui/progress";
import { routes } from "@/v2/routes";

import SingleOfferLoader from "./SingleOfferLoader";
import { OfferStatus, OfferDateText, BadgeVariants, getStatus, formatDate } from "./helpers";

export default function SingleOffer({ offer }) {
    const { cdn } = useEnvironmentContext();
    const { offerId, name, slug, genre, ticker, d_open: starts, d_close: ends } = offer;

    const { phaseCurrent } = phases(offer);
    const state = phaseCurrent?.phaseName;
    const status = getStatus(phaseCurrent);

    const formatKey = status === OfferStatus.CLOSED ? 'LL' : 'lll';
    const timestamp = status === OfferStatus.PENDING ? starts : ends;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["offerProgress", { offerId }],
        queryFn: () => fetchOfferProgress(offerId),
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        enabled: status === OfferStatus.IN_PROGRESS,
    });

    const progress = data?.progress ?? 0;
    
    return (
        <article className="min-h-[305px] h-full lg:min-h-[355px]">
            <Link href={`${routes.Opportunities}/${slug}`}>
                {(isLoading && !isError)
                    ? <SingleOfferLoader /> 
                    : (
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
                                            className="relative text-foreground text-6xl font-medium after:content-[attr(data-ticker)] after:text-white after:text-sm after:font-regular after:p-4 after:absolute after:-bottom-1"
                                        >
                                            {name}
                                        </h3>
                                        <p className="text-foreground text-lg font-light">{genre}</p>
                                    </div>

                                    <Badge variant={BadgeVariants[status]}>{state}</Badge>
                                </div>
                            </div>

                            <div className="mt-4 mb-2 px-4">
                                <Progress value={status === OfferStatus.CLOSED ? 100 : progress} />
                            </div>

                            <div className="m-4 px-2.5 flex justify-between items-center bg-[#174763] rounded-full">
                                <p className="text-xs text-foreground lg:text-md">{OfferDateText[status]}</p>
                                <time className="text-xs text-foreground lg:text-md">{formatDate(timestamp, formatKey)}</time>
                            </div>
                        </Card>
                    )
                }
            </Link>
        </article>
    )
};
