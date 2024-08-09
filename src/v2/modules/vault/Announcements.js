import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { PartnershipCard } from "@/v2/components/App/Vault";
import { cn } from "@/lib/cn";
import { fetchNews } from "@/v2/fetchers/news.fetcher";
import { Card } from "@/v2/components/ui/card";
import { fetchOfferList } from "@/fetchers/offer.fetcher";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { routes } from "@/v2/routes";
import { IconButton } from "@/v2/components/ui/icon-button";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";

const useNewsQuery = () =>
    useQuery({
        queryKey: ["news"],
        queryFn: fetchNews,
    });

const useOffersQuery = (query, options = {}) =>
    useQuery({
        queryKey: ["offerList", query],
        queryFn: () => fetchOfferList(query),
        ...options,
    });

const Title = ({ children, className }) => (
    <h3
        className={cn(
            "h-10 md:h-auto text-nowrap text-md md:text-2xl text-foreground md:hidden 3xl:block md:mb-4",
            className,
        )}
    >
        {children}
    </h3>
);

const Announcements = ({ className }) => {
    const { data = {}, isLoading } = useNewsQuery();
    const { data: { offers = [] } = {} } = useOffersQuery({ limit: 1 }, { disabled: !data });
    const { cdn } = useEnvironmentContext();
    if (!data) {
        return (
            <div className={cn("flex flex-col", className)}>
                <Title className="md:h-9">Offer</Title>
                {offers.map((offer) => (
                    <Link href={`${routes.Opportunities}/${offer.slug}`} key={offer.slug} className="grow flex">
                        <Card className="grow p-6 group/button">
                            <div className="bg-white/5 backdrop-blur-2xl rounded h-full relative 3xl:pb-10 flex 3xl:block">
                                <div className="relative h-24 flex gap-2 3xl:mb-12 3xl:h-32 m-2 3xl:m-0">
                                    <Image
                                        src={`${cdn}/research/${offer.slug}/icon.jpg`}
                                        className="rounded 3xl:absolute 3xl:left-4 3xl:-bottom-12 3xl:shadow-lg"
                                        alt={`Avatar for ${offer.name} offer`}
                                        width={90}
                                        height={90}
                                    />
                                    <Image
                                        src={`${cdn}/research/${offer.slug}/bg.jpg`}
                                        alt={`Background image for ${offer.name} offer`}
                                        className="hidden 3xl:block object-cover rounded-t"
                                        width={1000}
                                        height={300}
                                    />
                                </div>
                                <div className="flex justify-between items-center 3xl:px-4 3xl:py-0 3xl:items-start">
                                    <div>
                                        <h3
                                            data-ticker={`$${offer.ticker}`}
                                            className="relative text-foreground text-[16px] 3xl:text-6xl font-medium after:content-[attr(data-ticker)] after:text-white after:text-[10px] 3xl:after:text-sm after:font-normal after:p-4 after:absolute after:-bottom-1"
                                        >
                                            {offer.name}
                                        </h3>
                                        <p className="text-foreground text-[12px] 3xl:text-lg font-light">
                                            {offer.genre}
                                        </p>
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
            <Title>Community Partnership</Title>
            <PartnershipCard {...data} isLoading={isLoading} />
        </div>
    );
};

export default Announcements;
