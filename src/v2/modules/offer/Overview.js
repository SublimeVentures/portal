import Image from "next/image";
import Link from "next/link";
import { useOfferDetailsQuery } from "@/v2/modules/offer/queries";
import useImage from "@/v2/hooks/useImage";
import useResearchAssets from "@/v2/hooks/useResearchAssets";
import { Button } from "@/v2/components/ui/button";
import LanguageIcon from "@/v2/assets/svg/language.svg";
import TwitterIcon from "@/v2/assets/svg/twitter.svg";
import DiscordIcon from "@/v2/assets/svg/discord.svg";
import DownloadIcon from "@/v2/assets/svg/download.svg";
import { Skeleton } from "@/v2/components/ui/skeleton";
import { Badge } from "@/v2/components/ui/badge";
import { useOfferStatus } from "@/v2/modules/opportunities/useSingleOfferLogic";
import { cn } from "@/lib/cn";

const SocialButton = ({ href, icon: Icon, ...props }) => (
    <Button variant="secondary" className="px-2" asChild>
        <Link href={href} target="_blank" {...props}>
            <Icon className="size-5 m-px" />
        </Link>
    </Button>
);

export default function Overview({ className }) {
    const { data: offer, isLoading } = useOfferDetailsQuery();
    const { getResearchIconSrc, getResearchBgSrc } = useImage();
    const { getResearchReportSrc } = useResearchAssets();

    const socials = [
        { href: offer.url_web, icon: LanguageIcon, type: "Website" },
        { href: offer.url_twitter, icon: TwitterIcon, type: "Twitter" },
        { href: offer.url_discord, icon: DiscordIcon, type: "Discord" },
    ].filter(({ href }) => href);

    const { state, variant } = useOfferStatus(offer);

    return (
        <div className={cn("p-6 rounded flex flex-col 3xl:flex-row gap-4 md:gap-6 bg-alt border-alt", className)}>
            <div className="flex gap-6 md:gap-8 flex-1 flex-wrap">
                <div className="flex grow gap-6 md:gap-8 items-center h-19 md:size-26">
                    <div className="relative size-19 md:size-26">
                        {isLoading ? (
                            <Skeleton className="rounded absolute inset-0 h-auto" />
                        ) : (
                            <Image
                                src={getResearchIconSrc(offer.slug)}
                                alt={offer.name}
                                fill={true}
                                className="rounded object-cover select-none pointer-events-none"
                            />
                        )}
                    </div>
                    <div className="grow select-none">
                        {isLoading ? (
                            <>
                                <Skeleton className="mb-0.5 md:mb-1.5 h-7 md:h-9" />
                                <Skeleton className="md:h-7 h-6 w-11/12 md:w-2/3" />
                            </>
                        ) : (
                            <>
                                <div className="flex mb-0.5 md:mb-1.5 gap-4">
                                    <h1 className="text-xl md:text-3xl font-medium">{offer.name}</h1>
                                    <Badge variant={variant}>{state}</Badge>
                                </div>
                                <p className="text-base md:text-lg font-light">{offer.genre}</p>
                            </>
                        )}
                    </div>
                </div>
                <div className="w-full md:order-3 text-sm md:text-base font-light empty:hidden select-none">
                    {isLoading ? (
                        <>
                            <Skeleton className="mb-0.5" />
                            <Skeleton className="mb-0.5" />
                            <Skeleton className="" />
                        </>
                    ) : (
                        <>{offer.description && <div dangerouslySetInnerHTML={{ __html: offer.description }}></div>}</>
                    )}
                </div>
                <div className="flex gap-2 items-start md:order-2">
                    {isLoading ? (
                        <>
                            <Skeleton className="size-9" />
                            <Skeleton className="size-9" />
                            <Skeleton className="size-9" />
                            <Skeleton className="size-9" />
                        </>
                    ) : (
                        <>
                            {socials.map(({ href, icon: Icon, type }) => (
                                <SocialButton key={href} href={href} icon={Icon} aria-label={`Go to ${type}`} />
                            ))}
                            <Button variant="outline" className="px-2" asChild>
                                <Link
                                    href={getResearchReportSrc(offer.slug)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    arial-label="Download research report"
                                >
                                    <DownloadIcon className="size-5" />
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <div className="relative md:flex-1 h-30 md:h-auto md:min-h-48">
                <Image
                    src={getResearchBgSrc(offer.slug)}
                    alt={offer.name}
                    fill={true}
                    className="rounded object-cover select-none pointer-events-none"
                />
                {isLoading ? (
                    <Skeleton className="rounded absolute inset-0 h-auto" />
                ) : (
                    <Image
                        src={getResearchBgSrc(offer.slug)}
                        alt={offer.name}
                        fill={true}
                        className="rounded object-cover select-none pointer-events-none"
                    />
                )}
            </div>
        </div>
    );
}
