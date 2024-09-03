import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { create } from 'zustand';
import { dehydrate, useQuery } from "@tanstack/react-query";
import { useCookies } from 'react-cookie';

import { AppLayout, Metadata } from "@/v2/components/Layout";
import { processServerSideData } from "@/lib/serverSideHelpers";
import { queryClient } from "@/lib/queryCache";
import { fetchOfferAllocation, fetchOfferAllocationSsr, fetchOfferDetails, fetchOfferDetailsSsr } from "@/fetchers/offer.fetcher";
import { fetchUserInvestment, fetchUserInvestmentSsr } from "@/fetchers/vault.fetcher";
import { fetchStoreItemsOwned } from "@/fetchers/store.fetcher";
import { routes } from "@/v2/routes";

import usePhaseTimeline from "@/v2/hooks/usePhaseTimeline"
import usePhaseInvestment from "@/v2/hooks/usePhaseInvestment"

// import { phases } from "@/lib/phases";

// const useInvestmentStore = create((set) => ({
//     bookingCookie: null,
//     setBookingCookie: (cookie) => set({ bookingCookie: cookie }),
//     clearBookingCookie: () => set({ bookingCookie: null }),
// }));

// const useInvestmentContext = () => {
//     const [cookies, setCookie, removeCookie] = useCookies(['investmentBooking']);
//     const { bookingCookie, setBookingCookie, clearBookingCookie } = useInvestmentStore();

//     useEffect(() => {
//         if (cookies.investmentBooking) {
//             setBookingCookie(cookies.investmentBooking);
//         }
//     }, [cookies.investmentBooking, setBookingCookie]);

//     const handleSuccessfulTransaction = () => {
//         clearBookingCookie();
//         removeCookie('investmentBooking');
//     };

//     return {
//         handleSuccessfulTransaction,
//     };   
// }

export default function AppOfferDetails({ session }) {
    const router = useRouter();
    const { slug } = router.query;
    const { userId, tenantId } = session;

    const {
        isSuccess: offerDetails_isSuccess,
        data: offerDetails,
        error: offerDetails_error,
        refetch: offerDetails_refetch,
    } = useQuery({
        queryKey: ["offerDetails", slug],
        queryFn: () => fetchOfferDetails(slug),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 30 * 60 * 1000,
        staleTime: 15 * 60 * 1000,
    });


    // Does usePhaseInvestment needs offerAllocation?
    const phases = usePhaseTimeline(offerDetails);
    const phasesData = usePhaseInvestment(phases, offerDetails);
    // const phasesData = usePhaseInvestment(phases, { ...offerDetail, ...offerAllocation });

    // Store all of those data in zustand?
    const offerId = offerDetails?.id;
    const isExtraQueryEnabled = !!offerDetails?.id;
    const offerIsClosed = phasesData?.offerClosed;
    const isAllocationRefetchEnabled = offerIsClosed ? false : 15000;
    
    const {
        isSuccess: offerAllocation_isSuccess,
        data: offerAllocation,
        error: offerAllocation_error,
        refetch: offerAllocation_refetch,
    } = useQuery({
        queryKey: ["offerAllocation", offerId],
        queryFn: () => fetchOfferAllocation(offerId),
        refetchOnMount: false,
        refetchOnWindowFocus: true,
        refetchInterval: isAllocationRefetchEnabled,
        enabled: isExtraQueryEnabled,
    });

    const {
        isSuccess: userAllocation_isSuccess,
        data: userAllocation,
        refetch: userAllocation_refetch,
        error: userAllocation_error,
    } = useQuery({
        queryKey: ["userAllocation", offerId, userId],
        queryFn: () => fetchUserInvestment(offerDetails?.id),
        refetchOnMount: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 15 * 1000,
        refetchOnWindowFocus: !offerIsClosed,
        enabled: isExtraQueryEnabled,
    });

    const {
        isSuccess: userUpgrades_isSuccess,
        data: userUpgrades,
        refetch: userUpgrades_refetch,
        error: userUpgrades_error,
    } = useQuery({
        queryKey: ["premiumOwned", userId, tenantId],
        queryFn: fetchStoreItemsOwned,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        try {
            if (offerDetails_error) {
                offerDetails_refetch().then((el) => {
                    if (offerDetails_error) {
                        throw Error("Offer details fetch fail");
                    }
                });
            }
            if (offerAllocation_error) {
                offerAllocation_refetch().then((el) => {
                    if (offerAllocation_error) {
                        throw Error("Offer allocations fetch fail");
                    }
                });
            }
            if (userAllocation_error) {
                userAllocation_refetch().then((el) => {
                    if (userAllocation_error) {
                        throw Error("User allocations fetch fail");
                    }
                });
            }
        } catch (error) {
            router.push(PAGE.Opportunities);
        }
    }, [offerDetails_error, offerAllocation_error, userAllocation_error]);

    const guaranteedUsed = userAllocation?.upgrades?.find((el) => el.id === PremiumItemsENUM.Guaranteed);
    const increasedUsed = userAllocation?.upgrades?.find((el) => el.id === PremiumItemsENUM.Increased);

    return (
        <div className="text-white">
            <Overview />
            <div>Phases</div>
            <div>Invest</div>
            <div>Fundraise Goal</div>
            <div>Vesting Details</div>
            <div>History</div>
        </div>
    )
}

const Overview = () => {
    const router = useRouter();
    const { slug } = router.query;

    const {
        isSuccess: offerDetails_isSuccess,
        data: offerDetails,
        error: offerDetails_error,
        refetch: offerDetails_refetch,
    } = useQuery({
        queryKey: ["offerDetails", slug],
        queryFn: () => fetchOfferDetails(slug),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 30 * 60 * 1000,
        staleTime: 15 * 60 * 1000,
    });

    return (
        <div className="p-8 bg-slate-500">
            <h2>{offerDetails.name}</h2>
            <p>{offerDetails.genre}</p>
            <p>{offerDetails.description ?? 'No description'}</p>
            <p>Live: ?</p>
            <p>Website: {offerDetails.url_web}</p>
            <p>Discord: {offerDetails.url_discord}</p>
            <p>Twitter: {offerDetails.url_twitter}</p>
        </div>
    );
};

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
                },
            };
        } catch (error) {

            console.log('error', error)

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

// import { dehydrate, useQuery } from "@tanstack/react-query";
// import { useRouter } from "next/router";
// import { NextSeo } from "next-seo";
// import { useEffect } from "react";
// import LayoutApp from "@/components/Layout/LayoutApp";
// import {
//     fetchOfferAllocation,
//     fetchOfferAllocationSsr,
//     fetchOfferDetails,
//     fetchOfferDetailsSsr,
// } from "@/fetchers/offer.fetcher";
// import { fetchUserInvestment, fetchUserInvestmentSsr } from "@/fetchers/vault.fetcher";
// import Loader from "@/components/App/Loader";
// import Empty from "@/components/App/Empty";

// import { getCopy } from "@/lib/seoConfig";
// import { PremiumItemsENUM } from "@/lib/enum/store";
// import { queryClient } from "@/lib/queryCache";
// import { processServerSideData } from "@/lib/serverSideHelpers";
// import OfferDetailsTopBar from "@/components/App/Offer/OfferDetailsTopBar";
// import { OfferDetailsParams } from "@/components/App/Offer/OfferDetailsParams";
// import OfferDetailsInvestPhases from "@/components/App/Offer/OfferDetailsInvestPhases";
// import OfferDetailsInvestClosed from "@/components/App/Offer/OfferDetailsInvestClosed";
// import OfferDetailsDetails from "@/components/App/Offer/OfferDetailsAbout";
// import { InvestProvider } from "@/components/App/Offer/InvestContext";

// import usePhaseTimelineMemo from "@/lib/hooks/usePhaseTimelineMemo";
// import usePhaseInvestmentMemo from "@/lib/hooks/usePhaseInvestmentMemo";

// export const AppOfferDetails = ({ session }) => {


//     useEffect(() => {
//         try {
//             if (offerDetails_error) {
//                 offerDetails_refetch().then((el) => {
//                     if (offerDetails_error) {
//                         throw Error("Offer details fetch fail");
//                     }
//                 });
//             }
//             if (offerAllocation_error) {
//                 offerAllocation_refetch().then((el) => {
//                     if (offerAllocation_error) {
//                         throw Error("Offer allocations fetch fail");
//                     }
//                 });
//             }
//             if (userAllocation_error) {
//                 userAllocation_refetch().then((el) => {
//                     if (userAllocation_error) {
//                         throw Error("User allocations fetch fail");
//                     }
//                 });
//             }
//         } catch (error) {
//             router.push(PAGE.Opportunities);
//         }
//     }, [offerDetails_error, offerAllocation_error, userAllocation_error]);

//     const guaranteedUsed = userAllocation?.upgrades?.find((el) => el.id === PremiumItemsENUM.Guaranteed);
//     const increasedUsed = userAllocation?.upgrades?.find((el) => el.id === PremiumItemsENUM.Increased);

//     const investmentContextData = {
//         offerDetails,
//         offerAllocation,
//         offerAllocation_refetch,
//         userAllocation,
//         userAllocation_refetch,
//         userUpgrades,
//         userUpgrades_refetch,
//         phases,
//         phasesData,
//     };

//     console.log("investmentContextData", investmentContextData);

//     const renderPage = () => {
//         if (
//             !offerDetails_isSuccess ||
//             !offerAllocation_isSuccess ||
//             !userAllocation_isSuccess ||
//             !phasesData?.phaseNext
//         )
//             return <Loader />;
//         if (!offerDetails?.id || Object.keys(offerDetails).length === 0) return <Empty />;

//         return (
//             <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
//                 {/*<OfferDetailsTopBar paramsBar={paramsBar} />*/}
//                 {/*<div className="bordered-container bg flex flex-row col-span-12 lg:col-span-7 xl:col-span-8">*/}
//                 {/*    {!phaseIsClosed ? (*/}
//                 {/*        <OfferDetailsInvestPhases paramsInvestPhase={paramsInvest} />*/}
//                 {/*    ) : (*/}
//                 {/*        <OfferDetailsInvestClosed />*/}
//                 {/*    )}*/}
//                 {/*</div>*/}
//                 {/*<div className="flex flex-col col-span-12 lg:col-span-5 xl:col-span-4">*/}
//                 {/*    <OfferDetailsParams paramsParams={paramsParams} />*/}
//                 {/*</div>*/}
//                 {/*<div className="flex flex-col col-span-12">*/}
//                 {/*    <OfferDetailsDetails offer={offerDetails} />*/}
//                 {/*</div>*/}
//             </div>
//         );
//     };

//     const pageTitle = `${!offerDetails_isSuccess ? "Loading" : offerDetails?.name}  - Invest - ${getCopy("NAME")}`;
//     return (
//         <>
//             <NextSeo title={pageTitle} />
//             <InvestProvider offerData={investmentContextData}>{renderPage()}</InvestProvider>
//         </>
//     );
// };


// export default AppOfferDetails;
// import { useEffect } from 'react';
// import { useCookies } from 'react-cookie';
// import { create } from 'zustand';
// import moment from 'moment';

// const useInvestmentStore = create((set) => ({
//     bookingCookie: null,
//     setBookingCookie: (cookie) => set({ bookingCookie: cookie }),
//     clearBookingCookie: () => set({ bookingCookie: null }),
// }));

// const useOfferDetailsStore = create((set) => ({
//     offerDetails: null,
//     setOfferDetails: (details) => set({ offerDetails: details }),
// }));

// const usePhasesStore = create((set) => ({
//     phases: [],
//     setPhases: (phases) => set({ phases }),
// }));

// const usePhaseDataStore = create((set) => ({
//     phaseData: {},
//     setPhaseData: (data) => set({ phaseData: data }),
// }));

// const usePhaseTimeline = (offerDetails) => {
//     const { d_open, d_close, isLaunchpad, lengthWhales, lengthRaffle, lengthFCFS, lengthUnlimitedSlowdown } = offerDetails;
//     const phases = [];

//     if (!isLaunchpad && lengthWhales) {
//         const startWhales = moment.unix(d_open).subtract(lengthWhales, "seconds");
//         phases.push({ ...Phases[PhaseId.Whale], phaseId: PhaseId.Whale, startDate: startWhales.unix() });
//     }

//     if (lengthRaffle) {
//         const raffleStartOffset = lengthWhales && !isLaunchpad ? lengthWhales : 0;
//         const startRaffle = moment.unix(d_open).subtract(raffleStartOffset + lengthRaffle, "seconds");
//         phases.push({ ...Phases[PhaseId.Raffle], phaseId: PhaseId.Raffle, startDate: startRaffle.unix() });
//     }

//     if (isLaunchpad) {
//         phases.push({ ...Phases[PhaseId.Open], phaseId: PhaseId.Open, startDate: d_open });
//     } else {
//         phases.push({ ...Phases[PhaseId.FCFS], phaseId: PhaseId.FCFS, startDate: d_open });
//     }

//     if (lengthFCFS) {
//         const startFCFS = moment.unix(d_open).add(lengthFCFS, "seconds");
//         if (lengthUnlimitedSlowdown) {
//             phases.push({ ...Phases[PhaseId.UnlimitedSlow], phaseId: PhaseId.UnlimitedSlow, startDate: startFCFS.unix() });
//             const startUnlimited = startFCFS.add(lengthUnlimitedSlowdown, "seconds");
//             phases.push({ ...Phases[PhaseId.Unlimited], phaseId: PhaseId.Unlimited, startDate: startUnlimited.unix() });
//         } else {
//             phases.push({ ...Phases[PhaseId.Unlimited], phaseId: PhaseId.Unlimited, startDate: startFCFS.unix() });
//         }
//     }

//     phases.push({ ...Phases[PhaseId.Closed], phaseId: PhaseId.Closed, startDate: d_close });

//     return phases.sort((a, b) => a.startDate - b.startDate);
// };

// const usePhaseInvestment = (phases, offerDetails) => {
//     const [cookies, setCookie, removeCookie] = useCookies(['investmentBooking']);
//     const { bookingCookie, setBookingCookie, clearBookingCookie } = useInvestmentStore();
//     const { setPhaseData } = usePhaseDataStore();

//     useEffect(() => {
//         if (cookies.investmentBooking) {
//             setBookingCookie(cookies.investmentBooking);
//         }
//     }, [cookies.investmentBooking, setBookingCookie]);

//     const handleSuccessfulTransaction = () => {
//         clearBookingCookie();
//         removeCookie('investmentBooking');
//     };

//     const phaseData = {
//         offerClosed: phases.some(phase => phase.phaseId === PhaseId.Closed),
//         phaseNext: phases.find(phase => phase.startDate > Date.now() / 1000),
//     };

//     setPhaseData(phaseData);

//     return { phaseData, handleSuccessfulTransaction };
// };

// export default function AppOfferDetails(props) {
//     const { offerDetails } = props;
//     const { setOfferDetails } = useOfferDetailsStore();
//     const { setPhases } = usePhasesStore();

//     useEffect(() => {
//         setOfferDetails(offerDetails);
//         const phases = usePhaseTimeline(offerDetails);
//         setPhases(phases);
//         usePhaseInvestment(phases, offerDetails);
//     }, [offerDetails, setOfferDetails, setPhases]);

//     return (
//         <div>test</div>
//     );
// }
