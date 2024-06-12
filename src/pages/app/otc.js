import { useEffect } from "react";
import { useRouter } from "next/router";
import { dehydrate, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryCache";
import { AppLayout, Metadata } from "@/v2/components/Layout";
import Empty from "@/components/App/Empty";
import Loader from "@/components/App/Loader";
import { processServerSideData } from "@/lib/serverSideHelpers";
import routes from "@/routes";
import { getMarkets } from "@/v2/fetchers/otc";

import OTCMarket from "@/v2/modules/otc/OTCMarket";

// @TODO - Modals
// const { offers, vault, currentMarket, session, refetchOffers, offersIsSuccess, vaultIsSuccess, table } = propOffers;
//         // const [isMakeOfferModal, setIsMakeOfferModal] = useState(false);
// const [isCancelOfferModal, setIsCancelOfferModal] = useState(false);
// const [isTakeOfferModal, setIsTakeOfferModal] = useState(false);
// const [offerDetails, setOfferDetails] = useState(false);
// const openCancel = (offer) => {
//     setOfferDetails(offer);
//     setIsCancelOfferModal(true);
// };

// const openTake = (offer) => {
//     setOfferDetails(offer);
//     setIsTakeOfferModal(true);
// };

// const haveAllocation = vault && currentMarket ? vault.find((el) => el.id === currentMarket.offerId) : null;

// const makeOfferProps = { ...propOffers, allocation: haveAllocation };
// const interactOfferProps = { ...propOffers, offerDetails };
// const filters = ['filter-1', 'filter-2']

{
    /* <MakeOfferModal
                model={isMakeOfferModal}
                setter={() => {
                    setIsMakeOfferModal(false);
                }}
                props={{ ...makeOfferProps }}
            />
            <CancelOfferModal
                model={isCancelOfferModal}
                setter={() => {
                    setIsCancelOfferModal(false);
                }}
                props={{ ...interactOfferProps }}
            />
            <TakeOfferModal
                model={isTakeOfferModal}
                setter={() => {
                    setIsTakeOfferModal(false);
                }}
                props={{ ...interactOfferProps }}
            /> */
}

//     const { isSuccess: vaultIsSuccess, data: vault, refetch: refetchVault } = useQuery({
//         queryKey: ["userVault", USER_ID],
//         queryFn: fetchVault,
//         refetchOnMount: false,
//         refetchOnWindowFocus: false,
//         cacheTime: 0,
//         staleTime: 0,
//     });

export default function AppOtc({ session }) {
    const router = useRouter();
    const { market } = router.query;
    const { userId: USER_ID } = session;

    const { isLoading: otcIsLoading, data: otc } = useQuery({
        queryKey: ["otcMarkets", USER_ID],
        queryFn: () => getMarkets(),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 4 * 60 * 60 * 1000,
        staleTime: 3 * 60 * 60 * 1000,
    });

    const currentMarket = otc?.find((el) => el.slug === market) ?? null;

    useEffect(() => {
        if (!currentMarket && otc && otc[0]?.slug)
            router.push(`${routes.OTC}/?market=${otc[0].slug}`, undefined, { shallow: true });
    }, [otc, currentMarket]);

    if (otcIsLoading || !currentMarket) {
        return (
            <>
                <Metadata title="Loading" />
                <Loader />
            </>
        );
    }

    if (otc.length === 0) {
        return (
            <div className="col-span-12 max-h-[40vh]">
                <Metadata title="OTC Market" />
                <Empty />
            </div>
        );
    }

    return <OTCMarket session={session} otc={otc} currentMarket={currentMarket} />;
}

export const getServerSideProps = async ({ req, res }) => {
    const customLogicCallback = async (account, token) => {
        const userId = account?.userId;

        await queryClient.prefetchQuery(["otcMarkets", userId], () => getMarkets(token));

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
