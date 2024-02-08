import LayoutApp from '@/components/Layout/LayoutApp';
import OfferItem from "@/components/App/Offer/OfferItem";
import {useQuery} from "@tanstack/react-query";
import {fetchOfferList} from "@/fetchers/offer.fetcher";
import Loader from "@/components/App/Loader";
import Empty from "@/components/App/Empty";
import Head from "next/head";
import Stat from "@/components/Stat";
import IconStars from "@/assets/svg/Stars.svg";
import routes from "@/routes";
import {isBased} from "@/lib/utils";
import {getCopy} from "@/lib/seoConfig";
import { processServerSideData} from "@/lib/serverSideHelpers";
import {useEnvironmentContext} from "@/lib/context/EnvironmentContext";

export default function AppAccelerator({session}) {
    const {cdn} = useEnvironmentContext();

    const TENANT_ID = session.tenantId
    const PARTNER_ID = session.partnerId

    const { isLoading, data: response, isError } = useQuery({
            queryKey: ["offerList", {TENANT_ID, PARTNER_ID}],
            queryFn: fetchOfferList,
            cacheTime: 5 * 60 * 1000,
            staleTime: 1 * 60 * 1000,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        }
    );


    const offerList = response?.offers
    const acceleratorList = !!offerList ? offerList.filter(el => el.isAccelerator) : [];
    const accelerator = acceleratorList.length

    const renderPage = () => {
        if(isLoading) return <Loader/>
        if(!offerList || acceleratorList.length === 0) return  <Empty/>

        return (
                <div className="grid grid-cols-12 gap-y-8  mobile:gap-10">
                    {!!offerList && acceleratorList.map(el => {
                            return <OfferItem offer={el} cdn={cdn} key={el.slug}/>
                        }
                    )}
                </div>
        )
    }

    const title = `Accelerator - ${getCopy("NAME")}`
    return <>
        <Head>
            <title>{title}</title>
        </Head>
        <div className={"flex flex-col justify-between gap-7 xl:flex-row"}>
            <div className={"flex flex-col justify-center"}>
                <div className={`glow font-extrabold text-3xl ${isBased ? "" : "font-accent uppercase font-light"}`}>Accelerator</div>
                <div className={"text-outline text-md mt-2 white min-w-[250px]"}>Hyper-promising projects that are outside of {getCopy("NAME")} investment thesis.</div>
            </div>
            <div className={"flex flex-1 2xl:max-w-[900px] w-full"}>
                <div className={"w-full flex gap-5 flex-col md:flex-row xl:max-w-[300px] xl:ml-auto"}>
                        <Stat color={"gold"} title={"Projects"} value={accelerator}  icon={<IconStars className={"w-9"}/>}/>
                </div>
            </div>
        </div>
        <div className={"flex flex-col gap-5 xl:flex-row"}>
            <div className={`relative offerWrap flex flex-1`}>
                <div className={"bg-navy-accent p-5 font-accent flex flex-1 flex-col uppercase"}>
                    <div className={"flex flex-row items-center pb-5 justify-between "}>
                        <div className={`text-app-error font-accent glowRed  font-light text-xl flex glowNormal`}>Our involvement</div>
                    </div>
                    <div className={"font-light text-sm"}>
                        <span className="font-bold text-app-error">{getCopy("NAME")}</span> will provide leading projects strategic advisory, a compliant investment structure and a trusted platform to grow and seek investment. Projects will be responsible for providing information, promotion, AMAs, pitch decks and answering questions.
                    </div>
                </div>

            </div>
            <div className={`relative offerWrap flex flex-1`}>
                <div className={"bg-navy-accent p-5 font-accent flex flex-1 flex-col uppercase"}>
                    <div className={"flex flex-row items-center pb-5 justify-between "}>
                        <div className={`text-app-error font-accent glowRed  font-light text-xl flex glowNormal`}>Due Diligence</div>
                    </div>
                    <div className={"font-light text-sm"}>
                        As <span className="text-app-error font-bold">{getCopy("ACCELERATOR")}</span> projects are <span className={"font-bold text-app-error"}>outside</span> of our traditional investment stream, <span className="text-app-error font-bold">{getCopy("NAME")} cannot make any representations regarding the suitability of projects that are part of the accelerator</span>. As always, {isBased ? "Investors" :"Citizens"} must DYOR.

                    </div>
                </div>

            </div>
            <div className={`relative offerWrap flex flex-1`}>
                <div className={"bg-navy-accent p-5 font-accent flex flex-1 flex-col uppercase"}>
                    <div className={"flex flex-row items-center pb-5 justify-between "}>
                        <div className={`text-app-error font-accent glowRed  font-light text-xl flex glowNormal`}>{getCopy("ACCELERATOR")}</div>
                    </div>
                    <div className={"font-light text-sm"}>
                        {getCopy("NAME")}’s mission is to <span className="text-app-error font-bold">empower the builders of {isBased ? "web3" : "NeoTokyo"}</span>. We are constantly innovating and are launching {getCopy("ACCELERATOR")} to support top-tier projects and provide a trusted, compliant way to invest in the <span className="text-app-error font-bold">best {isBased ? "projects" :"NeoTokyo Projects"}</span>.

                    </div>
                </div>

            </div>

        </div>
        {renderPage()}
    </>
}

export const getServerSideProps = async({ req, res }) => {
    return await processServerSideData(req, res, routes.Accelerator);
}


AppAccelerator.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};


