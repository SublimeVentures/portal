import { Button } from "@/v2/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal } from "@/v2/components/ui/dropdown-menu";
import { cn } from "@/lib/cn";
import CrossIcon from "@/v2/assets/svg/cross.svg";
import { otcViews } from "../logic/useCurrentView";
import { offersFilters } from "../utils/filters";

const FiltersDropdown = ({ filters, handleToggleFilter }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="tertiary">Filters</Button>
            </DropdownMenuTrigger>
          
            <DropdownMenuPortal>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                        {filters.map(filter =>(
                             <DropdownMenuItem key={filter.id} onClick={() => handleToggleFilter(filter.id)}>
                                {filter.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
            </DropdownMenuPortal>
        </DropdownMenu>
    );
}

export default function TableFilters({ data }) {
    const { market, showHistory, filterProps, handleChangeView } = data;
    const { filters, handleToggleFilter, handleFilterRemove } = filterProps;

    return (
        <div className="my-4 flex flex-col text-white gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
            <h3 className="text-2xl text-foreground whitespace-nowrap">
                Offers {showHistory && "History"}
                <span className="inline-block -translate-y-2 text-md whitespace-nowrap">{market}</span>
            </h3>

            <div className="flex flex-wrap items-center gap-4 2xl:flex-row-reverse">
                <Button onClick={() => handleChangeView(showHistory ? otcViews.offers : otcViews.history)}>{showHistory ? 'Hide': 'Show'} History</Button>
                <Button>Create offer</Button>
                {!showHistory && <FiltersDropdown filters={offersFilters} handleToggleFilter={handleToggleFilter} />
}
                {Object.entries(filters).map(([key, value]) => {
                    const filter = offersFilters.find(f => {
                        if (['isSell'].includes(key)) {
                            return f.filter[key] === value;
                        }
                        
                        return f.filter[key] !== undefined;
                    });
                    
                    return (
                        <div key={key} className="py-1.5 px-4 text-sm bg-gray-300 rounded">
                            {filter.name}
                            <button className="ml-2" onClick={() => handleFilterRemove(key)}>
                                <CrossIcon className='size-2' />
                                <span className="sr-only">Remove filter</span>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
