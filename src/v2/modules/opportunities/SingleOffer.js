import Link from "next/link";

import { routes } from "@/v2/routes";
import SingleOfferLoader from "./SingleOfferLoader";
import SingleOfferCard from "./SingleOfferCard"
import useSingleOfferLogic from "./useSingleOfferLogic";

export default function SingleOffer({ offer }) {
    const { isLoading, isError, getSingleOfferProps } = useSingleOfferLogic(offer);
    
    return (
        <article className="min-h-[305px] h-full lg:min-h-[355px]">
            <Link href={`${routes.Opportunities}/${offer.slug}`}>
                {(isLoading && !isError) ? <SingleOfferLoader /> : <SingleOfferCard {...getSingleOfferProps()} />}
            </Link>
        </article>
    )
};
