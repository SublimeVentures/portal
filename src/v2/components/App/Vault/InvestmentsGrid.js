import { InvestmentCard, EmptyInvestmentsEnhanced } from "@/v2/components/App/Vault";
import { InvestmentsFilters } from "@/v2/components/App/Vault";

export default function InvestmentsGrid({ investments = [], viewOptions = {}, isLoading = false }) {
    if (investments.length <= 0) {
        return (
            <div className="p-16 h-full">
                <EmptyInvestmentsEnhanced />
            </div>
        )
    }

    return (
        <>
            <InvestmentsFilters investments={investments} viewOptions={viewOptions} />
            <div className="vault-investment md:px-8 md:mx-8 md:mb-24 md:py-16 md:overflow-x-hidden md:overflow-y-auto" >
                <div>
                    <ul className="gap-4 h-full test-grid md:gap-8"> 
                        {investments.map(item => (
                            <li key={item.id}>
                                <InvestmentCard details={item} isLoading={isLoading} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
