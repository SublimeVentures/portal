import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import AlertDestructive from "@/components/V2/Layout/AlertDestructive";

export const SkeletonPayoutTable = ({ count = 1 }) => (
    <Card variant="static" className="p-0">
        <div className="h-5 p-2 rounded bg-primary-light-gradient" />
        <div className="p-4">{Array.from({ length: count }).map((_, index) => <Skeleton key={index} className="h-20 my-4" /> )}</div>
    </Card>
);

export const ErrorPayoutTable = () => (
    <Card variant="static" className="p-0">
        <div className="p-2 h-5 rounded bg-primary-light-gradient" />

        <div className="p-12">
            <AlertDestructive title='Auth error' description="Your session has expired. Please log in again." actionFn={() => {}} btnText="Login" variant="column"  />
        </div>
    </Card>
);

const PayoutTable = ({ items }) => (
    <Card variant="static" className="p-0">
        <div className="p-2 h-5 rounded bg-primary-light-gradient" />
        <div className="p-4">
          {!Boolean(items.length) ? (
              <div className="h-80 flex flex-col gap-4 justify-center items-center bg-foreground/[0.03]">
                  <CardTitle className="text-2xl font-medium text-foreground">No payouts found</CardTitle>
                  <CardDescription className="max-w-md text-xs font-light text-foreground text-center">
                    The payout tab is currently empty, but don't worry! This space will fill up as your investments mature and begin to pay out. Sit back, relax, and watch your returns grow over time.
                  </CardDescription>
              </div>
          ) : (
            <ul className="flex flex-col gap-y-4">
                {items.map(item => (
                    <li key={item.id} className="p-4 flex flex-col items-center bg-foreground/[0.03] transition-hover hover:bg-foreground/[0.09] collap:flex-row">
                        <Avatar session={null} />
                        <dl className="w-full flex flex-col gap-2 collap:ml-4 collap:grid collap:grid-cols-5 collap:items-center collap:justify-between collap:gap-4">
                            <div className="flex items-center justify-between w-full collap:block collap:w-auto">
                                <CardTitle className="text-lg font-medium text-foreground order-2 collap:order-1">{item.name}</CardTitle>
                                <dt className="text-md font-light text-foreground/[.25] order-1 collap:order-2">{item.coin}</dt>
                            </div>
                            <div className="flex items-center justify-between w-full collap:block collap:w-auto">
                                <dd className="text-lg font-medium text-foreground order-2 collap:order-1">{item.status}</dd>
                                <dt className="text-md font-light text-foreground/[.25] order-1 collap:order-2">Status</dt>
                            </div>
                            <div className="flex items-center justify-between w-full collap:block collap:w-auto">
                                <dd className="text-lg font-medium text-foreground order-2 collap:order-1">{item.percentageUnlocked}</dd>
                                <dt className="text-md font-light text-foreground/[.25] order-1 collap:order-2">% Unlocked</dt>
                            </div>
                            <div className="flex items-center justify-between w-full collap:block collap:w-auto">
                                <dd className="text-lg font-medium text-foreground order-2 collap:order-1">{item.moneyUnlocked}</dd>
                                <dt className="text-md font-light text-foreground/[.25] order-1 collap:order-2">$ Unlocked</dt>
                            </div>
                            <div className="flex items-center justify-between w-full collap:block collap:w-auto">
                                <dd className="text-lg font-medium text-foreground order-2 collap:order-1">{item.lastPayout}</dd>
                                <dt className="text-md font-light text-foreground/[.25] order-1 collap:order-2">Last payout</dt>
                            </div>
                        </dl>
                    </li>
                ))}
            </ul>
          )}
        </div>
    </Card>
);

export default PayoutTable;
 