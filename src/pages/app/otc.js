import LayoutApp from '@/components/Layout/LayoutApp';
import RoundBanner from "@/components/App/RoundBanner";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import ReadIcon from "@/assets/svg/Read.svg";
import Head from "next/head";
import {queryClient} from "@/lib/queryCache";
import {dehydrate, useQuery} from "@tanstack/react-query";
import {fetchMarkets, fetchOffers} from "@/fetchers/otc.fetcher";
import Empty from "@/components/App/Empty";
import Loader from "@/components/App/Loader";
import {useRouter} from "next/router";
import {useEffect} from "react";
import PAGE from "@/routes";
import {fetchVault} from "@/fetchers/vault.fetcher";
import OtcMarkets from "@/components/App/Otc/Markets";
import OtcOffers from "@/components/App/Otc/Offers";
import {ACLs, verifyID} from "@/lib/authHelpers";
import routes from "@/routes";


export default function AppOtc({account}) {
    const router = useRouter()
    const {ACL, address} = account
    const ADDRESS = (ACL !==ACLs.PartnerInjected && ACL !== undefined) ? ACL : address

    const {isSuccess: marketsIsSuccess, data: markets} = useQuery({
            queryKey: ["otcMarkets", {ACL, ADDRESS}],
            queryFn: fetchMarkets,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 4 * 60 * 60 * 1000,
            staleTime: 3 * 60 * 60 * 1000
        }
    );

    const {isSuccess: vaultIsSuccess, data: vault, refetch: refetchVault} = useQuery({
            queryKey: ["userVault", {ACL, address}],
            queryFn: fetchVault,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 5 * 60 * 1000,
            staleTime: 0,
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
            changeMarket(markets?.open[0]?.slug)
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
        account,
        currentMarket,
        ...{otcFee:  markets?.otcFee},
        ...{currencies:  markets?.currencies},
        ...{multichain:  markets?.multichain}
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

export const getServerSideProps = async ({res}) => {
    const account = await verifyID(res.req)

    if(account.exists){
        return {
            redirect: {
                permanent: true,
                destination: `/app/auth?callbackUrl=${routes.App}`
            }
        }
    }

    if(!account.auth){
        return {
            redirect: {
                permanent: true,
                destination: `/login?callbackUrl=${routes.App}`
            }
        }
    }

    return {
        props: {
            account: account.user
        }
    }


}


AppOtc.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};
