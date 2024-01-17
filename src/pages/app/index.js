import LayoutApp from '@/components/Layout/LayoutApp';
import VaultItem from "@/components/App/Vault/VaultItem";
import {useQuery} from "@tanstack/react-query";
import {fetchVault} from "@/fetchers/vault.fetcher";
import Loader from "@/components/App/Loader";
import EmptyVault from "@/components/App/EmptyVault";
import Head from "next/head";
import dynamic from "next/dynamic";
import {getCopy} from "@/lib/seoConfig";
import { processServerSideData} from "@/lib/serverSideHelpers";
import routes from "@/routes";
import {fetchStoreItemsOwned} from "@/fetchers/store.fetcher";

const UserSummary = dynamic(() => import('@/components/App/Vault/UserSummary'), {ssr: false})

export default function AppVault({session}) {
    const userId = session.userId
    const tenantId = session.tenantId

    const {isSuccess: isSuccessDataFeed, data: vault} = useQuery({
            queryKey: ["userVault", userId],
            queryFn: fetchVault,
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            cacheTime: 5 * 60 * 1000,
            staleTime: 1 * 30 * 1000
        }
    );

    const {data: premiumData} = useQuery({
            queryKey: ["premiumOwned", userId, tenantId],
            queryFn: fetchStoreItemsOwned,
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            cacheTime: 5 * 60 * 1000,
            staleTime: 1 * 60 * 1000
        }
    );

    const renderList = () => {
        if (!vault) return
        return vault.map((el, i) => {
            return <VaultItem item={el} key={el.name}/>
        })
    }

    const placeHolder = () => {
        if (!isSuccessDataFeed || vault === undefined) return <Loader/>
        if (vault.length === 0) return <div className="flex flex-1 flex-col justify-center"><EmptyVault/></div>
    }

    const title = `Vault - ${getCopy("NAME")}`
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <UserSummary vault={vault} session={session} premiumData={premiumData}/>
            <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
                {renderList()}
            </div>
            <div className="col-span-12 text-center contents">
                {placeHolder()}
            </div>
        </>
    )
}


export const getServerSideProps = async ({ req, res }) => {
    return await processServerSideData(req, res, routes.App);
}

AppVault.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};
