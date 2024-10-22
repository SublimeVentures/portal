import Link from "next/link";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { Button } from "@/v2/components/ui/button";
import PayoutTable, { PayoutTableVariants } from "@/v2/components/App/Vault/PayoutTable";
import { cn } from "@/lib/cn";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import Title from "@/v2/modules/vault/components/Dashboard/Title";
import usePayoutsInfiniteQuery from "@/v2/hooks/usePayoutsInfiniteQuery";

export const PAYOUTS_QUERY = {
    limit: 5,
};

const Payouts = ({ className }) => {
    const { data: { pages = [] } = {}, isLoading } = usePayoutsInfiniteQuery(PAYOUTS_QUERY);
    const isLargeDesktop = useMediaQuery(breakpoints.md);
    const tableVariant = isLargeDesktop ? PayoutTableVariants.vertical : PayoutTableVariants.horizontal;
    return (
        <div className={cn("h-full", className)}>
            <div className="w-full flex items-center justify-between mb-5 sm:mb-4 lg:mb-2">
                <Title>Payout table</Title>
                <Button variant="link" className="ml-auto text-secondary capitalize text-xs md:text-sm p-0" asChild>
                    <Link href="/app/vault/payouts">
                        see all <ArrowIcon className="size-2.5 ml-2" />
                    </Link>
                </Button>
            </div>
            <PayoutTable variant={tableVariant} isLoading={isLoading} pages={pages} className="grow overflow-hidden" />
        </div>
    );
};

export default Payouts;
