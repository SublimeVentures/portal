import LayoutApp from '@/components/Layout/LayoutApp';
import RoundBanner from "@/components/App/RoundBanner";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import ReadIcon from "@/assets/svg/Read.svg";
import Head from "next/head";
import {dehydrate, useQuery} from "@tanstack/react-query";
import {fetchMarkets, fetchOffers} from "@/fetchers/otc.fetcher";
import Empty from "@/components/App/Empty";
import Loader from "@/components/App/Loader";
import {useRouter} from "next/router";
import {useEffect} from "react";
import PAGE, {ExternalLinks} from "@/routes";
import {fetchVault} from "@/fetchers/vault.fetcher";
import OtcMarkets from "@/components/App/Otc/Markets";
import OtcOffers from "@/components/App/Otc/Offers";
import {ACLs, verifyID} from "@/lib/authHelpers";
import routes from "@/routes";
import {getCopy} from "@/lib/seoConfig";


export default function AppOtc({account}) {
    const router = useRouter()
    const {market} = router.query
    const {ACL, address} = account
    const ADDRESS = (ACL !==ACLs.PartnerInjected && ACL !== undefined) ? ACL : address

    const {isSuccess: otcIsSuccess, data: otc} = useQuery({
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
            cacheTime: 0,
            staleTime: 0,
        }
    );

    const currentMarket = otc?.markets?.find(el => el.slug === market)

    const {isSuccess: offersIsSuccess, data: offers, refetch: refetchOffers} = useQuery({
            queryKey: ["otcOffers", currentMarket?.market],
            queryFn: () => fetchOffers(currentMarket?.market),
            refetchOnMount: true,
            refetchOnWindowFocus: true,
            cacheTime: 0,
            staleTime: 0,
            enabled: !!currentMarket?.id
        }
    );

    const changeMarket = (slug) => {
        router.push(`${PAGE.OTC}/?market=${slug}`, undefined, {shallow: true})
    }

    const openGuide = (e) => {
        e?.preventDefault();
        window.open(ExternalLinks.OTC, '_blank');
    }

    useEffect(() => {
        if (!!otc && !!currentMarket) {
        } else {
            if(otc?.markets[0]?.slug) {
                changeMarket(otc?.markets[0]?.slug)
            }
        }
    }, [otc, otc?.markets, market])


    const propMarkets = {
        otc,
        currentMarket,
        changeMarket
    }

    const propOffers = {
        refetchOffers,
        refetchVault,
        vault: vault?.elements,
        offersIsSuccess,
        vaultIsSuccess,
        offers,
        account,
        currentMarket,
        ...{otcFee:  otc?.otcFee},
        ...{currencies:  otc?.currencies},
        ...{diamonds:  otc?.diamond}
    }

    const renderPage = () => {
        if (!otcIsSuccess) return <Loader/>
        if (!otcIsSuccess || !vaultIsSuccess) return <Loader/>
        if (otc.markets.length === 0) return <Empty/>
        return <div className="col-span-12">
            <div className="grid grid-cols-12 flex gap-y-5 mobile:gap-y-10 mobile:gap-10">
                <div className="col-span-12 lg:col-span-4 flex flex-1">
                    <OtcMarkets propMarkets={propMarkets}/>
                </div>
                <div className="col-span-12 lg:col-span-8 flex flex-1 ">
                    <OtcOffers propOffers={propOffers}/>
                </div>
            </div>
        </div>
    }

    const title = `OTC Market - ${getCopy("NAME")}`

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
                <div className="col-span-12 flex">
                    <RoundBanner title={'Over the counter'} subtitle={'Need liquidity? Trade your allocation.'}
                                 action={<RoundButton text={'Learn more'} isWide={true}
                                                      size={'text-sm sm'}
                                                      handler={openGuide}
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
                destination: `/app/auth?callbackUrl=${routes.OTC}`
            }
        }
    }

    if(!account.auth){
        return {
            redirect: {
                permanent: true,
                destination: `/login?callbackUrl=${routes.OTC}`
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
