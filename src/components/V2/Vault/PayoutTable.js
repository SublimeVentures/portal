import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const SkeletonPayoutTable = ({ count = 1 }) => (
    <Card className="p-0">
        <div className="h-5 p-2 rounded cardGradientLight" />
        <div className="p-4">{Array.from({ length: count }).map((_, index) => <Skeleton key={index} className="h-20 my-4" /> )}</div>
    </Card>
);

const PayoutTable = ({ items }) => (
    <Card className="p-0">
        <div className="p-2 h-5 rounded cardGradientLight" />
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
                    <li key={item.id} className="p-4 flex items-center bg-foreground/[0.03]">
                        <Avatar className="mr-5">
                            <AvatarImage src="" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <dl className="w-full grid grid-cols-5 items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-lg font-medium text-foreground">{item.name}</CardTitle>
                                <dt className="text-md font-light text-foreground/[.25]">{item.coin}</dt>
                            </div>
                            <div>
                                <dd className="text-lg font-medium text-foreground">{item.status}</dd>
                                <dt className="text-md font-light text-foreground/[.25]">Status</dt>
                            </div>
                            <div>
                                <dd className="text-lg font-medium text-foreground">{item.percentageUnlocked}</dd>
                                <dt className="text-md font-light text-foreground/[.25]">% Unlocked</dt>
                            </div>
                            <div>
                                <dd className="text-lg font-medium text-foreground">{item.moneyUnlocked}</dd>
                                <dt className="text-md font-light text-foreground/[.25]">$ Unlocked</dt>
                            </div>
                            <div>
                                <dd className="text-lg font-medium text-foreground">{item.lastPayout}</dd>
                                <dt className="text-md font-light text-foreground/[.25]">Last payout</dt>
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
