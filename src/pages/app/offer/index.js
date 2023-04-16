import LayoutApp from '@/components/Layout/LayoutApp';
import OfferItem from "@/components/App/Offer/OfferItem";
import {queryClient} from "@/lib/web3/queryCache";
import {dehydrate, useQuery} from "@tanstack/react-query";
import {fetchOfferList} from "@/fetchers/offer";
import {useSession} from "next-auth/react";
import {getToken} from "next-auth/jwt";

export default function AppOffer() {
    const { data: session, status } = useSession()
    const ACL = session?.user?.ACL
    const ADDRESS = (ACL !==2 && ACL !== undefined) ? 0 : session?.user?.address

    const { isLoading, data: investments, isError } = useQuery({
            queryKey: ["offerList", {ACL, ADDRESS}],
            queryFn: () => fetchOfferList(ACL),
            cacheTime: 30 * 60 * 1000,
            staleTime: 15 * 60 * 1000,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: !!ACL
        }
    );

    if(status !== "authenticated") return <>Loading</>
    return (
        <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
            {!!investments && investments.map(el =>
                    <OfferItem offer={el} key={el.slug}/>
            )}
        </div>

    )
}

export const getServerSideProps = async({req}) => {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        encryption: true
    })
    const ACL = token?.user?.ACL
    const ADDRESS = ACL !==2 ? 0 : token?.user?.address

    await queryClient.prefetchQuery({
        queryKey: ["offerList", {ACL, ADDRESS}],
        queryFn: ()=>fetchOfferList(ACL, ADDRESS),
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
