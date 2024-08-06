import { dehydrate } from "@tanstack/react-query";

import { processServerSideData } from "@/lib/serverSideHelpers";
import { queryClient } from "@/lib/queryCache";
import { fetchUserWallets, fetchUserWalletsSsr } from "@/fetchers/settings.fetcher";
import { AppLayout, Metadata } from "@/v2/components/Layout";
import Settings from "@/v2/modules/settings/Settings";
import routes from "@/routes";
import { settingsKeys } from "@/v2/constants";

export default function AppSettings({ session }) {
    return (
        <>
            <Metadata title="Settings" />
            <Settings session={session} />
        </>
    );
}

export const getServerSideProps = async ({ req, res }) => {
    const customLogicCallback = async (account, token) => {
        const userId = account?.userId;

        await queryClient.prefetchQuery({
            queryKey: settingsKeys.userWallets(userId),
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
    return <AppLayout title="Settings">{page}</AppLayout>;
};
