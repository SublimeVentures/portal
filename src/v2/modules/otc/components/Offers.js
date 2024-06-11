import { Card } from "@/v2/components/ui/card";
import OffersTable from "./OffersTable";
import OffersHistoryTable from "./OffersHistoryTable";
import TableFilters from "./TableFilters";
import useCurrentView, { otcViews } from "../logic/useCurrentView";
import useTableData from "../logic/useTableData";

export default function Offers({ currentMarket, session }) {
    const { wallets } = session;

    const { activeView, handleChangeView } = useCurrentView();
    const showHistory = activeView === otcViews.history;

    const { filterProps, ...tableData } = useTableData(currentMarket, showHistory, wallets);

    const renderTable = (view, data, wallets) => {
        if (view === otcViews.history) return <OffersHistoryTable data={data} />
        return <OffersTable data={data} wallets={wallets} />
    }

    return (
        <div className="relative h-full flex flex-col 2xl:overflow-hidden">                 
            <TableFilters data={{ market: currentMarket.name, showHistory, filterProps, handleChangeView }} />
            <Card variant="static" className="p-0 h-full flex flex-col md:overflow-hidden">
                <div className="p-2 h-5 rounded bg-primary-light-gradient" />

                <div className="h-full md:overflow-y-auto">
                    {renderTable(activeView, tableData, wallets)}
                </div>
            </Card>
        </div>
    );
};
