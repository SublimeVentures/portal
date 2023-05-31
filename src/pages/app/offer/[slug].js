import LayoutApp from '@/components/Layout/LayoutApp';
import {OfferDetailsParams} from "@/components/App/Offer/OfferDetailsParams";
import dynamic from "next/dynamic";
import {queryClient} from "@/lib/web3/queryCache";
import {ACL as ACLs} from "@/lib/acl";
import {fetchOfferAllocation, fetchOfferDetails} from "@/fetchers/offer.fetcher";
import {dehydrate, useQuery} from "@tanstack/react-query";
import {useRouter} from "next/router";
const OfferDetailsFlipbook = dynamic(() => import('@/components/App/Offer/OfferDetailsAbout'), {ssr: false,})
import {getToken} from "next-auth/jwt"
import {useSession} from "next-auth/react";
import {fetchUserInvestment} from "@/fetchers/vault.fetcher";
import Loader from "@/components/App/Loader";
import Empty from "@/components/App/Empty";
import {NextSeo} from "next-seo";
import OfferDetailsTopBar from "@/components/App/Offer/OfferDetailsTopBar";
import {parsePhase} from "@/lib/phases/parsePhase";
import {useState, useEffect} from "react";
import OfferDetailsInvestPhases from "@/components/App/Offer/OfferDetailsInvestPhases";
import OfferDetailsInvestClosed from "@/components/App/Offer/OfferDetailsInvestClosed";


export const AppOfferDetails = () => {
    const {data: session, status} = useSession()
    const router = useRouter()
    const {slug} = router.query
    const ACL = session?.user?.ACL
    const address = session?.user?.address
    const aclCache = ACL !== ACLs.PartnerInjected ? ACL : address
    let [activePhase, setActivePhase] = useState(0)
    let [isLastPhase, setIsLastPhase] = useState(false)
    let [currentPhase, setCurrentPhase] = useState(false)
    let [nextPhase, setNextPhase] = useState(false)
    let [isClosed, setIsClosed] = useState(false)

    const {isSuccess: offerDetailsState, data: offerData} = useQuery({
            queryKey: ["offerDetails", {slug, aclCache}],
            queryFn: () => fetchOfferDetails(slug, ACL, address),
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 30 * 60 * 1000,
            staleTime: 15 * 60 * 1000,
            enabled: ACL >= 0
        }
    );

    const {data: allocation, refetch: refetchAllocation} = useQuery({
            queryKey: ["offerAllocation", offerData?.offer?.id],
            queryFn: () => fetchOfferAllocation(offerData?.offer?.id),
            refetchOnMount: true,
            refetchOnWindowFocus: true,
            enabled: !!offerData?.offer?.id,
            refetchInterval: 15000
        }
    );

    const {data: userAllocation, refetch: refetchUserAllocation} = useQuery({
            queryKey: ["userAllocation", offerData?.offer?.id, address],
            queryFn: () => fetchUserInvestment(offerData?.offer?.id),
            refetchOnMount: false,
            refetchOnWindowFocus: true,
            enabled: !!offerData?.offer?.id,
        }
    );


    const pageTitle = `${!offerDetailsState ?  "Loading" : offerData?.offer?.name}  - Invest - 3VC`

    const feedPhases = () => {
        if(!offerData?.offer) return
        const {active, isLast, currentPhase, nextPhase, isClosed} = parsePhase(session.user.ACL, offerData.offer)
        setActivePhase(active)
        setIsLastPhase(isLast)
        setCurrentPhase(currentPhase)
        setNextPhase(nextPhase)
        setIsClosed(isClosed)
    }

    const paramsBar = {
        offer: offerData?.offer,
        currentPhase,
        nextPhase,
        refreshInvestmentPhase: feedPhases,
    }

    const paramsInvest = {
        offer: offerData?.offer,
        currencies: offerData?.currencies,
        refetchUserAllocation,
        refetchAllocation,
        allocation,
        nextPhase,
        currentPhase,
        activePhase,
        isLastPhase,
        session,
        isClosed,
    }

    const paramsParams = {
        offer: offerData?.offer,
        allocation,
        userAllocation,
        isLastPhase
    }



    const renderPage = () => {
        if (status !== "authenticated" || !offerDetailsState || !nextPhase) return <Loader/>
        if (!offerData.offer || Object.keys(offerData.offer).length === 0) return <Empty/>
        return (
            <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
                <OfferDetailsTopBar paramsBar={paramsBar}/>
                <div className="rounded-xl bg flex flex-row col-span-12 lg:col-span-7 xl:col-span-8">
                    {!isClosed ? <OfferDetailsInvestPhases paramsInvestPhase={paramsInvest}  /> : <OfferDetailsInvestClosed paramsInvestClosed={paramsInvest}/>}
                </div>
                <div
                    className="flex flex-col col-span-12 lg:col-span-5 xl:col-span-4">
                    <OfferDetailsParams paramsParams={paramsParams}/>
                </div>

                <div className="flex flex-col col-span-12">
                    <OfferDetailsFlipbook offer={offerData.offer}/>
                </div>
            </div>
        )
    }

    useEffect(() => {
        feedPhases()
    }, [offerData])

    return (
        <>
            <NextSeo title={pageTitle}/>
            {renderPage()}
        </>
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
    const address = token?.user?.address

    const aclCache = ACL !== ACLs.PartnerInjected ? ACL : address

    await queryClient.prefetchQuery({
        queryKey: ["offerDetails", {slug, aclCache}],
        queryFn: () => fetchOfferDetails(slug, ACL, address),
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
