import { useState, useRef, useEffect, useCallback, useMemo } from "react";

import useMarket from "../logic/useMarket";
import MarketList from "./MarketList";
import MarketLoader from "./MarketLoader";
import { Card } from "@/v2/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/v2/components/ui/popover";
import { Search } from "@/v2/components/Fields";
import { Button } from "@/v2/components/ui/button";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";

export default function Markets() {
    const inputRef = useRef(null);
    const isDesktop = useMediaQuery(breakpoints.xl);
    const { markets, currentMarket, isLoading, handleResetMarket } = useMarket();

    const [searchValue, setSearchValue] = useState("");
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const filteredMarkets = useMemo(
        () => markets.filter((offer) => offer.name.toLowerCase().includes(searchValue.toLowerCase())),
        [markets, searchValue],
    );

    const handleSearchChange = useCallback((evt) => setSearchValue(evt.target.value), []);

    const togglePopover = useCallback(() => {
        if (!isDesktop) {
            setIsPopoverOpen((prev) => !prev);
        }

        inputRef.current.focus();
    }, [isDesktop, isPopoverOpen]);

    useEffect(() => {
        if (isDesktop) {
            setIsPopoverOpen(false);
        }
    }, [isDesktop]);

    useEffect(() => setIsPopoverOpen(false), [currentMarket]);

    return (
        <Card variant="static" className="flex flex-col h-full flex-shrink-0 overflow-hidden">
            <div className="xl:mb-4">
                <div className="flex items-center justify-between">
                    <h3 className="py-4 text-1xl font-medium text-foreground md:text-lg 2xl:block">Select Markets</h3>
                    {!!currentMarket && (
                        <Button variant="link" onClick={handleResetMarket}>
                            Latest deals
                        </Button>
                    )}
                </div>
                <Search
                    ref={inputRef}
                    name="Search name"
                    value={searchValue}
                    onChange={handleSearchChange}
                    onClick={togglePopover}
                    className="w-full"
                />
            </div>

            <div className="relative 2xl:hidden w-full">
                <Popover open={isPopoverOpen} onOpenChange={togglePopover}>
                    <PopoverTrigger className="absolute w-full top-4 left-4" />
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
}
