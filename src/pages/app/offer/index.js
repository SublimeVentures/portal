import LayoutApp from '@/components/Layout/LayoutApp';
import OfferItem from "@/components/App/Offer/OfferItem";
import {queryClient} from "@/lib/web3/queryCache";
import {dehydrate, useQuery} from "@tanstack/react-query";
import {fetchOfferList} from "@/fetchers/offer";

export default function AppOffer() {
    const { isLoading, data: investments, isError } = useQuery({
            queryKey: ["offerList"],
            queryFn: fetchOfferList,
            cacheTime: 30 * 60 * 1000,
            staleTime: 15 * 60 * 1000,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        }
    );

    return (
        <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
            {!!investments && investments.map(el =>
                    <OfferItem offer={el} key={el.slug}/>
            )}
        </div>

    )
}


export const getServerSideProps = async() => {
    await queryClient.prefetchQuery({
        queryKey: ["offerList"],
        queryFn: fetchOfferList,
        cacheTime: 30 * 60 * 1000,
        staleTime: 15 * 60 * 1000
    })
    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        }
    }
}


AppOffer.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};
