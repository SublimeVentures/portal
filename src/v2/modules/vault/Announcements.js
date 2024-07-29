import { useQuery } from "@tanstack/react-query";
import { PartnershipCard } from "@/v2/components/App/Vault";
import { cn } from "@/lib/cn";
import { fetchNews } from "@/v2/fetchers/news.fetcher";
import { Card, CardTitle, CardDescription } from "@/v2/components/ui/card";
import { fetchOfferList } from "@/fetchers/offer.fetcher";

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
    <h3 className={cn("text-nowrap text-md md:text-2xl text-foreground md:hidden 3xl:block md:mb-4", className)}>
        {children}
    </h3>
);

const Announcements = ({ className }) => {
    const { data = {}, isLoading } = useNewsQuery();
    const { data: { offers = [] } = {} } = useOffersQuery({ limit: 1 }, { disabled: !data });
    if (!data) {
        return (
            <div className={cn("flex flex-col", className)}>
                <Title>Offer</Title>
                {offers.map((offer) => (
                    <Card className="grow" key={offer.slug}>
                        <CardTitle>{offer.ticker}</CardTitle>
                        <CardDescription>{offer.name}</CardDescription>
                    </Card>
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
