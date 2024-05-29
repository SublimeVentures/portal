import { Avatar } from "@/v2/components/ui/avatar";
import { Skeleton } from "@/v2/components/ui/skeleton";
import { Card, CardDescription, CardTitle } from "@/v2/components/ui/card";
import AlertDestructive from "@/v2/components/Alert/DestructiveAlert";
import { cn } from "@/lib/cn";

export const SkeletonPayoutTable = ({ count = 3 }) => (
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

export const PayoutTableVariants = Object.freeze({
    vertical: 'vertical',
    horizontal: 'horizontal',
});

const PayoutTable = ({ variant = PayoutTableVariants.horizontal, items, isLoading, isError }) => {
    if (isLoading) return <SkeletonPayoutTable />
    if (isError) return <ErrorPayoutTable />

    const rowDivStyles = cn({
        "flex items-center justify-between w-full": variant === PayoutTableVariants.horizontal,
        "block w-auto": variant === PayoutTableVariants.vertical,
    });

    const rowDdStyles = cn("text-lg font-medium text-foreground", { "order-1": variant === PayoutTableVariants.vertical, "order-2": PayoutTableVariants.horizontal });
    const rowDtStyles = cn("text-md font-light text-foreground/[.25]", { "order-2": variant === PayoutTableVariants.vertical, "order-1": variant === PayoutTableVariants.horizontal });

    return (
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
                        <li key={item.id} className={cn("p-4 flex items-center bg-foreground/[0.03] transition-hover hover:bg-foreground/[0.09]", {
                            "flex-col": variant === PayoutTableVariants.horizontal,
                            "flex-row": variant === PayoutTableVariants.vertical,
                        })}>
                            <Avatar session={null} />
                            <dl className={cn("w-full", {
                                "flex flex-col gap-2": variant === PayoutTableVariants.horizontal,
                                "ml-4 grid grid-cols-5 items-center justify-between gap-4": variant === PayoutTableVariants.vertical,
                            })}>
                                <div className={rowDivStyles}>
                                    <CardTitle className={rowDdStyles}>{item.name}</CardTitle>
                                    <dt className={rowDtStyles}>{item.coin}</dt>
                                </div>
                                <div className={rowDivStyles}>
                                    <dd className={rowDdStyles}>{item.status}</dd>
                                    <dt className={rowDtStyles}>Status</dt>
                                </div>
                                <div className={rowDivStyles}>
                                    <dd className={rowDdStyles}>{item.percentageUnlocked}</dd>
                                    <dt className={rowDtStyles}>% Unlocked</dt>
                                </div>
                                <div className={rowDivStyles}>
                                    <dd className={rowDdStyles}>{item.moneyUnlocked}</dd>
                                    <dt className={rowDtStyles}>$ Unlocked</dt>
                                </div>
                                <div className={rowDivStyles}>
                                    <dd className={rowDdStyles}>{item.lastPayout}</dd>
                                    <dt className={rowDtStyles}>Last payout</dt>
                                </div>
                            </dl>
                        </li>
                    ))}
                </ul>
            )}
            </div>
        </Card>
    );
};


    
//     return (
//         <Card variant="static" className="p-0">
//             <div className="p-2 h-5 rounded bg-primary-light-gradient" />
//             <div className="p-4">
//             {!Boolean(items.length) ? (
//                 <div className="h-80 flex flex-col gap-4 justify-center items-center bg-foreground/[0.03]">
//                     <CardTitle className="text-2xl font-medium text-foreground">No payouts found</CardTitle>
//                     <CardDescription className="max-w-md text-xs font-light text-foreground text-center">
//                         The payout tab is currently empty, but don't worry! This space will fill up as your investments mature and begin to pay out. Sit back, relax, and watch your returns grow over time.
//                     </CardDescription>
//                 </div>
//             ) : (
//                 <ul className="flex flex-col gap-y-4">
//                     {items.map(item => (
//                         <li key={item.id} className={cn("p-4 flex flex-col items-center bg-foreground/[0.03] transition-hover hover:bg-foreground/[0.09]", { "flex-row": PayoutTableVariants.horizontal })}>
//                             <Avatar session={null} />
//                             <dl className={cn("w-full flex flex-col gap-2", { "ml-4 grid grid-cols-5 items-center justify-between gap-4": PayoutTableVariants.horizontal })}>
//                                 <div className={rowDivStyles}>
//                                     <CardTitle className={rowDdStyles}>{item.name}</CardTitle>
//                                     <dt className={rowDtStyles}>{item.coin}</dt>
//                                 </div>
//                                 <div className={rowDivStyles}>
//                                     <dd className={rowDdStyles}>{item.status}</dd>
//                                     <dt className={rowDtStyles}>Status</dt>
//                                 </div>
//                                 <div className={rowDivStyles}>
//                                     <dd className={rowDdStyles}>{item.percentageUnlocked}</dd>
//                                     <dt className={rowDtStyles}>% Unlocked</dt>
//                                 </div>
//                                 <div className={rowDivStyles}>
//                                     <dd className={rowDdStyles}>{item.moneyUnlocked}</dd>
//                                     <dt className={rowDtStyles}>$ Unlocked</dt>
//                                 </div>
//                                 <div className={rowDivStyles}>
//                                     <dd className={rowDdStyles}>{item.lastPayout}</dd>
//                                     <dt className={rowDtStyles}>Last payout</dt>
//                                 </div>
//                             </dl>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//             </div>
//         </Card>
//     );
// };


export default PayoutTable;