import LayoutApp from '@/components/Layout/LayoutApp';
import VaultItem from "@/components/App/Vault/VaultItem";
import { useQuery} from "@tanstack/react-query";
import {fetchVault} from "@/fetchers/vault.fetcher";
import Loader from "@/components/App/Loader";
import EmptyVault from "@/components/App/EmptyVault";
import Head from "next/head";
import UserSummary from "@/components/App/Vault/UserSummary";
import {verifyID} from "@/lib/authHelpers";
import routes from "@/routes";

export default function AppVault({account}) {
    const ACL = account.ACL
    const address = account.address

    const {isSuccess: isSuccessDataFeed, data: vault} = useQuery({
            queryKey: ["userVault", {ACL, address}],
            queryFn: fetchVault,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 5 * 60 * 1000,
            staleTime: 1 * 60 * 1000
        }
    );

    // const investmentActivityLog = [
    //     {type: 'details', step: 'Project details', date: '', icon: "vote"},
    //     {type: 'pledge', step: 'Pledged', date: '2022-10-15', icon: "vote"},
    //     {type: 'buy', step: 'Invested', date: '2022-10-16', icon: "vote"},
    //     {type: 'notpassed', step: 'Cancelled', date: '2022-10-19', icon: "vote"},
    //     {type: 'refund0', step: 'Refund available', date: '2022-10-16', icon: "vote"},
    //     {type: 'refund01', step: 'Refund claimed', date: '2022-10-16', icon: "vote"},
    //     {type: 'claim0', step: 'Tokens to claim', date: '2022-10-16', icon: "vote"},
    //     {type: 'claim1', step: 'Tokens claimed', date: '2022-10-16', icon: "vote"},
    // ]

    const elements = vault?.elements

    const renderList = () => {
        if(!elements) return
        return elements.map((el, i) => {
            return <VaultItem item={el} key={i} cdn={vault?.cdn}/>
        })
    }

    const placeHolder = () => {
        if(!isSuccessDataFeed || elements=== undefined) return <Loader/>
        if(elements.length===0) return <div className="flex flex-1 flex-col justify-center"><EmptyVault/></div>
    }

    return (
        <>
            <Head>
                <title>Vault - 3VC</title>
            </Head>
            <UserSummary vault={elements} account={account}/>
            <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
                {renderList()}
            </div>
            <div className="col-span-12 text-center contents">
                {placeHolder()}
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

AppVault.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};
