import { dehydrate, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
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

    //todo: check if fetching right data
    const {
        isSuccess: offerDetailsState,
        data: offerData,
        error: errorOfferDetails,
        refetch: refetchOfferDetails,
    } = useQuery({
        queryKey: ["offerDetails", slug],
        queryFn: () => fetchOfferDetails(slug),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 30 * 60 * 1000,
        staleTime: 15 * 60 * 1000,
    });

    const phases = usePhaseTimelineMemo(offerData);
    const { phaseCurrent, phaseNext, offerClosed, phaseRefresh } = usePhaseInvestmentMemo(phases, offerData);

    const offerId = offerData?.id;

    const {
        isSuccess: offerAllocationState,
        data: allocation,
        error: errorOfferAllocation,
        refetch: refetchOfferAllocation,
    } = useQuery({
        queryKey: ["offerAllocation", offerId],
        queryFn: () => fetchOfferAllocation(offerId),
        refetchOnMount: false,
        refetchOnWindowFocus: true,
        // refetchInterval: 15000,
        refetchInterval: offerClosed ? false : 15000,
    });

    const {
        isSuccess: userAllocationState,
        data: userAllocation,
        refetch: refetchUserAllocation,
        error: errorUserAllocation,
    } = useQuery({
        queryKey: ["userAllocation", offerId, userId],
        queryFn: () => fetchUserInvestment(offerData?.id),
        refetchOnMount: false,
        refetchOnWindowFocus: !offerClosed,
        enabled: !!offerData?.id,
    });

    const { data: premiumData, refetch: refetchPremiumData } = useQuery({
        queryKey: ["premiumOwned", userId, tenantId],
        queryFn: fetchStoreItemsOwned,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 5 * 1000,
    });

    useEffect(() => {
        try {
            if (errorOfferDetails) {
                refetchOfferDetails().then((el) => {
                    if (errorOfferDetails) {
                        throw Error("Offer details fetch fail");
                    }
                });
            }
            if (errorOfferAllocation) {
                refetchOfferAllocation().then((el) => {
                    if (errorOfferAllocation) {
                        throw Error("Offer allocations fetch fail");
                    }
                });
            }
            if (errorUserAllocation) {
                refetchUserAllocation().then((el) => {
                    if (errorUserAllocation) {
                        throw Error("User allocations fetch fail");
                    }
                });
            }
        } catch (error) {
            router.push(PAGE.Opportunities);
        }
    }, [errorOfferDetails, errorOfferAllocation, errorUserAllocation]);

    const guaranteedUsed = userAllocation?.upgrades?.find((el) => el.id === PremiumItemsENUM.Guaranteed);
    const increasedUsed = userAllocation?.upgrades?.find((el) => el.id === PremiumItemsENUM.Increased);

    const paramsBar = {
        offerData,
        phaseCurrent,
        phaseNext,
        offerClosed,
        phaseRefresh,
    };

    const paramsInvest = {
        offerData,
        refetchUserAllocation,
        userAllocationState,
        refetchOfferAllocation,
        userInvested: userAllocation,
        allocation,
        session,
        upgradesUse: { guaranteedUsed, increasedUsed },
        phaseCurrent,
        premiumData,
        refetchPremiumData,
    };

    const paramsParams = {
        offer: offerData,
        allocation,
        userInvested: userAllocation?.invested,
        offerClosed,
        refetchUserAllocation,
    };

    const renderPage = () => {
        if (!offerDetailsState || !offerAllocationState || !userAllocationState || !phaseNext) return <Loader />;
        if (!offerData?.id || Object.keys(offerData).length === 0) return <Empty />;

        return (
            <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
                <OfferDetailsTopBar paramsBar={paramsBar} />
                <div className="bordered-container bg flex flex-row col-span-12 lg:col-span-7 xl:col-span-8">
                    {!phaseIsClosed ? (
                        <OfferDetailsInvestPhases paramsInvestPhase={paramsInvest} />
                    ) : (
                        <OfferDetailsInvestClosed />
                    )}
                </div>
                <div className="flex flex-col col-span-12 lg:col-span-5 xl:col-span-4">
                    <OfferDetailsParams paramsParams={paramsParams} />
                </div>
                <div className="flex flex-col col-span-12">
                    <OfferDetailsDetails offer={offerData} />
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (!offerData?.ok) {
            router.push(routes.Opportunities);
        }
        feedPhases();
    }, [offerData, allocation?.isSettled, allocation?.isPaused]);

    const pageTitle = `${!offerDetailsState ? "Loading" : offerData?.name}  - Invest - ${getCopy("NAME")}`;
    return (
        <>
            <NextSeo title={pageTitle} />
            <InvestProvider initialData={offerId}>{renderPage()}</InvestProvider>
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
