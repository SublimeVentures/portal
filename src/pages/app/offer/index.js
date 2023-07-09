import LayoutApp from '@/components/Layout/LayoutApp';
import OfferItem from "@/components/App/Offer/OfferItem";
import {useQuery} from "@tanstack/react-query";
import {fetchOfferList} from "@/fetchers/offer.fetcher";
import Loader from "@/components/App/Loader";
import Empty from "@/components/App/Empty";
import Head from "next/head";
import Stat from "@/components/Stat";
import IconNetwork from "@/assets/svg/Network.svg";
import IconStars from "@/assets/svg/Stars.svg";
import IconMoney from "@/assets/svg/Money.svg";
import {verifyID, ACLs} from "@/lib/authHelpers";
import routes from "@/routes";
import {getCopy, is3VC} from "@/lib/seoConfig";

export default function AppOffer({account}) {
    const ACL = account.ACL
    const ADDRESS = ACL !==ACLs.PartnerInjected ? ACL : account.address

    const { isLoading, data: response, isError } = useQuery({
            queryKey: ["offerList", {ACL, ADDRESS}],
            queryFn: fetchOfferList,
            cacheTime: 5 * 60 * 1000,
            staleTime: 1 * 60 * 1000,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        }
    );


    const offerList = response?.offers
    const offerListRender = offerList ? offerList.filter(el=> !el.accelerator) : []
    const stats = response?.stats
    const investments = stats ? stats.investments : 0;
    const partners = stats ? stats.partners : 0;
    const funded = `$${Number(stats ? stats.funded : 0).toLocaleString()}`;

    const renderPage = () => {
        if(isLoading) return <Loader/>
        if(!offerList || offerList.length === 0) return  <Empty/>

        return (
                <div className="grid grid-cols-12 gap-y-8  mobile:gap-10">
                    {!!offerList && offerListRender.map(el =>
                        <OfferItem offer={el} key={el.slug} ACL={ACL} cdn={response?.cdn}/>
                    )}
                </div>
        )
    }

    return <>
        <Head>
            <title>Opportunities - {getCopy("NAME")}</title>
        </Head>
        <div className={"flex flex-col justify-between gap-7 xl:flex-row"}>
            <div className={"flex flex-col justify-center"}>
                <div className={`glow font-extrabold text-3xl ${is3VC ? "" : "font-accent uppercase font-light"}`}>Funded Projects</div>
                <div className={"text-outline text-md mt-2 white min-w-[250px]"}>We bring new industry giants to our community</div>
            </div>
            <div className={"flex flex-1 2xl:max-w-[900px] w-full"}>
                <div className={"w-full flex gap-5 flex-col md:flex-row"}>
                    <Stat color={"gold"} title={"Investments"} value={investments}  icon={<IconStars className={"w-9"}/>}/>
                    {is3VC && <Stat color={"teal"} title={"Partners"} value={partners} icon={<IconNetwork className={"w-7"}/>}/>}
                    <Stat color={"blue"} title={"Raised"} value={funded} icon={<IconMoney className={"w-7"}/>}/>
                </div>
            </div>
        </div>
        {renderPage()}
    </>
}

export const getServerSideProps = async({res}) => {
    const account = await verifyID(res.req)
    if(account.exists){
        return {
            redirect: {
                permanent: true,
                destination: `/app/auth?callbackUrl=${routes.Opportunities}`
            }
        }
    }
    if(!account.auth){
        return {
            redirect: {
                permanent: true,
                destination: `/login?callbackUrl=${routes.Opportunities}`
            }
        }
    }
    return {
        props: {
            account: account.user
        }
    }
}

AppOffer.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};


