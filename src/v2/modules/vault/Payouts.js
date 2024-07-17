import Link from "next/link";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { Button } from "@/v2/components/ui/button";
import usePayoutsInfiniteQuery from "@/v2/modules/payouts/usePayoutsInfiniteQuery";
import PayoutTable, { PayoutTableVariants } from "@/v2/components/App/Vault/PayoutTable";

const Payouts = () => {
    const { data: { pages = [] } = {}, isLoading } = usePayoutsInfiniteQuery({ limit: 5 });
    const isLargeDesktop = useMediaQuery(breakpoints.xxl);
    const tableVariant = isLargeDesktop ? PayoutTableVariants.vertical : PayoutTableVariants.horizontal;
    return (
        <div className="col-span-5">
            <div className="mb-4 w-full flex items-center justify-between gap-4">
                <h3 className="text-nowrap text-2xl text-foreground">Payout table</h3>
                <Button variant="link" className="ml-auto text-accent" asChild>
                    <Link href="/app/vault/payouts">see all</Link>
                </Button>
            </div>
            <PayoutTable variant={tableVariant} isLoading={isLoading} pages={pages} />
        </div>
    );
};

export default Payouts;
