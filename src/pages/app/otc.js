import { useEffect } from "react";
import { useRouter } from "next/router";

import { AppLayout, Metadata } from "@/v2/components/Layout";
import { OtcMarkets, OtcOffers } from "@/v2/components/App/Otc";
import Empty from "@/components/App/Empty";
import Loader from "@/components/App/Loader";
import { processServerSideData } from "@/lib/serverSideHelpers";

// rest
import { useQuery } from "@tanstack/react-query";
import { AiOutlineRead as ReadIcon } from "react-icons/ai";
import RoundBanner from "@/components/App/RoundBanner";
import { ButtonIconSize, RoundButton } from "@/components/Button/RoundButton";
import { fetchMarkets, fetchOffers } from "@/fetchers/otc.fetcher";

import PAGE, { ExternalLinks } from "@/routes";
import { fetchVault } from "@/fetchers/vault.fetcher";
import routes from "@/routes";

export default function AppOtc({ session }) {
    const router = useRouter();
    const { market } = router.query;
    const { userId: USER_ID } = session;

    const { isSuccess: otcIsSuccess, data: otc } = useQuery({
        queryKey: ["otcMarkets", USER_ID],
        queryFn: fetchMarkets,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 4 * 60 * 60 * 1000,
        staleTime: 3 * 60 * 60 * 1000,
    });

    const {
        isSuccess: vaultIsSuccess,
        data: vault,
        refetch: refetchVault,
    } = useQuery({
        queryKey: ["userVault", USER_ID],
        queryFn: fetchVault,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 0,
        staleTime: 0,
    });

    const currentMarket = otc?.find((el) => el.slug === market);

    const {
        isSuccess: offersIsSuccess,
        data: offers,
        refetch: refetchOffers,
    } = useQuery({
        queryKey: ["otcOffers", currentMarket?.otc],
        queryFn: () => fetchOffers(currentMarket?.otc),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        cacheTime: 0,
        staleTime: 0,
        enabled: !!currentMarket?.offerId,
    });

    const changeMarket = (slug) => {
        router.push(`${PAGE.OTC}/?market=${slug}`, undefined, {
            shallow: true,
        });
    };

    const openGuide = (e) => {
        e?.preventDefault();
        window.open(ExternalLinks.OTC, "_blank");
    };

    useEffect(() => {
        if (!!otc && !!currentMarket) {
        } else {
            if (otc && otc[0]?.slug) {
                changeMarket(otc[0]?.slug);
            }
        }
    }, [otc, otc?.markets, market]);

    const propMarkets = {
        otc,
        currentMarket,
        changeMarket,
    };

    const propOffers = {
        refetchOffers,
        refetchVault,
        vault,
        offersIsSuccess,
        vaultIsSuccess,
        offers,
        currentMarket,
        session,
    };

    const renderPage = () => {
        if (!otcIsSuccess || !vaultIsSuccess) return <Loader />;
        
        if (otc?.length === 0) {
            return (
                <div className="col-span-12 max-h-[40vh]">
                    <Empty />
                </div>
            );
        }
        
        return (
            <div className="h-full">
                <div className="h-full grid grid-cols-12 gap-y-5 lg:gap-y-10 lg:gap-10">
                    <div className="h-full col-span-12 lg:col-span-4">
                        <OtcMarkets propMarkets={propMarkets} />
                    </div>
                    <div className="col-span-12 lg:col-span-8">
                        {/* <OtcOffers propOffers={propOffers} /> */}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Metadata title='OTC Market' />
            <div className="p-4 flex flex-col grow md:p-16">
                <div className="mb-8">
                    <h3 className="text-nowrap text-2xl text-foreground">All markets</h3>
                    <p className="text-lg text-[#C4C4C4] whitespace-pre-line">
                        Explore Opportunities Beyond the Exchange
                    </p>
                </div>

                {renderPage()}
            </div>
        </>
    );
}

export const getServerSideProps = async ({ req, res }) => {
    return await processServerSideData(req, res, routes.OTC);
};

AppOtc.getLayout = function (page) {
    return <AppLayout title="OTC Market">{page}</AppLayout>
};
