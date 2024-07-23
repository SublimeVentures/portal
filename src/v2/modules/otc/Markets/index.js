import { useState, useEffect, useCallback, useMemo } from "react";

import { Card } from "@/v2/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/v2/components/ui/popover"
import { Search } from "@/v2/components/Fields";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import MarketList from "./MarketList";
import MarketLoader from "./MarketLoader";
import useMarket from "../logic/useMarket";

export default function Markets() {
    const isDesktop = useMediaQuery(breakpoints.xl);
    const { markets, currentMarket, isLoading } = useMarket();
    
    const [searchValue, setSearchValue] = useState('');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const filteredMarkets = useMemo(() => markets.filter(offer => offer.name.toLowerCase().includes(searchValue.toLowerCase())), [markets, searchValue]);
    
    const handleSearchChange = useCallback((evt) => setSearchValue(evt.target.value), []);
    
    const togglePopover = useCallback((evt) => {
        if (!isDesktop) {
            setIsPopoverOpen(prev => !prev);
        }
    }, [isDesktop, isPopoverOpen]);

    useEffect(() => {
        if (isDesktop) {
            setIsPopoverOpen(false);
        }
    }, [isDesktop]);

    useEffect(() => setIsPopoverOpen(false), [currentMarket]);

    return (
        <Card variant="static" className="flex flex-col flex-shrink-0 overflow-hidden xl:h-full xl:max-h-fit">
            <div className="xl:mb-4">
                <h3 className="hidden py-4 text-3xl font-bold text-foreground xl:block">Select Markets</h3>
                  <Search name="Search name" value={searchValue} onChange={handleSearchChange} onClick={togglePopover} className="w-full" />
            </div>

            <div className="relative xl:hidden w-full">
                <Popover open={isPopoverOpen} onOpenChange={togglePopover}>
                    <PopoverTrigger className="absolute w-full top-4 left-0" />
                    <PopoverContent style={{ width: "calc(var(--radix-popper-anchor-width) + 36px)" }} onOpenAutoFocus={(evt) => evt.preventDefault()}>
                      <div className="h-80">
                        {isLoading ? (
                          <MarketLoader count={3} />
                        ) : (
                          <MarketList markets={filteredMarkets} currentMarket={currentMarket} />
                        )}
                      </div>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="hidden xl:flex flex-col flex-grow overflow-hidden">
                {isLoading ? <MarketLoader /> : <MarketList markets={filteredMarkets} currentMarket={currentMarket} />} 
            </div>
        </Card>
    );
};
