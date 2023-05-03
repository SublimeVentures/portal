import LayoutApp from '@/components/Layout/LayoutApp';
import RoundBanner from "@/components/App/RoundBanner";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import ReadIcon from "@/assets/svg/Read.svg";
import IconCart from "@/assets/svg/Cart.svg";
import Head from "next/head";
import {queryClient} from "@/lib/web3/queryCache";
import {dehydrate, useQuery} from "@tanstack/react-query";
import {fetchMarkets, fetchOffers} from "@/fetchers/otc";
import Empty from "@/components/App/Empty";
import Loader from "@/components/App/Loader";
import {useRouter} from "next/router";
import {useEffect} from "react";
import PAGE from "@/routes";
import {fetchInvestments} from "@/fetchers/vault";
import {useSession} from "next-auth/react";
import OtcMarkets from "@/components/App/Otc/Markets";
import OtcOffers from "@/components/App/Otc/Offers";


export default function AppOtc() {
    const router = useRouter()
    const {data: session} = useSession()
    const ACL = session?.user?.ACL
    const address = session?.user?.address


    const {isSuccess: marketsIsSuccess, data: markets} = useQuery({
            queryKey: ["otcMarkets"],
            queryFn: fetchMarkets,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 4 * 60 * 60 * 1000,
            staleTime: 3 * 60 * 60 * 1000
        }
    );

    const {isSuccess: vaultIsSuccess, data: vault, refetch: refetchVault} = useQuery({
            queryKey: ["userVault", {ACL, address}],
            queryFn: () => fetchInvestments(ACL, address),
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 5 * 60 * 1000,
            staleTime: 0,
            enabled: ACL>=0
        }
    );

    const {market} = router.query
    const currentMarket = markets?.open.find(el => el.slug === market)

    const {isSuccess: offersIsSuccess, data: offers, refetch: refetchOffers} = useQuery({
            queryKey: ["otcOffers", currentMarket?.id],
            queryFn: () => fetchOffers(currentMarket?.id),
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 5 * 60 * 1000,
            staleTime: 0,
            enabled: !!currentMarket
        }
    );

    const changeMarket = (slug) => {
        router.push(`${PAGE.OTC}/?market=${slug}`, undefined, {shallow: true})
    }

    useEffect(() => {
        if (!!market && !!currentMarket) {
        } else {
            changeMarket(markets.open[0]?.slug)
        }
    }, [market, markets])


    const propMarkets = {
        markets,
        currentMarket,
        changeMarket
    }

    const propOffers = {
        refetchVault,
        offers,
        vault,
        refetchOffers,
        session,
        currentMarket,
        ...{source:  markets.source},
        ...{otcFee:  markets.otcFee},
        ...{currencies:  markets.currencies}
    }

    const renderPage = () => {
        if (!marketsIsSuccess || !vaultIsSuccess || !offersIsSuccess) return <Loader/>
        if (markets.open.length === 0) return <Empty/>
        return <div className="col-span-12">
            <div className="grid grid-cols-12 flex gap-y-5 mobile:gap-y-10 mobile:gap-10 ">
                <div className="col-span-12 lg:col-span-4 flex flex-1">
                    <OtcMarkets propMarkets={propMarkets}/>
                </div>
                <div className="col-span-12 lg:col-span-8 flex flex-1">
                    <OtcOffers propOffers={propOffers}/>
                </div>
            </div>
        </div>
    }

    return (
        <>
            <Head>
                <title>OTC Market - 3VC</title>
            </Head>
            <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
                <div className="col-span-12 flex">
                    <RoundBanner title={'Over the counter'} subtitle={'Need liquidity? Trade your allocation.'}
                                 action={<RoundButton text={'Learn more'} isWide={true}
                                                      size={'text-sm sm'}
                                                      icon={<ReadIcon className={ButtonIconSize.hero}/>}/>}
                    />
                </div>
                {renderPage()}
            </div>

        </>

    )
}

export const getServerSideProps = async ({req}) => {

    await queryClient.prefetchQuery({
        queryKey: ["otcMarkets"],
        queryFn: fetchMarkets,
        cacheTime: 4 * 60 * 60 * 1000,
        staleTime: 2 * 60 * 60 * 1000
    })

    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        }
    }
}


AppOtc.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};
