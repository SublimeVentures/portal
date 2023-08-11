import LayoutApp from '@/components/Layout/LayoutApp';
import {verifyID} from "@/lib/authHelpers";
import routes from "@/routes";
import CitCapAccount from "@/components/App/Settings/CitCapAccount";
 import {getCopy} from "@/lib/seoConfig";
import {isBased} from "@/lib/utils";
import Head from "next/head";
import PremiumSummary from "@/components/App/Settings/PremiumSummary";
import {useQuery} from "@tanstack/react-query";
import {fetchStoreItemsOwned} from "@/fetchers/store.fetcher";


export default function AppSettings({account}) {
    const address = account.address
    const {isSuccess: premiumIsSuccess, data: premiumData} = useQuery({
            queryKey: ["premiumOwned", {address}],
            queryFn: fetchStoreItemsOwned,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 15 * 1000,
        }
    );
    console.log("premiumData",premiumData)


    const title = `Settings - ${getCopy("NAME")}`
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
                <div className="col-span-12 sm:col-span-8 xl:col-span-6 flex flex-row gap-x-5 mobile:gap-10">
                    {!isBased && <CitCapAccount account={account}/>}
                </div>
                <div className={"flex col-span-12 sm:col-span-4 xl:col-span-4"}>
                    <PremiumSummary data={premiumData}/>
                </div>
            </div>
        </>



    )
}


export const getServerSideProps = async({res}) => {
    const account = await verifyID(res.req)

    if(account.exists){
        return {
            redirect: {
                permanent: true,
                destination: `/app/auth?callbackUrl=${routes.Settings}`
            }
        }
    }

    if(!account.auth){
        return {
            redirect: {
                permanent: true,
                destination: `/login?callbackUrl=${routes.Settings}`
            }
        }
    }

    return {
        props: {
            account: account.user
        }
    }
}

AppSettings.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};
