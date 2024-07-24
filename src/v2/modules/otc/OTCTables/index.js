import LatestDealsTable from "./LatestDealsTable";
import OffersTable from "./OffersTable";
import HistoryTable from "./HistoryTable";

import useMarket from '../logic/useMarket';
import { otcViews } from "../logic/constants";
import useCurrentView from '../logic/useCurrentView';

export default function OTCTables() {
    const { currentMarket } = useMarket();
    const { activeView } = useCurrentView();

    const renderTable = () => {
        if (!currentMarket) return <LatestDealsTable />;

        switch (activeView) {
            case otcViews.history:
                return <HistoryTable />;
            case otcViews.offers:
                return <OffersTable />;
            default:
                return <OffersTable />;
        };
    };

    return renderTable()
}
