import LayoutApp from "@/components/Layout/LayoutApp";
import RoundBanner from "@/components/App/RoundBanner";
import { ButtonIconSize, RoundButton } from "@/components/Button/RoundButton";
import { AiOutlineRead as ReadIcon } from "react-icons/ai";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import { fetchMarkets, fetchOffers } from "@/fetchers/otc.fetcher";
import Empty from "@/components/App/Empty";
import Loader from "@/components/App/Loader";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PAGE, { ExternalLinks } from "@/routes";
import { fetchVault } from "@/fetchers/vault.fetcher";
import OtcMarkets from "@/components/App/Otc/Markets";
import OtcOffers from "@/components/App/Otc/Offers";
import routes from "@/routes";
import { getCopy } from "@/lib/seoConfig";
import { processServerSideData } from "@/lib/serverSideHelpers";

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
        if (!otcIsSuccess) return <Loader />;
        if (!otcIsSuccess || !vaultIsSuccess) return <Loader />;
        if (otc?.length === 0)
            return (
                <div className="col-span-12 max-h-[40vh]">
                    <Empty />
                </div>
            );
        return (
            <div className="col-span-12">
                <div className="grid grid-cols-12 flex gap-y-5 mobile:gap-y-10 mobile:gap-10">
                    <div className="col-span-12 lg:col-span-4 flex flex-1">
                        <OtcMarkets propMarkets={propMarkets} />
                    </div>
                    <div className="col-span-12 lg:col-span-8 flex flex-1 ">
                        <OtcOffers propOffers={propOffers} />
                    </div>
                </div>
            </div>
        );
    };

    const title = `OTC Market - ${getCopy("NAME")}`;

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
                <div className="col-span-12 flex">
                    <RoundBanner
                        title={"Over the counter"}
                        subtitle={"Need liquidity? Trade your allocation."}
                        action={
                            <RoundButton
                                text={"Learn more"}
                                isWide={true}
                                size={"text-sm sm"}
                                handler={openGuide}
                                icon={<ReadIcon className={ButtonIconSize.hero} />}
                            />
                        }
                    />
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
    return <LayoutApp>{page}</LayoutApp>;
};
