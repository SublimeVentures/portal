import LayoutApp from '@/components/Layout/LayoutApp';
import {OfferDetailsParams} from "@/components/App/Offer/OfferDetailsParams";
import dynamic from "next/dynamic";
import {ACLs, verifyID} from "@/lib/authHelpers";
import {fetchOfferAllocation, fetchOfferDetails} from "@/fetchers/offer.fetcher";
import {useQuery} from "@tanstack/react-query";
import {useRouter} from "next/router";
const OfferDetailsDetails = dynamic(() => import('@/components/App/Offer/OfferDetailsAbout'), {ssr: false,})
import {fetchUserInvestment} from "@/fetchers/vault.fetcher";
import Loader from "@/components/App/Loader";
import Empty from "@/components/App/Empty";
import {NextSeo} from "next-seo";
import OfferDetailsTopBar from "@/components/App/Offer/OfferDetailsTopBar";
import {phases} from "@/lib/phases";
import {useState, useEffect} from "react";
import OfferDetailsInvestPhases from "@/components/App/Offer/OfferDetailsInvestPhases";
import OfferDetailsInvestClosed from "@/components/App/Offer/OfferDetailsInvestClosed";
import routes from "@/routes";
 import {getCopy} from "@/lib/seoConfig";
import {isBased} from "@/lib/utils";

export const AppOfferDetails = ({account}) => {
    const router = useRouter()
    const {slug} = router.query
    const {ACL, address} = account
    const aclCache = ACL !== ACLs.PartnerInjected ? ACL : address
    let [activePhase, setActivePhase] = useState(0)
    let [isLastPhase, setIsLastPhase] = useState(false)
    let [currentPhase, setCurrentPhase] = useState(false)
    let [nextPhase, setNextPhase] = useState(false)
    let [isClosed, setIsClosed] = useState(false)

    const {isSuccess: offerDetailsState, data: offerData} = useQuery({
            queryKey: ["offerDetails", {slug, aclCache}],
            queryFn: () => fetchOfferDetails(slug),
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 30 * 60 * 1000,
            staleTime: 15 * 60 * 1000,
        }
    );


    const {data: allocation, refetch: refetchAllocation} = useQuery({
            queryKey: ["offerAllocation", offerData?.offer?.id],
            queryFn: () => fetchOfferAllocation(offerData?.offer?.id),
            refetchOnMount: true,
            refetchOnWindowFocus: true,
            enabled: !!offerData?.offer?.id,
            refetchInterval: isClosed ? false : 15000
        }
    );

    const {data: userAllocation, refetch: refetchUserAllocation, isSuccess: isSuccessUserAllocation} = useQuery({
            queryKey: ["userAllocation", offerData?.offer?.id, address],
            queryFn: () => fetchUserInvestment(offerData?.offer?.id),
            refetchOnMount: false,
            refetchOnWindowFocus: !isClosed,
            enabled: !!offerData?.offer?.id,
        }
    );



    const feedPhases = () => {
        if(!offerData?.offer) return
        const {active, isLast, currentPhase, nextPhase, isClosed} = phases(ACL, offerData.offer)
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
        isLastPhase,
        refreshInvestmentPhase: feedPhases,
    }

    const paramsInvest = {
        offer: offerData?.offer,
        currencies: offerData?.currencies,
        refetchUserAllocation,
        refetchAllocation,
        userAllocation,
        allocation,
        nextPhase,
        currentPhase,
        activePhase,
        isLastPhase,
        account,
        isClosed,
    }

    const paramsParams = {
        offer: offerData?.offer,
        allocation,
        userAllocation,
        isLastPhase
    }

    const renderPage = () => {
        if (!offerDetailsState || !nextPhase) return <Loader/>
        if (!offerData.offer || Object.keys(offerData.offer).length === 0) return <Empty/>
        return (
            <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
                <OfferDetailsTopBar paramsBar={paramsBar}/>
                <div className={`${isBased ? "rounded-xl" : "cleanWrap"} bg flex flex-row col-span-12 lg:col-span-7 xl:col-span-8`}>
                    {!isClosed ? <OfferDetailsInvestPhases paramsInvestPhase={paramsInvest}  /> : <OfferDetailsInvestClosed paramsInvestClosed={paramsInvest}/>}
                </div>
                <div
                    className="flex flex-col col-span-12 lg:col-span-5 xl:col-span-4">
                    <OfferDetailsParams paramsParams={paramsParams}/>
                </div>

                <div className="flex flex-col col-span-12">
                    <OfferDetailsDetails offer={offerData.offer}/>
                </div>
            </div>
        )
    }

    useEffect(() => {
        if(offerData?.notExist) {
            router.push(routes.Opportunities)
        }
        feedPhases()
    }, [offerData])

    const pageTitle = `${!offerDetailsState ?  "Loading" : offerData?.offer?.name}  - Invest - ${getCopy("NAME")}`
    return (
        <>
            <NextSeo title={pageTitle}/>
            {renderPage()}
        </>
    )
}


export const getServerSideProps = async ({res}) => {
    const account = await verifyID(res.req)
    const redirect = res.req.originalUrl

    if(account.exists){
        return {
            redirect: {
                permanent: true,
                destination: `/app/auth?callbackUrl=${redirect}`
            }
        }
    }

    if(!account.auth){
        return {
            redirect: {
                permanent: true,
                destination: `/login?callbackUrl=${redirect}`
            }
        }
    }

    return {
        props: {
            account: account.user
        }
    }
}

AppOfferDetails.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};

export default AppOfferDetails
