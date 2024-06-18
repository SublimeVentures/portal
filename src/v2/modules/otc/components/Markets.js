import { useState, useCallback, useMemo } from "react";

import { Card } from "@/v2/components/ui/card";
import { Search } from "@/v2/components/Fields";
import SingleMarket from "./SingleMarket";

export default function OtcMarkets({ otc, currentMarket }) {
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = useCallback((evt) => setSearchValue(evt.target.value), []);

    const filteredMarkets = useMemo(() => otc.filter(offer => offer.name.toLowerCase().includes(searchValue.toLowerCase())), [otc, searchValue]);

    return (
        <Card variant="static" className="max-h-96 min-w-96 h-full flex flex-col flex-shrink-0 overflow-hidden 2xl:h-full 2xl:max-h-fit"> 
            <h3 className="py-4 text-3xl font-bold text-foreground">Select Markets</h3>
            <Search
                name="Search name"
                className="mb-4"
                value={searchValue}
                onChange={handleSearchChange}
            />

            <ul className="flex flex-col gap-4 overflow-y-auto"> 
                {filteredMarkets.map(offer => (
                    <li key={offer.offerId}>
                        <SingleMarket {...offer} selectedMarket={currentMarket} />
                    </li>
                ))}
            </ul>
        </Card>
    );
}
