import { Button } from "@/v2/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal } from "@/v2/components/ui/dropdown-menu";
import useMarket from "@/v2/modules/otc/logic/useMarket";
import MakeOfferModal from "../Modals/MakeOfferModal";
import useCurrentView from "../logic/useCurrentView";
import { otcViews } from "../logic/constants";
import { offersFilters } from "../logic/filters";

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

const handleToggleFilter = () => {}

export default function TableFilters() {
    const { currentMarket } = useMarket();
    const { currentView, handleChangeView } = useCurrentView();
    const isHistoryView = currentView === otcViews.HISTORY;

    return (
        <div className="my-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="text-[24px] text-foreground whitespace-nowrap md:text-[16px]">
                {currentMarket ? (
                    <>
                        <span className="inline-block whitespace-nowrap">{currentMarket.name}</span>
                        {isHistoryView && "History"}
                    </>
                ) : "Latest deals"}
            </h3>

            <div className="flex flex-wrap items-center gap-4 md:flex-row-reverse">
                {currentMarket && (
                    <>
                        <Button onClick={() => handleChangeView(isHistoryView ? otcViews.OFFERS : otcViews.HISTORY)}>{isHistoryView ? 'Hide': 'Show'} History</Button>
                        <MakeOfferModal /> 
                        {!isHistoryView && <FiltersDropdown filters={offersFilters} handleToggleFilter={handleToggleFilter} />}
                    </>
                )}
            </div>
        </div>
    );
};

// import { Button } from "@/v2/components/ui/button";

// import { cn } from "@/lib/cn";
// import CrossIcon from "@/v2/assets/svg/cross.svg";
// import { otcViews } from "../logic/useCurrentView";
// import { offersFilters } from "../utils/filters";
// import useMarket from "../logic/useMarket";
// import MakeOfferModal from "./MakeOfferModal";


// export default function TableFilters({ session, data }) {
//     const { showHistory, filterProps, handleChangeView, setIsMakeModalOpen } = data;
//     const { filters, handleToggleFilter, handleFilterRemove } = filterProps;



//     return (
//         <div className="my-4 flex flex-col text-white gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
//             <div className="flex flex-wrap items-center gap-4 2xl:flex-row-reverse">
//                 {Object.entries(filters).map(([key, value]) => {
//                     const filter = offersFilters.find(f => {
//                         if (['isSell'].includes(key)) {
//                             return f.filter[key] === value;
//                         }
                        
//                         return f.filter[key] !== undefined;
//                     });
                    
//                     return (
//                         <div key={key} className="py-1.5 px-4 text-sm bg-gray-300 rounded">
//                             {filter.name}
//                             <button className="ml-2" onClick={() => handleFilterRemove(key)}>
//                                 <CrossIcon className='size-2' />
//                                 <span className="sr-only">Remove filter</span>
//                             </button>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     )
// }
