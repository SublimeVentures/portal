import Head from "next/head";

import { useQuery } from "@tanstack/react-query";
import { BiMoneyWithdraw as IconMoney, BiNetworkChart as IconNetwork } from "react-icons/bi";
import Empty from "@/components/App/Empty";
import IconStars from "@/assets/svg/Stars.svg";
import LayoutApp from "@/components/Layout/LayoutApp";
import Loader from "@/components/App/Loader";
import OfferItem from "@/components/App/Offer/OfferItem";
import Stat from "@/components/Stat";
import { fetchOfferList } from "@/fetchers/offer.fetcher";
import { getCopy } from "@/lib/seoConfig";
import { tenantIndex } from "@/lib/utils";
import { processServerSideData } from "@/lib/serverSideHelpers";
import routes from "@/routes";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { TENANT } from "@/lib/tenantHelper";

export default function AppOffer({ session }) {
    const TENANT_ID = session.tenantId;
    const PARTNER_ID = session.partnerId;
    const { cdn } = useEnvironmentContext();

    const {
        isLoading,
        data: response,
        isError,
    } = useQuery({
        queryKey: ["offerList", { TENANT_ID, PARTNER_ID }],
        queryFn: fetchOfferList,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const offerList = response?.offers;
    const offerListRender = offerList ? offerList : [];
    const stats = response?.stats;
    const partners = stats ? stats.partners : 0;
    const projectsInvested = stats ? stats.vc : 0;
    const funded = `$${Number(stats ? stats.funded : 0).toLocaleString()}`;

    const renderPage = () => {
        if (isLoading) return <Loader />;
        if (!offerListRender || offerListRender.length === 0) return <Empty />;
        return (
            <div className="grid grid-cols-12 gap-y-8  mobile:gap-10">
                {!!offerList && offerListRender.map((el) => <OfferItem offer={el} cdn={cdn} key={el.slug} />)}
            </div>
        );
    };

    const title = `Opportunities - ${getCopy("NAME")}`;
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="flex flex-col justify-between gap-7 xl:flex-row">
                <div className="flex flex-col justify-center">
                    <div className="glow text-3xl page-header-text">Funded Projects</div>
                    <div className="text-outline text-md mt-2 white min-w-[250px]">
                        We bring new industry giants to our community
                    </div>
                </div>
                <div className="flex flex-1 2xl:max-w-[900px] w-full">
                    <div className="w-full flex gap-5 flex-col md:flex-row">
                        <Stat
                            color="gold"
                            title="Investments"
                            value={projectsInvested}
                            icon={<IconStars className={"w-9 text-2xl"} />}
                        />
                        {tenantIndex === TENANT.basedVC && (
                            <Stat
                                color="teal"
                                title="Partners"
                                value={partners}
                                icon={<IconNetwork className="w-7 text-2xl" />}
                            />
                        )}
                        <Stat
                            color={"blue"}
                            title={"Raised"}
                            value={funded}
                            icon={<IconMoney className={"w-7 text-2xl"} />}
                        />
                    </div>
                </div>
            </div>
            {renderPage()}
        </>
    );
}

export const getServerSideProps = async ({ req, res }) => {
    return await processServerSideData(req, res, routes.Opportunities);
};

AppOffer.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};
