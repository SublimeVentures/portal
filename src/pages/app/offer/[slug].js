import { dehydrate } from "@tanstack/react-query";
import { initStore } from "@/v2/modules/offer/store";
import { AppLayout, Metadata } from "@/v2/components/Layout";
import { processServerSideData } from "@/lib/serverSideHelpers";
import { queryClient } from "@/lib/queryCache";
import { fetchOfferAllocationSsr, fetchOfferDetailsSsr } from "@/fetchers/offer.fetcher";
import { fetchUserInvestmentSsr } from "@/fetchers/vault.fetcher";
import { routes } from "@/v2/routes";
import { Overview, Phases, Invest, Fundraise, Vesting, History, Report } from "@/v2/modules/offer";
import { offersKeys } from "@/v2/constants";

export default function AppOfferDetails({ session, state }) {
    initStore({ session, ...state });

    return (
        <>
            <Metadata title="Opportunity" />
            <div className="text-white flex flex-col md:grid md:grid-cols-12 gap-4 grow lg:overflow-y-auto lg:-mx-5 lg:px-5 lg:pr-3 lg:-mt-4 lg:pt-4 lg:pb-4 3xl:-mx-8 3xl:pl-8 3xl:pr-6 3xl:-mt-2 3xl:pt-2 3xl:pb-4 lg:mb-10">
                <Overview className="col-span-12" />
                <Phases className="col-span-12" />
                <Invest className="col-span-7 xl:col-span-8 3xl:col-span-9" session={session} />
                <Fundraise className="col-span-5 xl:col-span-4 3xl:col-span-3" />
                <Vesting className="col-span-12 xl:col-span-4" />
                <History className="col-span-12 xl:col-span-8" />
                <Report className="col-span-12" />
            </div>
        </>
    );
}

export const getServerSideProps = async ({ req, res, resolvedUrl, query }) => {
    const customLogicCallback = async (account, token) => {
        const slug = query.slug;

        try {
            await queryClient.prefetchQuery({
                queryKey: offersKeys.offerDetails(slug),
                queryFn: () => fetchOfferDetailsSsr(slug, token),
                cacheTime: 30 * 60 * 1000,
                staleTime: 15 * 60 * 1000,
            });

            const offer = queryClient.getQueryData(offersKeys.offerDetails(slug));
            const offerId = offer.id;

            if (!offerId) throw Error("Offer not specified");

            await queryClient.prefetchQuery({
                queryKey: offersKeys.offerAllocation(offerId),
                queryFn: () => fetchOfferAllocationSsr(offerId, token),
            });

            const userId = account.userId;
            await queryClient.prefetchQuery({
                queryKey: ["userAllocation", offerId, userId],
                queryFn: () => fetchUserInvestmentSsr(offerId, token),
            });

            const allocation = queryClient.getQueryData(offersKeys.offerAllocation(offerId));
            const userAllocation = queryClient.getQueryData(["userAllocation", offerId, userId]);

            if (!(allocation.alloFilled >= 0) || !(userAllocation.invested.booked >= 0)) {
                throw Error("Data not fetched");
            }

            return {
                additionalProps: {
                    dehydratedState: dehydrate(queryClient),
                    state: {
                        offer,
                        allocation,
                        userAllocation,
                    },
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
