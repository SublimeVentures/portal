import LayoutApp from '@/components/Layout/LayoutApp';
import OfferItem from "@/components/App/Offer/OfferItem";
import {queryClient} from "@/lib/web3/queryCache";
import {dehydrate, useQuery} from "@tanstack/react-query";
import {fetchOfferList} from "@/fetchers/offer.fetcher";
import {useSession} from "next-auth/react";
import {getToken} from "next-auth/jwt";
import Loader from "@/components/App/Loader";
import {ACL as ACLs} from "@/lib/acl";
import Empty from "@/components/App/Empty";
import Head from "next/head";
import Stat from "@/components/Stat";
import IconNetwork from "@/assets/svg/Network.svg";
import IconStars from "@/assets/svg/Stars.svg";
import IconMoney from "@/assets/svg/Money.svg";

export default function AppOffer() {
    const { data: session, status } = useSession()
    const ACL = session?.user?.ACL
    const ADDRESS = (ACL !==ACLs.PartnerInjected && ACL !== undefined) ? ACL : session?.user?.address

    const { isLoading, data: response, isError } = useQuery({
            queryKey: ["offerList", {ACL, ADDRESS}],
            queryFn: () => fetchOfferList(ACL),
            cacheTime: 30 * 60 * 1000,
            staleTime: 15 * 60 * 1000,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            enabled: ACL >= 0
        }
    );

    const offerList = response?.offers
    const renderPage = () => {
        if(status !== "authenticated") return <Loader/>
        if(!offerList || offerList.length === 0) return  <Empty/>

        return (
                <div className="grid grid-cols-12 gap-y-8 mobile:gap-y-10 mobile:gap-10">
                    {!!offerList && offerList.map(el =>
                        <OfferItem offer={el} key={el.slug} ACL={ACL} research={response?.research}/>
                    )}
                </div>
        )
    }

    return <>
        <Head>
            <title>Opportunities - 3VC</title>
        </Head>
        <div className={"flex flex-col justify-between gap-7 xl:flex-row"}>
            <div className={"flex flex-col justify-center"}>
                <div className={"glow font-extrabold text-3xl"}>Funded Projects</div>
                <div className={"text-outline text-md mt-2 white min-w-[250px]"}>We bring new industry giants to our community</div>
            </div>
            <div className={"flex flex-1 2xl:max-w-[900px] w-full"}>
                <div className={"w-full flex gap-5 flex-col md:flex-row"}>
                    <Stat color={"gold"} title={"Investments"} value={11}  icon={<IconStars className={"w-9"}/>}/>
                    <Stat color={"teal"} title={"Partners"} value={11} icon={<IconNetwork className={"w-7"}/>}/>
                    <Stat color={"blue"} title={"Raised"} value={11} icon={<IconMoney className={"w-7"}/>}/>
                </div>
            </div>
        </div>
        {renderPage()}
    </>
}

export const getServerSideProps = async({req}) => {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        encryption: true
    })
    const ACL = token?.user?.ACL
    const ADDRESS = ACL !== ACLs.PartnerInjected ? ACL : token?.user?.address

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
