import { dehydrate, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import LayoutApp from "@/components/Layout/LayoutApp";
import { fetchOfferAllocationSsr, fetchOfferDetails, fetchOfferDetailsSsr } from "@/fetchers/offer.fetcher";
import { fetchUserInvestment, fetchUserInvestmentSsr } from "@/fetchers/vault.fetcher";
import Loader from "@/components/App/Loader";
import Empty from "@/components/App/Empty";
import { Phases } from "@/lib/phases";
import routes from "@/routes";
import PAGE from "@/routes";
import { getCopy } from "@/lib/seoConfig";
import { queryClient } from "@/lib/queryCache";
import { processServerSideData } from "@/lib/serverSideHelpers";
import OfferDetailsTopBar from "@/components/App/Offer/OfferDetailsTopBar";
import { OtcOfferDetailsParams } from "@/components/App/Otc/OtcOfferDetailsParams";
import OfferDetailsDetails from "@/components/App/Offer/OfferDetailsAbout";
import { InvestProvider } from "@/components/App/Offer/InvestContext";
import OtcOfferVesting from "@/components/App/Otc/OtcOfferVesting";

export const AppOfferDetails = ({ session }) => {
    const router = useRouter();
    const { slug } = router.query;
    const { userId } = session;

    let [phaseIsClosed] = useState(true);
    let [phaseCurrent] = useState(Phases.Closed);
    let [phaseNext] = useState(Phases.Closed);

    const {
        isSuccess: offerDetailsState,
        data: offerData,
        error: errorOfferDetails,
        refetch: refetchOfferDetails,
    } = useQuery({
        queryKey: ["otcOfferDetails", slug],
        queryFn: () => fetchOfferDetails(slug),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 30 * 60 * 1000,
        staleTime: 15 * 60 * 1000,
    });

    const offerId = offerData?.id;

    const {
        isSuccess: userAllocationState,
        data: userAllocation,
        refetch: refetchUserAllocation,
        error: errorUserAllocation,
    } = useQuery({
        queryKey: ["userAllocation", offerId, userId],
        queryFn: () => fetchUserInvestment(offerData?.id),
        refetchOnMount: false,
        refetchOnWindowFocus: !phaseIsClosed,
        enabled: !!offerData?.id,
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
            if (errorUserAllocation) {
                refetchUserAllocation().then((el) => {
                    if (errorUserAllocation) {
                        throw Error("User allocations fetch fail");
                    }
                });
            }
        } catch (error) {
            router.push(PAGE.OTC);
        }
    }, [errorOfferDetails, errorUserAllocation]);

    const paramsBar = {
        offer: offerData,
        phaseCurrent,
        phaseNext,
        phaseIsClosed,
        refreshInvestmentPhase: () => {},
    };

    const paramsParams = {
        offer: offerData,
        //todo: user investment
    };

    const renderPage = () => {
        if (!offerDetailsState || !userAllocationState || !phaseNext) return <Loader />;
        if (!offerData?.id || Object.keys(offerData).length === 0) return <Empty />;

        return (
            <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
                <OfferDetailsTopBar paramsBar={paramsBar} />
                <div className="bordered-container bg flex flex-row col-span-12 lg:col-span-7 xl:col-span-8">
                    <OtcOfferVesting />
                </div>
                <div className="flex flex-col col-span-12 lg:col-span-5 xl:col-span-4">
                    <OtcOfferDetailsParams paramsParams={paramsParams} />
                </div>
                <div className="flex flex-col col-span-12">
                    <OfferDetailsDetails offer={offerData} />
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (!offerData?.ok) {
            router.push(routes.OTC);
        }
    }, [offerData]);

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

        //todo: check if otc !=1

        try {
            await queryClient.prefetchQuery({
                queryKey: ["otcOfferDetails", slug],
                queryFn: () => fetchOfferDetailsSsr(slug, token),
                cacheTime: 30 * 60 * 1000,
                staleTime: 15 * 60 * 1000,
            });
            const offerDetails = queryClient.getQueryData(["otcOfferDetails", slug]);

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
