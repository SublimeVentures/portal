import { Cross1Icon } from "@radix-ui/react-icons";

import MakeOfferModal from "../Modals/MakeOfferModal";
import useCurrentView from "../logic/useCurrentView";
import { otcViews } from "../logic/constants";
import { offersFilters } from "../logic/filters";
import { Button, buttonVariants } from "@/v2/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuRadioItem,
    DropdownMenuRadioGroup,
    DropdownMenuCheckboxItem,
} from "@/v2/components/ui/dropdown-menu";
import useMarket from "@/v2/modules/otc/logic/useMarket";
import { cn } from "@/lib/cn";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";

const FiltersDropdown = ({ filters, options, handleToggleFilter }) => {
    const grouped = options.reduce((acc, option) => {
        const key = Object.keys(option.filter)[0];
        if (!acc[key]) {
            acc[key] = [];
        }

        acc[key].push(option);
        return acc;
    }, {});
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="tertiary">Filters</Button>
            </DropdownMenuTrigger>

            <DropdownMenuPortal>
                <DropdownMenuContent className="w-56 py-4 px-2">
                    {Object.entries(grouped).map(([key, value]) => {
                        if (value.length > 1) {
                            return (
                                <DropdownMenuRadioGroup
                                    key={key}
                                    onValueChange={handleToggleFilter}
                                    value={options.find((option) => option.filter[key] === filters[key])?.id}
                                >
                                    {value.map((option) => (
                                        <DropdownMenuRadioItem key={option.id} value={option.id}>
                                            {option.name}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            );
                        }
                        return value.map((option) => (
                            <DropdownMenuCheckboxItem
                                key={option.id}
                                checked={filters[key] ? true : false}
                                onCheckedChange={() => handleToggleFilter(option.id)}
                            >
                                {option.name}
                            </DropdownMenuCheckboxItem>
                        ));
                    })}
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
                hidden: !currentMarket && isDesktop,
            })}
        >
            <h3 className="text-[24px] text-foreground whitespace-nowrap md:text-[16px]">
                {currentMarket ? (
                    <>
                        <span className="inline-block whitespace-nowrap">
                            Offers {!isOffersView && "History"}{" "}
                            <small className="text-2xs 3xl:text-xs align-super">{currentMarket.name}</small>
                        </span>
                    </>
                ) : null}
            </h3>

            <div className="flex flex-wrap gap-4 md:flex-row-reverse">
                {currentMarket && (
                    <>
                        <Button onClick={() => handleChangeView(isOffersView ? otcViews.history : otcViews.offers)}>
                            {isOffersView ? "Show" : "Hide"} History
                        </Button>
                        <MakeOfferModal />
                        {isOffersView && (
                            <FiltersDropdown
                                filters={filters}
                                options={offersFilters}
                                handleToggleFilter={handleToggleFilter}
                            />
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
                                    <div key={key} className={cn(buttonVariants({ variant: "secondary" }))}>
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
