import { Button } from "@/v2/components/ui/button";
import CrossIcon from "@/v2/assets/svg/cross.svg";
import { otcViews } from "../logic/useCurrentView";
import { offersFilters } from "../utils/filters";

export default function TableFilters({ data }) {
    const { market, showHistory, filterProps, handleChangeView, setIsMakeModalOpen } = data;
    const { filters, handleToggleFilter, handleFilterRemove } = filterProps;

    return (
        <div className="my-4 flex justify-between items-center gap-4 text-white">
            <div>
                <h3 className="text-2xl text-foreground whitespace-nowrap">
                    Offers {showHistory && "History"}
                </h3>
                <p className="text-md whitespace-nowrap">{market}</p>
            </div>

            <div className="flex items-center gap-4 2xl:flex-row-reverse">
                <Button className="py-2.5 px-3" onClick={() => handleChangeView(showHistory ? otcViews.offers : otcViews.history)}>{showHistory ? 'Hide': 'Show'} History</Button>
                <Button className="py-2.5 px-3" onClick={() => setIsMakeModalOpen(true)}>Create offer</Button>

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
