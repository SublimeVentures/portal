import Link from "next/link";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { Button } from "@/v2/components/ui/button";
import usePayoutsInfiniteQuery from "@/v2/modules/payouts/usePayoutsInfiniteQuery";
import PayoutTable, { PayoutTableVariants } from "@/v2/components/App/Vault/PayoutTable";
import { cn } from "@/lib/cn";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import Title from "@/v2/modules/vault/components/Dashboard/Title";

const Payouts = ({ className }) => {
    const { data: { pages = [] } = {}, isLoading } = usePayoutsInfiniteQuery({ limit: 5 });
    const isLargeDesktop = useMediaQuery(breakpoints.md);
    const tableVariant = isLargeDesktop ? PayoutTableVariants.vertical : PayoutTableVariants.horizontal;
    return (
        <div className={cn("h-full", className)}>
            <div className="w-full flex items-center justify-between mb-5 md:mb-2">
                <Title>Payout table</Title>
                <Button variant="link" className="ml-auto text-accent capitalize text-xs md:text-sm p-0" asChild>
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
