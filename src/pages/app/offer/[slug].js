import LayoutApp from '@/components/Layout/LayoutApp';
import OfferDetailsParams from "@/components/App/Offer/OfferDetailsParams";
import OfferDetailsInvest from "@/components/App/Offer/OfferDetailsInvest";
import dynamic from "next/dynamic";
import {queryClient} from "@/lib/web3/queryCache";
import {fetchOfferDetails} from "@/fetchers/offer";
import {dehydrate, useQuery} from "@tanstack/react-query";
import {useRouter} from "next/router";
const OfferDetailsFlipbook = dynamic(() => import('@/components/App/Offer/OfferDetailsFlipbook'), {ssr: false,})


export default function AppOfferDetails() {
    const router = useRouter()
    const { slug } = router.query
    const { isLoading, data: investment, isError } = useQuery({
            queryKey: ["offerDetails", slug],
            queryFn: () => fetchOfferDetails(slug),
            refetchOnMount: true,
            refetchOnWindowFocus: true,
        }
    );
    return (
        <div className="grid grid-cols-12  gap-y-5 mobile:gap-y-10 mobile:gap-10">
            <div className="flex flex-row col-span-12 xl:col-span-8 rounded-xl bg">
                <OfferDetailsInvest offer={investment}/>
            </div>
            <div
                className="flex flex-col col-span-12 gap-5 mobile:gap-10 sinvest:flex-row xl:col-span-4 xl:!flex-col xl:gap-0">
                <OfferDetailsParams offer={investment}/>
            </div>

            <div className="flex flex-col col-span-12 ">
                <OfferDetailsFlipbook offer={investment}/>
            </div>
        </div>

    )
}


export const getServerSideProps = async(context) => {
    const { slug } = context.params

    await queryClient.prefetchQuery({
        queryKey: ["offerDetails", slug],
        queryFn: () => fetchOfferDetails(slug),
    })
    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        }
    }
}


AppOfferDetails.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};
