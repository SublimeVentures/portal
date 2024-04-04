import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import Empty from "@/components/App/Empty";
import IconStars from "@/assets/svg/Stars.svg";
import LayoutApp from "@/components/Layout/LayoutApp";
import Loader from "@/components/App/Loader";
import OfferItem from "@/components/App/Offer/OfferItem";
import Stat from "@/components/Stat";
import { fetchLaunchpadList } from "@/fetchers/offer.fetcher";
import { getCopy } from "@/lib/seoConfig";
import { processServerSideData } from "@/lib/serverSideHelpers";
import routes from "@/routes";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { Tooltiper, TooltipType } from "@/components/Tooltip";

export default function AppLaunchpad({ session }) {
    const { cdn } = useEnvironmentContext();

    const TENANT_ID = session.tenantId;
    const PARTNER_ID = session.partnerId;

    const {
        isLoading,
        data: response,
        isError,
    } = useQuery({
        queryKey: ["launchpadList", { TENANT_ID, PARTNER_ID }],
        queryFn: fetchLaunchpadList,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    console.log("response", response);

    const offerList = response?.offers;
    const projectsUnderLaunchpad = response?.stats?.launchpad ?? 0;

    const renderPage = () => {
        if (isLoading) return <Loader />;
        if (!offerList || offerList.length === 0 || isError) return <Empty />;

        return (
            <div className="grid grid-cols-12 gap-y-8  mobile:gap-10">
                {!!offerList &&
                    offerList.map((el) => {
                        return <OfferItem offer={el} cdn={cdn} key={el.slug} />;
                    })}
            </div>
        );
    };

    const title = `Launchpad - ${getCopy("NAME")}`;
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="flex flex-col justify-between gap-7 xl:flex-row">
                <div className="flex flex-col justify-center">
                    <div className="glow text-3xl page-header-text">Launchpad</div>
                    <div className="text-outline text-md mt-2 white min-w-[250px]">
                        Hyper-promising projects with smaller allocations that are close to
                        <Tooltiper wrapper={" TGE"} text={`Token Generation Event`} type={TooltipType.Success} />.
                    </div>
                </div>
                <div className="flex flex-1 2xl:max-w-[900px] w-full">
                    <div className="w-full flex gap-5 flex-col md:flex-row xl:max-w-[300px] xl:ml-auto">
                        <Stat
                            color={"gold"}
                            title={"Projects"}
                            value={projectsUnderLaunchpad}
                            icon={<IconStars className={"w-9"} />}
                        />
                    </div>
                </div>
            </div>
            {renderPage()}
        </>
    );
}

export const getServerSideProps = async ({ req, res }) => {
    return await processServerSideData(req, res, routes.Launchpad);
};

AppLaunchpad.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};
