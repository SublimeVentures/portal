import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";

import useMarket from "../logic/useMarket";
import MarketList from "./MarketList";
import MarketLoader from "./MarketLoader";
import { Card } from "@/v2/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/v2/components/ui/popover";
import { Search } from "@/v2/components/Fields";
import { Button } from "@/v2/components/ui/button";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";

export default function Markets() {
    const router = useRouter();
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

    const openPopover = useCallback(() => {
        if (!isDesktop) {
            setIsPopoverOpen(true);
        }

        inputRef.current.focus();
    }, [isDesktop, isPopoverOpen]);

    useEffect(() => {
        if (isDesktop) {
            setIsPopoverOpen(false);
        }
    }, [isDesktop]);

    useEffect(() => {
        const handleRouteChange = () => setIsPopoverOpen(false);
        router.events.on('routeChangeStart', handleRouteChange);
        
        return () => router.events.off('routeChangeStart', handleRouteChange);
    }, [router]);

    useEffect(() => setIsPopoverOpen(false), [currentMarket]);

    return (
        <Card variant={isDesktop ? "static" : "none"} className="p-0 flex flex-col h-full flex-shrink-0 overflow-hidden xl:py-3.5 xl:px-5">
            <div className="xl:mb-4">
                <div className="hidden items-center justify-between 2xl:flex">
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
                    onClose={() => setIsPopoverOpen(false)}
                    onChange={handleSearchChange}
                    onClick={openPopover}
                    isOpen={isPopoverOpen}
                    className="w-full"
                />
                <div className="relative w-full xl:hidden">
                    <Popover open={isPopoverOpen} onOpenChange={openPopover}>
                        <PopoverTrigger className="absolute w-full top-4 left-4" />
                        <PopoverContent
                            style={{ width: "calc(var(--radix-popper-anchor-width) + 36px)" }}
                            onOpenAutoFocus={(evt) => evt.preventDefault()}
                        >
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
            </div>


            <div className="hidden xl:flex flex-col flex-grow overflow-hidden">
                {isLoading ? <MarketLoader /> : <MarketList markets={filteredMarkets} currentMarket={currentMarket} />}
            </div>
        </Card>
    );
}
