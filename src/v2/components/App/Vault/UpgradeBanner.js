import { useMemo, Fragment } from "react";
import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/v2/components/ui/card";
import { IconButton } from "@/v2/components/ui/icon-button";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import { cn } from "@/lib/cn";
import { routes } from "@/v2/routes";
import useStoreOwnedItemsQuery from "@/v2/hooks/useStoreOwnedItemsQuery";

const VARIANTS = {
    DEFAULT: "default",
    VERTICAL: "vertical",
};

const UpgradeCard = ({ className, variant = VARIANTS.DEFAULT }) => {
    const { data = [] } = useStoreOwnedItemsQuery();
    const items = useMemo(() => data?.filter((el) => el.name !== "MysteryBox"), [data]);
    const isPremium = items?.length > 0;
    return (
        <Card
            variant="none"
            border="none"
            href={routes.Upgrades}
            className={cn("relative flex group/button select-none", className, {
                "bg-banner-default bg-left bg-cover 3xl:bg-center bg-no-repeat py-6 min-h-40 flex-col grow items-end justify-center 3xl:justify-end text-center":
                    variant === VARIANTS.DEFAULT,
                "bg-banner-vertical p-3 md:justify-end lg:w-116": variant === VARIANTS.VERTICAL,
            })}
        >
            <div
                className={cn("", {
                    "w-7/12 3xl:w-full": variant === VARIANTS.DEFAULT,
                    "block w-full md:w-1/2": variant === VARIANTS.VERTICAL,
                })}
            >
                {!isPremium ? (
                    <>
                        <IconButton
                            name="Upgrade"
                            shape="circle"
                            variant="accent"
                            icon={ArrowIcon}
                            size={variant === VARIANTS.DEFAULT ? "default" : 8}
                            className={cn("absolute", {
                                "p-3.5 bottom-2.5 left-2.5 3xl:top-4 3xl:right-4 3xl:bottom-auto 3xl:left-auto":
                                    variant === VARIANTS.DEFAULT,
                                "p-2.5 md:left-6 top-1/2 transform -translate-y-1/2 right-6":
                                    variant === VARIANTS.VERTICAL,
                            })}
                        />
                        <CardTitle
                            className={cn("font-normal italic text-accent", {
                                "text-base 3xl:text-2xl text-center mb-2": variant === VARIANTS.DEFAULT,
                                "text-sm": variant === VARIANTS.VERTICAL,
                            })}
                        >
                            Upgrade to{" "}
                            <span
                                className={cn("font-semibold", {
                                    "3xl:block": variant === VARIANTS.DEFAULT,
                                })}
                            >
                                Premium!
                            </span>
                        </CardTitle>
                        <CardDescription
                            className={cn("text-sm font-light text-foreground", {
                                "text-center": variant === VARIANTS.DEFAULT,
                            })}
                        >
                            Increase your allocation size.
                        </CardDescription>
                    </>
                ) : (
                    <>
                        {variant === VARIANTS.DEFAULT && (
                            <CardTitle className="mb-2 text-base 3xl:text-2xl font-normal italic text-accent text-center">
                                Acquired <span className="3xl:block font-semibold">Premium</span>
                            </CardTitle>
                        )}
                        <dl className="text-sm text-white grid grid-cols-[auto_auto] leading-4 gap-x-4">
                            {items.map((item) => (
                                <Fragment key={item.id}>
                                    <dt className="text-left py-0.5">{item.name}</dt>
                                    <dd className="px-1.5 bg-accent/[.2] text-accent first-of-type:rounded-t last-of-type:rounded-b w-6 text-center justify-self-end flex items-center justify-center">
                                        {item.amount}
                                    </dd>
                                </Fragment>
                            ))}
                        </dl>
                    </>
                )}
            </div>
        </Card>
    );
};

export default UpgradeCard;
