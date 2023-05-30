import LayoutApp from '@/components/Layout/LayoutApp';
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import ReadIcon from "@/assets/svg/Read.svg";
import VaultItem from "@/components/App/Vault/VaultItem";
import {useSession} from "next-auth/react";
import { useQuery} from "@tanstack/react-query";
import {fetchVault} from "@/fetchers/vault.fetcher";
import Loader from "@/components/App/Loader";
import EmptyVault from "@/components/App/EmptyVault";
import Head from "next/head";
import UserSummary from "@/components/App/Vault/UserSummary";
import RoundSpacer from "@/components/App/RoundSpacer";
import {ExternalLinks} from "@/routes";



export default function AppVault() {
    const {data: session, status} = useSession()
    const ACL = session?.user?.ACL
    const address = session?.user?.address

    const {isSuccess: isSuccessDataFeed, data: vault} = useQuery({
            queryKey: ["userVault", {ACL, address}],
            queryFn: () => fetchVault(ACL, address),
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 5 * 60 * 1000,
            staleTime: 1 * 60 * 1000,
            enabled: ACL>=0
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
            return <VaultItem item={el} key={i} research={vault?.research}/>
        })
    }

    const placeHolder = () => {
        if(status !== "authenticated" || !isSuccessDataFeed || elements=== undefined) return <Loader/>
        if(status === "authenticated" && elements.length===0) return <div className="flex flex-1 flex-col justify-center"><EmptyVault/></div>
    }

    return (
        <>
            <Head>
                <title>Vault - 3VC</title>
            </Head>
            <UserSummary vault={elements}/>
            <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
                <div className="col-span-12 flex">

                </div>
                {renderList()}
            </div>
            <div className="col-span-12 text-center contents">
                {placeHolder()}
            </div>
        </>

    )
}

AppVault.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};
