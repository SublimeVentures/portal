import { Fragment } from "react";
import moment from "moment";
import Image from "next/image";
import { Skeleton } from "@/v2/components/ui/skeleton";
import { Card, CardDescription, CardTitle } from "@/v2/components/ui/card";
import AlertDestructive from "@/v2/components/Alert/DestructiveAlert";
import { cn } from "@/lib/cn";
import useImage from "@/v2/hooks/useImage";
import { formatCurrency, formatPercentage } from "@/v2/helpers/formatters";

export const SkeletonPayoutTable = ({ count = 3 }) => (
    <Card variant="static" className="p-0 ribbon">
        <div className="p-4">
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton key={index} className="h-20 my-4" />
            ))}
        </div>
    </Card>
);

export const ErrorPayoutTable = () => (
    <Card variant="static" className="p-0 ribbon">
        <div className="p-12">
            <AlertDestructive
                title="Auth error"
                description="Your session has expired. Please log in again."
                actionFn={() => {}}
                btnText="Login"
                variant="column"
            />
        </div>
    </Card>
);

export const PayoutTableVariants = Object.freeze({
    vertical: "vertical",
    horizontal: "horizontal",
});

const PayoutTable = ({ variant = PayoutTableVariants.horizontal, pages = [], isLoading, isError, className }) => {
    const { getResearchIconSrc } = useImage();

    if (isLoading) return <SkeletonPayoutTable />;
    if (isError) return <ErrorPayoutTable />;

    const rowDivStyles = cn({
        "flex items-center justify-between w-full": variant === PayoutTableVariants.horizontal,
        "flex flex-col w-auto": variant === PayoutTableVariants.vertical,
    });

    const rowDdStyles = cn("md:text-base font-medium text-white", {
        "order-2": variant === PayoutTableVariants.vertical,
        "order-1": PayoutTableVariants.horizontal,
    });
    const rowDtStyles = cn("md:text-sm font-light text-white/25", {
        "order-2": variant === PayoutTableVariants.vertical,
        "order-1": variant === PayoutTableVariants.horizontal,
    });
    return (
        <Card variant="static" className={cn("p-0 flex flex-col cursor-auto ribbon", className)}>
            {!pages[0]?.rows?.length ? (
                <div className="grow p-4">
                    <div className="h-full flex flex-col gap-4 justify-center items-center bg-white/5 py-10">
                        <CardTitle className="text-base md:text-lg font-medium text-white">No payouts found</CardTitle>
                        <CardDescription className="max-w-md text-xs md:text-sm font-light text-white/50 text-center">
                            The payout tab is currently empty. This space will fill up as your investments mature and
                            payouts begin. Sit back, relax, and watch your returns grow over time.
                        </CardDescription>
                    </div>
                </div>
            ) : (
                <div className="p-4 grow overflow-y-auto">
                    <ul className="flex flex-col gap-y-4">
                        {pages.map(({ rows }, index) => (
                            <Fragment key={index}>
                                {rows.map(
                                    ({
                                        offer: { ticker, name, slug },
                                        id,
                                        claims: [{ amount, isClaimed }],
                                        percentage,
                                        isPending,
                                        isUpcoming,
                                        isSoon,
                                        claimDate,
                                    }) => (
                                        <li
                                            key={id}
                                            className={cn("p-4 flex items-center item", {
                                                "flex-col": variant === PayoutTableVariants.horizontal,
                                                "flex-row": variant === PayoutTableVariants.vertical,
                                            })}
                                        >
                                            <Image
                                                src={getResearchIconSrc(slug)}
                                                alt={slug}
                                                width={55}
                                                height={55}
                                                className="select-none pointer-events-none h-[55px] w-[55px] rounded-full overflow-hidden shrink-0"
                                            />
                                            <dl
                                                className={cn("w-full select-none", {
                                                    "flex flex-col gap-2": variant === PayoutTableVariants.horizontal,
                                                    "ml-4 grid grid-cols-5 items-center justify-between gap-4":
                                                        variant === PayoutTableVariants.vertical,
                                                })}
                                            >
                                                <div className={rowDivStyles}>
                                                    <dt className={rowDtStyles}>{name}</dt>
                                                    <dd className={rowDdStyles}>{ticker}</dd>
                                                </div>
                                                <div className={rowDivStyles}>
                                                    <dt className={rowDtStyles}>Status</dt>
                                                    <dd className={rowDdStyles}>
                                                        {isPending
                                                            ? isClaimed
                                                                ? "Claimed"
                                                                : "Pending"
                                                            : isUpcoming
                                                              ? "Upcoming"
                                                              : isSoon
                                                                ? "Soon"
                                                                : "Waiting"}
                                                    </dd>
                                                </div>
                                                <div className={rowDivStyles}>
                                                    <dt className={rowDtStyles}>% Unlocked</dt>
                                                    <dd className={rowDdStyles}>
                                                        {formatPercentage(percentage / 100)}
                                                    </dd>
                                                </div>
                                                <div className={rowDivStyles}>
                                                    <dt className={rowDtStyles}>$ Unlocked</dt>
                                                    <dd className={rowDdStyles}>{formatCurrency(amount)}</dd>
                                                </div>
                                                <div className={rowDivStyles}>
                                                    <dt className={rowDtStyles}>Date</dt>
                                                    <dd className={rowDdStyles}>
                                                        {moment.unix(claimDate).format("YYYY-MM-DD")}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </li>
                                    ),
                                )}
                            </Fragment>
                        ))}
                    </ul>
                </div>
            )}
        </Card>
    );
};

export default PayoutTable;
