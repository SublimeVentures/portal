import { Card } from "@/v2/components/ui/card";

import LatestDealsTable from "./LatestDealsTable"
import OffersTable from "./OffersTable";
import OffersHistoryTable from "./OffersHistoryTable";
import TableFilters from "./TableFilters";
import useCurrentView, { otcViews } from "../logic/useCurrentView";
import useTableData from "../logic/useTableData";
import useMarket from "@/v2/modules/otc/logic/useMarket";

export default function Offers({ session, setIsMakeModalOpen }) {
    const { wallets } = session;

    const { currentMarket } = useMarket(session);
    const { activeView, handleChangeView } = useCurrentView();
    const showHistory = activeView === otcViews.history;

    const { isLoading, filterProps, ...tableData } = useTableData(session, showHistory);

    return (
        <div className="relative h-full flex flex-col 2xl:overflow-hidden">                 
            <TableFilters session={session} data={{ showHistory, filterProps, handleChangeView, setIsMakeModalOpen }} />
            <Card variant="static" className="p-0 h-full flex flex-col md:overflow-hidden">
                <div className="p-2 h-5 rounded bg-primary-light-gradient" />

                <div className="h-full md:overflow-y-auto">
                    {!currentMarket ? (
                        <LatestDealsTable data={tableData} />
                    ) : activeView === otcViews.history ? (
                        <OffersHistoryTable data={tableData} />
                    ) : (
                        <OffersTable wallets={wallets} data={tableData} />
                    )}
                </div>
            </Card>
        </div>
    );
};
