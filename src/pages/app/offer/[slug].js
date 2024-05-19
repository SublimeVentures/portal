import { dehydrate, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useEffect } from "react";
import LayoutApp from "@/components/Layout/LayoutApp";
import {
    fetchOfferAllocation,
    fetchOfferAllocationSsr,
    fetchOfferDetails,
    fetchOfferDetailsSsr,
} from "@/fetchers/offer.fetcher";
import { fetchUserInvestment, fetchUserInvestmentSsr } from "@/fetchers/vault.fetcher";
import Loader from "@/components/App/Loader";
import Empty from "@/components/App/Empty";
import routes from "@/routes";
import PAGE from "@/routes";
import { getCopy } from "@/lib/seoConfig";
import { PremiumItemsENUM } from "@/lib/enum/store";
import { queryClient } from "@/lib/queryCache";
import { processServerSideData } from "@/lib/serverSideHelpers";
import OfferDetailsTopBar from "@/components/App/Offer/OfferDetailsTopBar";
import { OfferDetailsParams } from "@/components/App/Offer/OfferDetailsParams";
import OfferDetailsInvestPhases from "@/components/App/Offer/OfferDetailsInvestPhases";
import OfferDetailsInvestClosed from "@/components/App/Offer/OfferDetailsInvestClosed";
import OfferDetailsDetails from "@/components/App/Offer/OfferDetailsAbout";
import { InvestProvider } from "@/components/App/Offer/InvestContext";
import { fetchStoreItemsOwned } from "@/fetchers/store.fetcher";
import usePhaseTimelineMemo from "@/lib/hooks/usePhaseTimelineMemo";
import usePhaseInvestmentMemo from "@/lib/hooks/usePhaseInvestmentMemo";

export const AppOfferDetails = ({ session }) => {
    const router = useRouter();
    const { slug } = router.query;
    const { userId, tenantId } = session;
    console.log("userId", userId);
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

    const phases = usePhaseTimelineMemo(offerDetails);
    const phasesData = usePhaseInvestmentMemo(phases, offerDetails);

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
        enabled: isExtraQueryEnabled,
        refetchOnMount: false,
        refetchOnWindowFocus: true,
        refetchInterval: isAllocationRefetchEnabled,
    });

    const {
        isSuccess: userAllocation_isSuccess,
        data: userAllocation,
        refetch: userAllocation_refetch,
        error: userAllocation_error,
    } = useQuery({
        queryKey: ["userAllocation", offerId, userId],
        queryFn: () => fetchUserInvestment(offerDetails?.id),
        enabled: isExtraQueryEnabled,
        refetchOnMount: false,
        refetchOnWindowFocus: !offerIsClosed,
        cacheTime: 5 * 60 * 1000,
        staleTime: 15 * 1000,
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

    const investmentContextData = {
        offerDetails,
        offerAllocation,
        offerAllocation_refetch,
        userAllocation,
        userAllocation_refetch,
        userUpgrades,
        userUpgrades_refetch,
        phases,
        phasesData,
    };

    console.log("investmentContextData", investmentContextData);

    //     const paramsBar = {
    //         offerDetails,
    //         phaseCurrent,
    //         phaseNext,
    //         offerClosed,
    //         phaseRefresh,
    //     };
    //
    //     const paramsInvest = {
    //         offerDetails,
    //         userAllocation_refetch,
    //         userAllocation_isSuccess,
    //         offerAllocation_refetch,
    //         userInvested: userAllocation,
    //         allocation,
    //         session,
    //         upgradesUse: { guaranteedUsed, increasedUsed },
    //         phaseCurrent,
    //         premiumData,
    //         refetchPremiumData,
    //     };
    //
    //     const paramsParams = {
    //         offer: offerDetails,
    //         allocation,
    //         userInvested: userAllocation?.invested,
    //         offerClosed,
    //         userAllocation_refetch,
    //     };
    //
    const renderPage = () => {
        if (
            !offerDetails_isSuccess ||
            !offerAllocation_isSuccess ||
            !userAllocation_isSuccess ||
            !phasesData?.phaseNext
        )
            return <Loader />;
        if (!offerDetails?.id || Object.keys(offerDetails).length === 0) return <Empty />;

        return (
            <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
                {/*<OfferDetailsTopBar paramsBar={paramsBar} />*/}
                {/*<div className="bordered-container bg flex flex-row col-span-12 lg:col-span-7 xl:col-span-8">*/}
                {/*    {!phaseIsClosed ? (*/}
                {/*        <OfferDetailsInvestPhases paramsInvestPhase={paramsInvest} />*/}
                {/*    ) : (*/}
                {/*        <OfferDetailsInvestClosed />*/}
                {/*    )}*/}
                {/*</div>*/}
                {/*<div className="flex flex-col col-span-12 lg:col-span-5 xl:col-span-4">*/}
                {/*    <OfferDetailsParams paramsParams={paramsParams} />*/}
                {/*</div>*/}
                {/*<div className="flex flex-col col-span-12">*/}
                {/*    <OfferDetailsDetails offer={offerDetails} />*/}
                {/*</div>*/}
            </div>
        );
    };
    //
    //     useEffect(() => {
    //         if (!offerDetails?.ok) {
    //             router.push(routes.Opportunities);
    //         }
    //         feedPhases();
    //     }, [offerDetails, allocation?.isSettled, allocation?.isPaused]);
    //
    const pageTitle = `${!offerDetails_isSuccess ? "Loading" : offerDetails?.name}  - Invest - ${getCopy("NAME")}`;
    return (
        <>
            <NextSeo title={pageTitle} />
            <InvestProvider offerData={investmentContextData}>{renderPage()}</InvestProvider>
        </>
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

            if (!offerId) {
                throw Error("Offer not specified");
            }

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
    return <LayoutApp>{page}</LayoutApp>;
};

export default AppOfferDetails;
