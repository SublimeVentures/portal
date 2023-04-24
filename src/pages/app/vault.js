import LayoutApp from '@/components/Layout/LayoutApp';
import RoundBanner from "@/components/App/RoundBanner";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import ReadIcon from "@/assets/svg/Read.svg";
import VaultItem from "@/components/App/Vault/VaultItem";
import {useSession} from "next-auth/react";
import { useQuery} from "@tanstack/react-query";
import {fetchInvestments} from "@/fetchers/vault";
import Loader from "@/components/App/Loader";
import EmptyVault from "@/components/App/EmptyVault";
import Head from "next/head";


export default function AppVault() {
    const {data: session, status} = useSession()
    const ACL = session?.user?.ACL
    const address = session?.user?.address

    const {isSuccess: isSuccessDataFeed, data: vault} = useQuery({
            queryKey: ["userVault", {ACL, address}],
            queryFn: () => fetchInvestments(ACL, address),
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 5 * 60 * 1000,
            staleTime: 1 * 60 * 1000,
            enabled: ACL>=0
        }
    );


    const investmentActivityLog = [
        {type: 'details', step: 'Project details', date: '', icon: "vote"},
        {type: 'pledge', step: 'Pledged', date: '2022-10-15', icon: "vote"},
        {type: 'buy', step: 'Invested', date: '2022-10-16', icon: "vote"},
        {type: 'notpassed', step: 'Cancelled', date: '2022-10-19', icon: "vote"},
        {type: 'refund0', step: 'Refund available', date: '2022-10-16', icon: "vote"},
        {type: 'refund01', step: 'Refund claimed', date: '2022-10-16', icon: "vote"},
        {type: 'claim0', step: 'Tokens to claim', date: '2022-10-16', icon: "vote"},
        {type: 'claim1', step: 'Tokens claimed', date: '2022-10-16', icon: "vote"},
    ]


    const renderList = () => {
        if(status !== "authenticated" || !isSuccessDataFeed) return <div className={'col-span-12'}><Loader/></div>
        if(status === "authenticated" && vault.length===0) return <div className={'col-span-12'}><EmptyVault/></div>
        return vault.map((el, i) => {
            return <VaultItem item={el} key={i}/>
        })
    }

    return (
        <>
            <Head>
                <title>Vault - 3VC</title>
            </Head>
            <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">

                <div className="col-span-12 flex">
                    <RoundBanner title={'Vault'} subtitle={'All your investments in one place.'}
                                 action={<RoundButton text={'Learn more'} isWide={true}
                                                      size={'text-sm sm'}
                                                      icon={<ReadIcon className={ButtonIconSize.hero}/>}/>}
                    />
                </div>

                {renderList()}

            </div>

        </>

    )
}

AppVault.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};
