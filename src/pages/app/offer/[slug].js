import { dehydrate } from "@tanstack/react-query";

import { AppLayout, Metadata } from "@/v2/components/Layout";
import { processServerSideData } from "@/lib/serverSideHelpers";
import { queryClient } from "@/lib/queryCache";
import { fetchOfferAllocationSsr, fetchOfferDetailsSsr } from "@/fetchers/offer.fetcher";
import { fetchUserInvestmentSsr } from "@/fetchers/vault.fetcher";
import { routes } from "@/v2/routes";

import { Overview, Phases, Invest, Fundraise, Vesting, History } from "@/v2/modules/offer";
export default function AppOfferDetails({ session, state }) {

    // @TODO
    // Prefetched data - Can we set it in store without re-render?
    // const offerId = offerDetails?.id;
    // const guaranteedUsed = userAllocation?.upgrades?.find((el) => el.id === PremiumItemsENUM.Guaranteed);
    // const increasedUsed = userAllocation?.upgrades?.find((el) => el.id === PremiumItemsENUM.Increased);
    const { userId, tenantId } = session;
    const { offerId } = state;

    // @TODO 
    // Data for queries based on phase - Store in zustand?
    // const isExtraQueryEnabled = !!offerDetails?.id;
    // const offerIsClosed = phasesData?.offerClosed;
    // const isAllocationRefetchEnabled = offerIsClosed ? false : 15000;

    // @Todo - Use in correct module 
    // const guaranteedUsed = userAllocation?.upgrades?.find((el) => el.id === PremiumItemsENUM.Guaranteed);
    // const increasedUsed = userAllocation?.upgrades?.find((el) => el.id === PremiumItemsENUM.Increased);
    
    return (
        <>
            <Metadata title="Opportunity" />
            <div className="text-white space-y-4">
                <Overview />
                <Phases />
                <Invest />
                <Fundraise />
                <Vesting />
                <History />
            </div>
        </>
    )
}

export const getServerSideProps = async ({ req, res, resolvedUrl, query }) => {
    const customLogicCallback = async (account, token) => {
        const slug = query.slug;

        try {
            await queryClient.prefetchQuery({
                queryKey: ["offerDetails", slug],
                queryFn: () => fetchOfferDetailsSsr(slug, token),
                cacheTime: 30 * 60 * 1000,
                staleTime: 15 * 60 * 1000,
            });
            
            const offerDetails = queryClient.getQueryData(["offerDetails", slug]);
            const offerId = offerDetails.id;

            if (!offerId) throw Error("Offer not specified");

            await queryClient.prefetchQuery({
                queryKey: ["offerAllocation", offerId],
                queryFn: () => fetchOfferAllocationSsr(offerId, token),
            });
            
            const userId = account.userId;
            await queryClient.prefetchQuery({
                queryKey: ["userAllocation", offerId, userId],
                queryFn: () => fetchUserInvestmentSsr(offerId, token),
            });

            const offerAllocation = queryClient.getQueryData(["offerAllocation", offerId]);
            const userAllocation = queryClient.getQueryData(["userAllocation", offerId, userId]);

            if (!(offerAllocation.alloFilled >= 0) || !(userAllocation.invested.booked >= 0)) {
                throw Error("Data not fetched");
            }

            return {
                additionalProps: {
                    dehydratedState: dehydrate(queryClient),
                    state: {
                        offerId,
                    }
                },
            };
        } catch (error) {
            return {
                redirect: {
                    permanent: true,
                    destination: routes.Opportunities,
                },
            };
        }
    };

    return await processServerSideData(req, res, resolvedUrl, customLogicCallback);
};

AppOfferDetails.getLayout = function (page) {
    return <AppLayout title="Opportunities">{page}</AppLayout>;
};