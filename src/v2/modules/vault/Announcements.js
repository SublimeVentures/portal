import Image from "next/image";
import Link from "next/link";
import { PartnershipCard } from "@/v2/components/App/Vault";
import { cn } from "@/lib/cn";
import { Card } from "@/v2/components/ui/card";
import { routes } from "@/v2/routes";
import { IconButton } from "@/v2/components/ui/icon-button";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import Title from "@/v2/modules/vault/components/Dashboard/Title";
import useImage from "@/v2/hooks/useImage";
import useNewsQuery from "@/v2/hooks/useNewsQuery";
import useOffersQuery from "@/v2/hooks/useOffersQuery";

export const OFFERS_QUERY = {
    limit: 1,
};

const Announcements = ({ className }) => {
    const { data = {}, isLoading } = useNewsQuery();
    const { data: offers = {} } = useOffersQuery(OFFERS_QUERY, { disabled: !data });
    const { getResearchIconSrc, getResearchBgSrc } = useImage();
    if (!data) {
        return (
            <div className={cn("flex flex-col", className)}>
                <Title className="mb-5 md:mb-2 md:hidden 3xl:flex">Offer</Title>
                {offers?.rows?.map((offer) => (
                    <Link href={`${routes.Opportunities}/${offer.slug}`} key={offer.slug} className="grow flex">
                        <Card className="grow p-6 group/button">
                            <div className="bg-white/5 backdrop-blur-2xl rounded relative flex 3xl:block h-full">
                                <div className="relative h-24 flex gap-2 3xl:mb-12 3xl:h-2/5 m-2 3xl:m-0">
                                    <Image
                                        src={getResearchIconSrc(offer.slug)}
                                        className="rounded 3xl:absolute 3xl:left-4 3xl:-bottom-12 3xl:shadow-lg"
                                        alt={`Avatar for ${offer.name} offer`}
                                        width={90}
                                        height={90}
                                    />
                                    <Image
                                        src={getResearchBgSrc(offer.slug)}
                                        alt={`Background image for ${offer.name} offer`}
                                        className="hidden 3xl:block object-cover rounded-t aspect-[341/138]"
                                        width={1000}
                                        height={300}
                                    />
                                </div>
                                <div className="flex justify-between items-center 3xl:px-4 3xl:py-0 3xl:items-start">
                                    <div>
                                        <h3
                                            data-ticker={`$${offer.ticker}`}
                                            className="relative text-foreground text-base 3xl:text-3xl font-medium after:content-[attr(data-ticker)] after:text-white after:text-[10px] 3xl:after:text-sm after:font-normal after:p-4 after:absolute after:-bottom-1"
                                        >
                                            {offer.name}
                                        </h3>
                                        <p className="text-foreground text-xs 3xl:text-lg font-light">{offer.genre}</p>
                                    </div>
                                </div>
                                <IconButton
                                    name="Upgrade"
                                    shape="circle"
                                    variant="accent"
                                    icon={ArrowIcon}
                                    className="right-5 bottom-5 3xl:right-10 3xl:bottom-10 absolute"
                                />
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        );
    }
    return (
        <div className={cn("flex flex-col", className)}>
            <Title className="mb-5 md:mb-2">Community Partnership</Title>
            <PartnershipCard {...data} isLoading={isLoading} />
        </div>
    );
};

export default Announcements;
