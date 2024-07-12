import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/v2/components/ui/card";
import { Button } from "@/v2/components/ui/button";
import { IconButton } from "@/v2/components/ui/icon-button";
import { AvatarRoot, AvatarImage, AvatarFallback } from "@/v2/components/ui/avatar";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import { fetchOfferList } from "@/fetchers/offer.fetcher";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";

const EmptyInvestmentsEnhanced = () => {
    const { cdn } = useEnvironmentContext();
    const query = { limit: 1, isSettled: false };
    const {
        isLoading,
        data: { offers = [] } = {},
        isError,
    } = useQuery({
        queryKey: ["offerList", query],
        queryFn: () => fetchOfferList(query),
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
    return (
        <Card
            variant="none"
            border="none"
            className="relative h-dvh md:h-full w-full flex flex-col items-center justify-center gap-2 md:gap-4 grow bg-empty-investment-top-pattern bg-cover bg-center bg-no-repeat"
        >
            <CardTitle className="text-md md:text-4xl text-center">No investments found</CardTitle>
            <CardDescription className="max-w-2xl text-2xl md:text-11xl font-semibold text-center">
                Explore elite investment avenues curated for the astute investor
            </CardDescription>
            <div className="my-5 md:my-8 flex items-center gap-2.5 md:gap-4">
                <Button className="w-full collap:w-auto" variant="outline">
                    OTC market
                </Button>
                <Button className="w-full collap:w-auto">Opportunities</Button>
            </div>
            {offers.map((offer) => (
                <Link
                    key={offer.slug}
                    href={`/app/offers/${offer.slug}`}
                    className="p-3.5 flex flex-col items-center gap-4 bg-navy-800 rounded collap:flex-row collap:gap-12 group/button"
                >
                    <AvatarRoot variant="block" className="bg-black size-[72px]">
                        <AvatarImage src={`${cdn}/research/${offer.slug}/icon.jpg`} />
                        <AvatarFallback>CN</AvatarFallback>
                    </AvatarRoot>
                    <div className="text-center collap:text-start">
                        <h4 className="text-3xl font-medium text-foreground">{offer.ticker}</h4>
                        <p className="text-md font-light text-foreground">{offer.name}</p>
                    </div>
                    <p className="max-w-[20ch] text-2xl text-foreground italic text-center collap:text-left">
                        Latest exclusive investment opportunity
                    </p>
                    <IconButton
                        name="Upgrade"
                        shape="circle"
                        variant="accent"
                        size="8"
                        icon={ArrowIcon}
                        className="md:mr-6"
                    />
                </Link>
            ))}
        </Card>
    );
};

export default EmptyInvestmentsEnhanced;
