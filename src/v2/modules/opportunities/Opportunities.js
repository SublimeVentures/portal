import { useRef } from "react";

import SingleOffer from "./SingleOffer";
import SingleOfferLoader from "./SingleOfferLoader";
import { tenantIndex } from "@/lib/utils";
import { TENANT } from "@/lib/tenantHelper";
import { shortCurrencyFormatterWithSuffix } from "@/v2/lib/currency";
import { useIntersectionObserver } from "@/v2/hooks";
import {
    InvestedStatisticCard,
    PartnersStatisticCard,
    RaisedStatisticCard,
} from "@/v2/components/App/Vault/StatisticsCard";
import Title from "@/v2/modules/opportunities/Title";

export default function Opportunities({ offers, stats, infiniteLoaderOpts, count }) {
    const { partners = 0, funded: rawFunded = 0 } = stats;
    const { isFetchingNextPage, hasNextPage, fetchNextPage } = infiniteLoaderOpts;

    const ref = useRef();

    useIntersectionObserver(ref, (isIntersecting) => {
        if (isIntersecting && !isFetchingNextPage && hasNextPage) fetchNextPage();
    });

    return (
        <>
            <div className="flex flex-col 2xl:flex-row 2xl:justify-between 2xl:items-center 2xl:gap-8">
                <div className="mb-4 3xl:mb-0 w-full 2xl:w-5/12 3xl:w-1/2">
                    <Title subtitle="We bring new industry giants to our community" count={count}>
                        Funded Projects
                    </Title>
                </div>
                <div className="flex flex-wrap 2xl:flex-nowrap gap-4 w-full 2xl:w-7/12 3xl:w-1/2">
                    <InvestedStatisticCard value={count} className="sm:flex-1 grow" />
                    {tenantIndex === TENANT.basedVC ? (
                        <PartnersStatisticCard value={partners} className="sm:flex-1 grow" />
                    ) : null}
                    <RaisedStatisticCard value={shortCurrencyFormatterWithSuffix(rawFunded)} className="flex-1 grow" />
                </div>
            </div>
            <div className="grow lg:overflow-y-auto lg:-mx-5 lg:px-5 lg:pr-3 lg:-mt-4 sm:pt-4 lg:pb-4 3xl:-mx-8 3xl:pl-8 3xl:pr-6 3xl:-mt-2 3xl:pt-2 3xl:pb-4">
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-y-6 lg:gap-x-8 2xl:grid-cols-cards">
                    {offers.map((offer, idx) => {
                        if (idx + 1 === offers.length && hasNextPage) {
                            return (
                                <li ref={ref} key={offer?.offerId} className="text-error-500">
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
                    {isFetchingNextPage &&
                        Array.from({ length: 6 }, (_, index) => (
                            <li key={index}>
                                <SingleOfferLoader />
                            </li>
                        ))}
                </ul>
            </div>
        </>
    );
}
