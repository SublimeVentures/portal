import { useRef } from "react";

import SingleOffer from "./SingleOffer";
import SingleOfferLoader from "./SingleOfferLoader";
import { tenantIndex } from "@/lib/utils";
import { TENANT } from "@/lib/tenantHelper";
import { shortCurrencyFormatterWithSuffix } from "@/v2/lib/currency";
import { useIntersectionObserver } from "@/v2/hooks";
import { Metadata } from "@/v2/components/Layout";
import {
    InvestedStatisticCard,
    PartnersStatisticCard,
    RaisedStatisticCard,
} from "@/v2/components/App/Vault/StatisticsCard";
import Title from "@/v2/modules/opportunities/Title";

export default function Opportunities({ offers, stats, infiniteLoaderOpts }) {
    const { partners = 0, vc: investments = 0, funded: rawFunded = 0 } = stats;
    const { isFetchingNextPage, hasNextPage, fetchNextPage } = infiniteLoaderOpts;

    const ref = useRef();

    useIntersectionObserver(ref, (isIntersecting) => {
        if (isIntersecting && !isFetchingNextPage && hasNextPage) fetchNextPage();
    });

    return (
        <>
            <Metadata title="Opportunities" />
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center lg:gap-4">
                <div className="mb-4 3xl:mb-0">
                    <Title subtitle="We bring new industry giants to our community" count={offers.length + 1}>
                        Funded Projects
                    </Title>
                </div>
                <div className="flex flex-wrap gap-4 grow md:flex md:grow-0">
                    <InvestedStatisticCard value={investments} className="sm:flex-1 lg:flex-none" />
                    {tenantIndex === TENANT.basedVC ? (
                        <PartnersStatisticCard value={partners} className="sm:flex-1 lg:flex-none" />
                    ) : null}
                    <RaisedStatisticCard value={shortCurrencyFormatterWithSuffix(rawFunded)} className="flex-1" />
                </div>
            </div>
            <div className="grow lg:overflow-y-auto lg:-mx-5 lg:px-5 lg:pr-3 lg:-mt-4 sm:pt-4 lg:pb-4 3xl:-mx-8 3xl:pl-8 3xl:pr-6 3xl:-mt-2 3xl:pt-2 3xl:pb-4">
                <ul className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-2 sm:gap-4 lg:gap-y-6 lg:gap-x-8 2xl:grid-cols-cards">
                    {offers.map((offer, idx) => {
                        if (idx + 1 === offers.length && hasNextPage) {
                            return (
                                <li ref={ref} key={offer?.offerId} className="text-red-500">
                                    <SingleOffer offer={offer} />
                                </li>
                            );
                        }

                        return (
                            <li key={offer?.offerId}>
                                <SingleOffer offer={offer} />
                            </li>
                        );
                    })}
                </ul>

                {isFetchingNextPage && (
                    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-8 2xl:grid-cols-cards">
                        {Array.from({ length: 6 }, (_, index) => (
                            <li key={index} className="min-h-[305px] h-full lg:min-h-[355px]">
                                <SingleOfferLoader />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}
