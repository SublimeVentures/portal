import LayoutApp from '@/components/Layout/LayoutApp';
import routes from "@/routes";
import {getCopy} from "@/lib/seoConfig";
import {isBased} from "@/lib/utils";
import Head from "next/head";
import {processServerSideData} from "@/lib/serverSideHelpers";
import {useEnvironmentContext} from "@/lib/context/EnvironmentContext";
import ExternalStaking from "@/components/App/Settings/ExternalStaking";
import BasedStaking from "@/components/App/Settings/BasedStaking";
import {queryClient} from "@/lib/queryCache";
import {dehydrate, useQuery} from "@tanstack/react-query";
import {fetchUserWallets, fetchUserWalletsSsr} from "@/fetchers/settings.fetcher";
import ManageWallets from "@/components/App/Settings/ManageWallets";


export default function AppSettings({session}) {
    const {currencyStaking, account} = useEnvironmentContext();
    const stakingEnabled = currencyStaking?.isStaking && session.stakingEnabled
    const userId = session?.userId;



    const {data: userWallets, refetch: refetchUserWallets} = useQuery({
            queryKey: ["userWallets", userId],
            queryFn: () => fetchUserWallets(),
            refetchOnWindowFocus: true,
        }
    );

    const stakingProps = {
        session,
        account,
    }

    const walletProps = {
        session,
        wallets: userWallets,
        refetchUserWallets
    }

    const title = `Settings - ${getCopy("NAME")}`
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
                <div className="col-span-12 xl:col-span-6 flex flex-row gap-x-5 mobile:gap-10">
                    <ManageWallets walletProps={walletProps}/>

                </div>
                <div className={"flex col-span-12 xl:col-span-6"}>
                    {isBased ? <BasedStaking stakingProps={stakingProps}/> : (stakingEnabled  && <ExternalStaking stakingProps={stakingProps}/>) }
                </div>
            </div>
        </>



    )
}

export const getServerSideProps = async({ req, res }) => {
    const customLogicCallback = async (account, token) => {
        const userId = account?.userId;

        await queryClient.prefetchQuery({
            queryKey: ["userWallets", userId],
            queryFn: () => fetchUserWalletsSsr(token),
        })

        return {
            additionalProps: {
                dehydratedState: dehydrate(queryClient),
            }
        };
    }


    return await processServerSideData(req, res, routes.Settings, customLogicCallback);
}

AppSettings.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};
