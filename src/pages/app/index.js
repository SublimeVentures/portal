// import { useQuery } from "@tanstack/react-query";

// import dynamic from "next/dynamic";
// import LayoutApp from "@/components/Layout/LayoutApp";
// import VaultItem from "@/components/App/Vault/VaultItem";
// import { fetchVault } from "@/fetchers/vault.fetcher";
// import Loader from "@/components/App/Loader";
// import EmptyVault from "@/components/App/EmptyVault";
// import { processServerSideData } from "@/lib/serverSideHelpers";
// import routes from "@/routes";
// import { fetchStoreItemsOwned } from "@/fetchers/store.fetcher";
// import DetailsSidebar from "@/components/App/Vault/DetailsSidebar";

// const UserSummary = dynamic(() => import("@/components/App/Vault/UserSummary"), { ssr: false });

// export default function AppVault({ session }) {
//     const userId = session.userId;
//     const tenantId = session.tenantId;
//     const [claimModal, setClaimModal] = useState(false);
//     const [claimModalDetails, setClaimModalDetails] = useState({});

//     const {
//         isSuccess: isSuccessDataFeed,
//         data: vault,
//         refetch: refetchVault,
//     } = useQuery({
//         queryKey: ["userVault", userId],
//         queryFn: fetchVault,
//         refetchOnMount: true,
//         refetchOnWindowFocus: false,
//         cacheTime: 5 * 60 * 1000,
//         staleTime: 1 * 30 * 1000,
//     });

//     const { data: premiumData } = useQuery({
//         queryKey: ["premiumOwned", userId, tenantId],
//         queryFn: fetchStoreItemsOwned,
//         refetchOnMount: true,
//         refetchOnWindowFocus: false,
//         cacheTime: 5 * 60 * 1000,
//         staleTime: 1 * 60 * 1000,
//     });

//     const closeClaimModal = () => {
//         setClaimModal(false);
//         setTimeout(() => {
//             setClaimModalDetails({});
//         }, 400);
//     };
//     const openClaimModal = (data) => {
//         setClaimModalDetails(data);
//         setClaimModal(true);
//     };

//     const renderList = () => {
//         if (!vault) return;
//         return vault.map((el, i) => {
//             return <VaultItem item={el} key={el.name} passData={openClaimModal} />;
//         });
//     };

//     const placeHolder = () => {
//         if (!isSuccessDataFeed || vault === undefined) return <Loader />;
//         if (vault.length === 0)
//             return (
//                 <div className="flex flex-1 flex-col justify-center">
//                     <EmptyVault />
//                 </div>
//             );
//     };

//     const claimModalProps = {
//         ...claimModalDetails,
//         refetchVault,
//         vaultData: vault,
//     };

//     return (
//         <>
//             <UserSummary vault={vault} session={session} premiumData={premiumData} />
//             <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">{renderList()}</div>
//             <div className="col-span-12 text-center contents">{placeHolder()}</div>
//             <DetailsSidebar
//                 model={claimModal}
//                 setter={closeClaimModal}
//                 claimModalProps={claimModalProps}
//                 userId={userId}
//             /> */}
//             {/* <Header /> */}
//             <div className="text-white">children</div>
//         </>
//     );
// }

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { AppLayout } from "@/v2/components/Layout";
import { Metadata } from "@/v2/components/Layout";
import { processServerSideData } from "@/lib/serverSideHelpers";
import routes from "@/routes";

import { VaultDashboard, InvestmentsGrid, InvestmentsList } from "@/v2/components/App/Vault";

let mockedInvestments = [
    { id: 1, title: "GMRX", coin: "Gaimin", invested: "5000", vested: "10", performance: "+78,68", nextUnlock: true, isAvaiable: true },
    { id: 2, title: "GMRX", coin: "Gaimin", invested: "5000", vested: "10", performance: "+78,68", nextUnlock: true, participatedDate: "1.02.2024", athProfit: true },
    { id: 3, title: "Portal", coin: "Portalcoin", invested: "7500" },
    { id: 4, title: "GMRX", coin: "Gaimin", invested: "5000", vested: "10", performance: "+78,68", nextUnlock: true, isAvaiable: true },
    { id: 5, title: "GMRX", coin: "Gaimin", invested: "5000", vested: "10", performance: "+78,68", nextUnlock: true, participatedDate: "1.02.2024", athProfit: true },
    { id: 6, title: "Portal", coin: "Portalcoin", invested: "7500" },
    { id: 7, title: "GMRX", coin: "Gaimin", invested: "5000", vested: "10", performance: "+78,68", nextUnlock: true, isAvaiable: true },
    { id: 8, title: "GMRX", coin: "Gaimin", invested: "5000", vested: "10", performance: "+78,68", nextUnlock: true, participatedDate: "1.02.2024", athProfit: true },
    { id: 9, title: "Portal", coin: "Portalcoin", invested: "7500" },
]

// @TODO: Remove - Set empty state for testing purposes
if (false) mockedInvestments = []

export const vaultViews = { dashobard: "dashobard", list: "list", grid: "grid" };
export default function AppVault({ session }) {
    const router = useRouter();
    const { view } = router.query;
    const currentView = vaultViews[view] || vaultViews.dashboard;

    // @TODO: Remove. Mocked loading for testing purposes
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 3000)
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!view || !vaultViews[view]) {
            if (router.pathname !== routes.App) {
                router.replace(routes.App, undefined, { shallow: true });
            }
        }
    }, []);

    const handleChangeView = (view) => router.push({
        pathname: router.pathname,
        query: { ...router.query, view } },
        undefined,
        { shallow: true }
    );

    const viewOptions = {
        views: [vaultViews.grid, vaultViews.list, vaultViews.dashobard],
        activeView: currentView,
        handleChangeView, 
    }

    const renderView = (currentView) => {
        switch (currentView) {
            case vaultViews.list:
                return <InvestmentsList investments={mockedInvestments} viewOptions={viewOptions} isLoading={isLoading} />
            case vaultViews.grid:
                return <InvestmentsGrid investments={mockedInvestments} viewOptions={viewOptions} isLoading={isLoading} />
            default:
                return <VaultDashboard isLoading={isLoading} viewOptions={viewOptions} />
        }
    };

    return (
        <>
            <Metadata title='Vault' />
            <div className="flex flex-col h-full">
                {renderView(currentView)}
            </div>
        </>
    );
}

export const getServerSideProps = async ({ req, res }) => await processServerSideData(req, res, routes.App);

AppVault.getLayout = (page) => <AppLayout>{page}</AppLayout>
