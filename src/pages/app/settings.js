import Head from "next/head";
import { dehydrate, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import LayoutApp from "@/components/Layout/LayoutApp";
import routes from "@/routes";
import PAGE from "@/lib/enum/route";
import { processServerSideData } from "@/lib/serverSideHelpers";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { queryClient } from "@/lib/queryCache";
import { fetchUserWallets, fetchUserWalletsSsr } from "@/fetchers/settings.fetcher";
import ManageWallets from "@/components/App/Settings/ManageWallets";
import { getTenantConfig, TENANT } from "@/lib/tenantHelper";
import ReferralsTable from "@/components/App/Referral/ReferralsTable";
import { fetchUserReferrals } from "@/fetchers/referral.fetcher";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { tenantIndex } from "@/lib/utils";

const StakeBased = dynamic(() => import("@/components/App/Settings/BasedStaking"), { ssr: true });
const StakeNeoTokyo = dynamic(() => import("@/components/App/Settings/NeoTokyoStaking"), { ssr: true });
const StakeCyberKongz = dynamic(() => import("@/components/App/Settings/CyberKongzStaking"), { ssr: true });
const StakeBAYC = dynamic(() => import("@/components/App/Settings/BAYCStaking"), { ssr: true });

const isBaseVCTenant = tenantIndex === TENANT.basedVC;

const TENANTS_STAKING = (stakingProps) => {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.basedVC: {
            return <StakeBased stakingProps={stakingProps} />;
        }
        case TENANT.NeoTokyo: {
            if (stakingProps.stakingEnabled) return <StakeNeoTokyo stakingProps={stakingProps} />;
            break;
        }
        case TENANT.CyberKongz: {
            if (stakingProps.stakingEnabled) return <StakeCyberKongz stakingProps={stakingProps} />;
            break;
        }
        case TENANT.BAYC: {
            if (stakingProps.stakingEnabled) return <StakeBAYC stakingProps={stakingProps} />;
            break;
        }
        default: {
            return <></>;
        }
    }
};

const { NAME } = getTenantConfig().seo;

export default function AppSettings({ session }) {
    const router = useRouter();
    const { currencyStaking, activeCurrencyStaking, account } = useEnvironmentContext();
    const stakingEnabled = currencyStaking?.length > 0 && session.stakingEnabled;
    const userId = session?.userId;

    const { data: userWallets, refetch: refetchUserWallets } = useQuery({
        queryKey: ["userWallets", userId],
        queryFn: () => fetchUserWallets(),
        refetchOnWindowFocus: true,
    });

    const { data: userReferrals } = useQuery({
        queryKey: ["fetchUserReferrals"],
        queryFn: fetchUserReferrals,
    });

    const stakingCurrency = activeCurrencyStaking?.name ? activeCurrencyStaking : currencyStaking[0];

    const stakingProps = {
        session,
        account,
        stakingEnabled,
        stakingCurrency,
        userWallets,
    };

    const walletProps = {
        session,
        wallets: userWallets,
        refetchUserWallets,
    };

    const title = `Settings - ${NAME}`;

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
                <div className="col-span-12 xl:col-span-6 flex flex-row gap-x-5 mobile:gap-10">
                    <ManageWallets walletProps={walletProps} />
                </div>
                <div className="flex col-span-12 xl:col-span-6">{TENANTS_STAKING(stakingProps)}</div>
                {isBaseVCTenant && userReferrals && (
                    <div className="flex col-span-12 xl:col-span-6">
                        <div className="bg-navy-accent p-5 font-accent flex flex-1 flex-col uppercase overflow-x-auto">
                            <div className="font-bold text-2xl flex items-center glowNormal p-5 ">
                                <div className="flex flex-1 font-bold">Referrals Summary</div>
                            </div>
                            <ReferralsTable dataProp={userReferrals} />
                            <div className="flex flex-row ml-auto p-5 mt-auto">
                                <UniButton
                                    type={ButtonTypes.BASE}
                                    text={"Refer / Claim"}
                                    size={"text-sm xs"}
                                    isWide={true}
                                    isLarge={true}
                                    handler={() => {
                                        router.replace(PAGE.Referral);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export const getServerSideProps = async ({ req, res }) => {
    const customLogicCallback = async (account, token) => {
        const userId = account?.userId;

        await queryClient.prefetchQuery({
            queryKey: ["userWallets", userId],
            queryFn: () => fetchUserWalletsSsr(token),
        });

        return {
            additionalProps: {
                dehydratedState: dehydrate(queryClient),
            },
        };
    };

    return await processServerSideData(req, res, routes.Settings, customLogicCallback);
};

AppSettings.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};
