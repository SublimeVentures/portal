import LayoutApp from '@/components/Layout/LayoutApp';
import {OfferDetailsParams} from "@/components/App/Offer/OfferDetailsParams";
import {OfferDetailsInvest} from "@/components/App/Offer/OfferDetailsInvest";
import dynamic from "next/dynamic";
import {queryClient} from "@/lib/web3/queryCache";
import {fetchOfferAllocation, fetchOfferDetails} from "@/fetchers/offer";
import {dehydrate, useQuery} from "@tanstack/react-query";
import {useRouter} from "next/router";

const OfferDetailsFlipbook = dynamic(() => import('@/components/App/Offer/OfferDetailsFlipbook'), {ssr: false,})
import {getToken} from "next-auth/jwt"
import {useSession} from "next-auth/react";
import {fetchPayableCurrency} from "@/fetchers/currency";
import {ACL as ACLs} from "@/lib/acl";
import {fetchInvestment} from "@/fetchers/investment";


export const AppOfferDetails = () => {
    const router = useRouter()
    const {slug} = router.query
    const {data: session, status} = useSession()
    const ACL = session?.user?.ACL
    const address = session?.user?.address
    const ADDRESS = ACL !== ACLs.PartnerInjected ? 0 : address //todo: fix

    const {isSuccess: currenciesState, data: currencies} = useQuery({
            queryKey: ["payableCurrencies"],
            queryFn: fetchPayableCurrency,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 24 * 60 * 1000,
            staleTime: 20 * 60 * 1000,
        }
    );

    const {isSuccess: offerDetailsState, data: offer} = useQuery({
            queryKey: ["offerDetails", {slug, ACL, ADDRESS}],
            queryFn: () => fetchOfferDetails(slug, ACL, ADDRESS),
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 30 * 60 * 1000,
            staleTime: 15 * 60 * 1000,
            enabled: !!ACL
        }
    );

    const {data: allocation, refetch: refetchAllocation} = useQuery({
            queryKey: ["offerAllocation", offer?.id],
            queryFn: () => fetchOfferAllocation(offer?.id),
            refetchOnMount: true,
            refetchOnWindowFocus: true,
            enabled:!!offer,
            // refetchInterval: 15000
        }
    );

    //todo: extract
    const {data: userAllocation, refetch: refetchUserAllocation} = useQuery({
            queryKey: ["userAllocation", offer?.id, address],
            queryFn: () => fetchInvestment(offer?.id),
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            enabled:!!offer,
        }
    );

    const paramsInvest = {
        offer,
        currencies,
        refetchUserAllocation,
        allocation
    }

    const paramsParams = {
        offer,
        currencies,
        refetchUserAllocation,
        allocation
    }

    const paramsFlipbook = {
        offer
    }


    if (status !== "authenticated" || !currenciesState || !offerDetailsState ) return <>Loading</>
    return (
        <div className="grid grid-cols-12  gap-y-5 mobile:gap-y-10 mobile:gap-10">
            <div className="flex flex-row col-span-12 xl:col-span-8 rounded-xl bg">
                <OfferDetailsInvest offer={offer} currencies={currencies} refetchAllocation={refetchAllocation} refetchUserAllocation={refetchUserAllocation} allocation={allocation} />
            </div>
            <div
                className="flex flex-col col-span-12 gap-5 mobile:gap-10 sinvest:flex-row xl:col-span-4 xl:!flex-col xl:gap-0">
                <OfferDetailsParams offer={offer} allocation={allocation} userAllocation={userAllocation}/>
            </div>

            <div className="flex flex-col col-span-12 ">
                <OfferDetailsFlipbook offer={offer}/>
            </div>
        </div>

    )
}


export const getServerSideProps = async ({params, req}) => {
    const {slug} = params
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        encryption: true
    })
    const ACL = token?.user?.ACL
    const ADDRESS = ACL !== ACLs.PartnerInjected ? 0 : token?.user?.address

    await queryClient.prefetchQuery({
        queryKey: ["offerDetails", {slug, ACL, ADDRESS}],
        queryFn: () => fetchOfferDetails(slug, ACL, ADDRESS),
        cacheTime: 30 * 60 * 1000,
        staleTime: 15 * 60 * 1000,
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

export default AppOfferDetails
