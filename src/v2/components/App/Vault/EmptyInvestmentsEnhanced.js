import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/v2/components/ui/card";
import { Button } from "@/v2/components/ui/button";
import { IconButton } from "@/v2/components/ui/icon-button";
import { AvatarRoot, AvatarImage, AvatarFallback } from "@/v2/components/ui/avatar";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import { fetchOfferList } from "@/fetchers/offer.fetcher";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { offersKeys } from "@/v2/constants";

const EmptyInvestmentsEnhanced = () => {
    const { cdn } = useEnvironmentContext();
    const query = { limit: 1, isSettled: false };

    const {
        isLoading,
        data: { offers = [] } = {},
        isError,
    } = useQuery({
        queryKey: offersKeys.queryOffersVc(query),
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
            <CardTitle className="text-sm md:text-base text-center font-normal">No investments found</CardTitle>
            <CardDescription className="max-w-2xl text-lg md:text-3xl font-semibold text-center">
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
                    className="p-3.5 flex flex-row md:flex-col w-full md:w-auto items-center gap-4 bg-primary-900 rounded collap:flex-row collap:gap-12 group/button"
                >
                    <AvatarRoot variant="block" className="bg-black size-[72px]">
                        <AvatarImage src={`${cdn}/research/${offer.slug}/icon.jpg`} />
                        <AvatarFallback>CN</AvatarFallback>
                    </AvatarRoot>
                    <div className="text-left grow">
                        <h4 className="text-lg font-medium text-foreground">{offer.ticker}</h4>
                        <p className="text-sm font-light text-foreground">{offer.name}</p>
                    </div>
                    <p className="max-w-[20ch] text-base text-foreground italic text-center md:text-left hidden md:block">
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
