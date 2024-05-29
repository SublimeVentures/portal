import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { InvestmentRow, InvestmentCardMobile, EmptyInvestmentsEnhanced } from "@/v2/components/App/Vault";
import { InvestmentsFilters } from "@/v2/components/App/Vault";

export default function InvestmentsList({ investments = [], viewOptions = {}, isLoading = false }) {
    const isMobile = useMediaQuery(breakpoints.sm);
    const isDesktop = useMediaQuery(breakpoints.md);
    const isLargeDesktop = useMediaQuery(breakpoints.xl);
    const isRowView = (isMobile && !isDesktop) || isLargeDesktop;

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
                    <ul className="h-full flex flex-col gap-4 md:gap-8"> 
                        {investments.map(item => (
                            <li key={item.id}>
                                {isRowView 
                                    ? <InvestmentRow details={item} isLoading={isLoading} />
                                    : <InvestmentCardMobile details={item} isLoading={isLoading} />
                                }
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
