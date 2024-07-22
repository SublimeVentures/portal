import { Card } from "@/v2/components/ui/card";
import { Search } from "@/v2/components/Fields";
import MarketList from "./MarketList";

export default function OtcMarkets({ searchValue, handleSearchChange, markets, currentMarket }) {
    return (
        <Card variant="static" className="max-h-96 min-w-96 h-full flex flex-col flex-shrink-0 overflow-hidden 2xl:h-full 2xl:max-h-fit"> 
            <div className="flex items-center justify-between">
                <h3 className="py-4 text-3xl font-bold text-foreground">Select Markets</h3>
                <button className="text-white">X</button>
            </div>
            <Search
                name="Search name"
                className="mb-4"
                value={searchValue}
                onChange={handleSearchChange}
            />

            <MarketList markets={markets} selectedMarket={currentMarket} />
        </Card>
    );
}
