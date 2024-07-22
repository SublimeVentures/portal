import OffersMobileList from "./OffersMobileList";
import OffersMobileHistoryList from "./OffersMobileHistoryList";
import ListFilters from "./ListFilters";
import useCurrentView, { otcViews } from "../logic/useCurrentView";
import useListData from "../logic/useListData";
import useMarket from "../logic/useMarket";

export default function OffersMobile({ session, setIsMakeModalOpen, propOffers }) {
    const { wallets } = session;
    const { currentMarket } = useMarket(session);

    const { activeView, handleChangeView } = useCurrentView();
    const showHistory = activeView === otcViews.history;

    const { filterProps, ...data } = useListData(currentMarket, showHistory, wallets, propOffers);

    const renderList = (view, data, market, wallets, propOffers) => {
        if (view === otcViews.history) return <OffersMobileHistoryList market={market} data={data} propOffers={propOffers} />
        return <OffersMobileList market={market} data={data} wallets={wallets} propOffers={propOffers} />
    }

    return (
        <div className="relative h-full flex flex-col 2xl:overflow-hidden">                 
            <ListFilters data={{ market: currentMarket?.name, showHistory, filterProps, handleChangeView, setIsMakeModalOpen }} /> 
            <div className="h-full md:overflow-y-auto">
                {renderList(activeView, data, currentMarket, wallets, propOffers)}
            </div>
        </div>
    );
};
