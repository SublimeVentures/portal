import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { InvestmentRow, InvestmentCardMobile } from "@/v2/components/App/Vault";

export default function InvestmentsList({ investments = [], isLoading = false }) {
    const isMobile = useMediaQuery(breakpoints.sm);
    const isDesktop = useMediaQuery(breakpoints.md);
    const isLargeDesktop = useMediaQuery(breakpoints.xl);
    const isRowView = (isMobile && !isDesktop) || isLargeDesktop;

    return (
        <ul className="h-full flex flex-col gap-4 md:gap-8">
            {investments.map((item) => (
                <li key={item.id}>
                    {isRowView ? (
                        <InvestmentRow details={item} isLoading={isLoading} />
                    ) : (
                        <InvestmentCardMobile details={item} isLoading={isLoading} />
                    )}
                </li>
            ))}
        </ul>
    );
}
