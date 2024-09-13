import { dehydrate } from "@tanstack/react-query";

import { initStore } from "@/v2/modules/offer/store";
import { AppLayout, Metadata } from "@/v2/components/Layout";
import { processServerSideData } from "@/lib/serverSideHelpers";
import { queryClient } from "@/lib/queryCache";
import { fetchOfferAllocationSsr, fetchOfferDetailsSsr } from "@/fetchers/offer.fetcher";
import { fetchUserInvestmentSsr } from "@/fetchers/vault.fetcher";
import { routes } from "@/v2/routes";

import { Overview, Phases, Invest, Fundraise, Vesting, History } from "@/v2/modules/offer";
export default function AppOfferDetails({ session, state }) {
    initStore({
        offerId: state.offerId,
        userAllocation: state.userAllocation,
    });

    return (
        <>
            <Metadata title="Opportunity" />
            <div className="text-white flex flex-col md:grid md:grid-cols-12 gap-4">
                <Overview className="col-span-12" />
                <Phases className="col-span-12" />
                <Invest className="col-span-7" session={session} />
                <Fundraise className="col-span-5" />
                <Vesting className="col-span-4" />
                <History className="col-span-8" />
            </div>
        </>
    );
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
                        offerAllocation,
                        userAllocation,
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

// @TODO - Store

// paramsInvestPhase
// - offer - query
// - phaseCurrent - phase hook
// - session - env hook?
// - refetchOfferAllocation - query / invalidate func
// - refetchUserAllocation - query / invalidate func
// - allocation - query
// - premiumData - query 
// - refetchPremiumData - query / invalidate func

// - userInvested - investment context?
// - userAllocationState - ?

// calculateModalProps
// - offer - query

// - investmentAmount - ?
// - allocationData - ? zustand ?

    // const restoreModalProps = {
    //     allocationOld: isRestoreModal.amount,
    //     investmentAmount,
    //     bookingExpire,
    //     bookingRestore,
    //     bookingCreateNew,
    // };
    // const errorModalProps = {
    //     code: isErrorModal.code,
    // };
    // const upgradesModalProps = {
    //     phaseCurrent,
    //     offer: offer,
    //     refetchUserAllocation,
    //     userAllocationState,
    //     upgradesUse,
    //     premiumData,
    //     refetchPremiumData,
    //     allocationUserLeft: allocationData.allocationUser_left,
    // };

    // const investModalProps = {
    //     investmentAmount,
    //     offer,
    //     selectedCurrency,
    //     bookingExpire,
    //     afterInvestmentCleanup,
    // };


//             <RestoreHashModal
//                 restoreModalProps={restoreModalProps}
//                 model={isRestoreModal.open}
//                 setter={() => {
//                     setRestoreModal({ open: false, amount: 0 });
//                 }}
//             />
//             <ErrorModal
//                 errorModalProps={errorModalProps}
//                 model={isErrorModal.open}
//                 setter={() => {
//                     setErrorModal({ open: false, code: null });
//                 }}
//             />
//             {network?.isSupported && selectedCurrency && (
//                 <InvestModal
//                     investModalProps={investModalProps}
//                     model={isInvestModal}
//                     setter={() => {
//                         setInvestModal(false);
//                     }}
//                 />
//             )}
//         </div>
//     );
// }

