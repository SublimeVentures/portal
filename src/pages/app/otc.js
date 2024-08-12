import { dehydrate } from "@tanstack/react-query";

import { getMarketsSsr } from "@/v2/fetchers/otc";
import { queryClient } from "@/lib/queryCache";
import { processServerSideData } from "@/lib/serverSideHelpers";
import { AppLayout, Metadata } from "@/v2/components/Layout";
import routes from "@/routes";

import OTCLayout from "@/v2/modules/otc/OTCLayout";
import Markets from "@/v2/modules/otc/Markets";
import Overview from "@/v2/modules/otc/Overview";
import OTCTables from "@/v2/modules/otc/OTCTables";

export default function AppOtc({ session }) {
    return (
        <>
            <Metadata title="OTC Market" />
            <OTCLayout session={session}>
                <Markets />

                <div className="flex flex-col ">
                    <Overview />
                    <OTCTables />
                </div>
            </OTCLayout>
        </>
    )
}

export const getServerSideProps = async ({ req, res }) => {
    const customLogicCallback = async (account, token) => {
        const userId = account?.userId;

        await queryClient.prefetchQuery({
            queryKey: ["otcMarkets", userId],
            queryFn: () => getMarketsSsr(token),
        });

        return {
            additionalProps: {
                dehydratedState: dehydrate(queryClient),
            },
        };
    };

    return await processServerSideData(req, res, routes.OTC, customLogicCallback);
};


AppOtc.getLayout = function (page) {
    return <AppLayout title="OTC Market">{page}</AppLayout>;
};
