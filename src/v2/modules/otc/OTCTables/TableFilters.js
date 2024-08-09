import { Cross1Icon } from "@radix-ui/react-icons";

import MakeOfferModal from "../Modals/MakeOfferModal";
import useCurrentView from "../logic/useCurrentView";
import { otcViews } from "../logic/constants";
import { offersFilters } from "../logic/filters";
import { Button } from "@/v2/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
} from "@/v2/components/ui/dropdown-menu";
import useMarket from "@/v2/modules/otc/logic/useMarket";
import { cn } from "@/lib/cn";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";

const FiltersDropdown = ({ filters, handleToggleFilter }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="tertiary">Filters</Button>
            </DropdownMenuTrigger>

            <DropdownMenuPortal>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                        {filters.map((filter) => (
                            <DropdownMenuItem key={filter.id} onClick={() => handleToggleFilter(filter.id)}>
                                {filter.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenuPortal>
        </DropdownMenu>
    );
};

export default function TableFilters({ filters = {}, handleToggleFilter, handleFilterRemove }) {
    const isDesktop = useMediaQuery(breakpoints.xl);
    const { currentMarket } = useMarket();
    const { activeView, handleChangeView } = useCurrentView();
    const isOffersView = activeView === otcViews.offers;

    return (
        <div
            className={cn("my-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between", {
                "absolute -top-20": !currentMarket && isDesktop,
            })}
        >
            <h3 className="text-sm 3xl:text-lg text-foreground whitespace-nowrap md:text-base">
                {currentMarket ? (
                    <>
                        <span className="inline-block whitespace-nowrap">
                            Offers <small className="text-3xs 3xl:text-xs align-super">{currentMarket.name}</small>
                        </span>
                        {!isOffersView && "History"}
                    </>
                ) : (
                    "Latest deals"
                )}
            </h3>

            <div className="flex flex-wrap gap-4 md:flex-row-reverse">
                {currentMarket && (
                    <>
                        <Button onClick={() => handleChangeView(isOffersView ? otcViews.history : otcViews.offers)}>
                            {isOffersView ? "Show" : "Hide"} History
                        </Button>
                        <MakeOfferModal />
                        {isOffersView && (
                            <FiltersDropdown filters={offersFilters} handleToggleFilter={handleToggleFilter} />
                        )}

                        <div className="flex flex-wrap items-stretch gap-4 2xl:flex-row-reverse">
                            {Object.entries(filters).map(([key, value]) => {
                                const filter = offersFilters.find((f) => {
                                    if (["isSell"].includes(key)) {
                                        return f.filter[key] === value;
                                    }

                                    return f.filter[key] !== undefined;
                                });

                                return (
                                    <div
                                        key={key}
                                        className="px-4 flex items-center text-white text-xs 3xl:text-sm font-light bg-gray-300 rounded"
                                    >
                                        {filter.name}
                                        <button className="ml-2" onClick={() => handleFilterRemove(key)}>
                                            <Cross1Icon />
                                            <span className="sr-only">Remove filter</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
