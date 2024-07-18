import Link from "next/link";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { Button } from "@/v2/components/ui/button";
import usePayoutsInfiniteQuery from "@/v2/modules/payouts/usePayoutsInfiniteQuery";
import PayoutTable, { PayoutTableVariants } from "@/v2/components/App/Vault/PayoutTable";
import { cn } from "@/lib/cn";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";

const Payouts = ({ className }) => {
    const { data: { pages = [] } = {}, isLoading } = usePayoutsInfiniteQuery({ limit: 5 });
    const isLargeDesktop = useMediaQuery(breakpoints.md);
    const tableVariant = isLargeDesktop ? PayoutTableVariants.vertical : PayoutTableVariants.horizontal;
    return (
        <div className={cn("h-full", className)}>
            <div className="mb-4 w-full flex items-center justify-between gap-4">
                <h3 className="text-nowrap text-md md:text-2xl text-foreground">Payout table</h3>
                <Button variant="link" className="ml-auto text-accent capitalize" asChild>
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
