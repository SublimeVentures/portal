import { Card } from "@/v2/components/ui/card";
import { Search } from "@/v2/components/Fields";
import MarketList from "./MarketList";

export default function OtcMarkets({ searchValue, handleSearchChange, markets, currentMarket, handleSearch }) {
    return (
        <Card variant="static" className="max-h-96 min-w-96 h-full flex flex-col flex-shrink-0 overflow-hidden 2xl:h-full 2xl:max-h-fit"> 
            <h3 className="py-4 text-3xl font-bold text-foreground">Select Markets</h3>
            <Search
                name="Search name"
                className="mb-4"
                value={searchValue}
                onChange={handleSearchChange}
                handleSearch={handleSearch}
            />

            <MarketList markets={markets} selectedMarket={currentMarket} />
        </Card>
    );
}
