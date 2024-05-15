import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import ArrowIcon from "@/assets/v2/svg/arrow-2.svg";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

const UpgradeBanner = ({ isPremium = false }) => (
    <Card variant="none" border="none" className={cn("p-0 min-w-[480px] bg-upgrade-to-premium-banner-pattern bg-cover bg-center bg-no-repeat", { "bg-premium-banner": isPremium })}>
        <div className={cn("py-4 px-8 relative w-full flex items-center bg-banner-gradient", { "justify-end ": !isPremium })}>
            {isPremium ? (
                <div className="flex w-full items-center justify-between">
                    <div>
                        <CardTitle className="mb-1 text-accent font-medium">Acquired premium</CardTitle>
                        <Button variant="link" className="text-white">
                            <span>More</span>
                            <ArrowIcon className="ml-2" />
                        </Button>
                    </div>

                    <dl>
                        <div className="mb-1 flex items-center">
                            <dt className="mr-2">Guaranteed Allocation</dt>
                            <dd className="ml-auto h-6 w-6 flex items-center justify-center bg-accent/[.2] text-accent rounded">1</dd>
                        </div>
                        <div className="flex items-center">
                            <dt className="mr-2">Increased Allocation</dt>
                            <dd className="ml-auto h-6 w-6 px-1.5 flex items-center justify-center bg-accent/[.2] text-accent rounded">5</dd>
                        </div>
                    </dl>
                </div>
            ) : (
                <>
                    <IconButton name="Upgrade" shape="circle" variant="accent" icon={ArrowIcon} className="p-1" />
                    <div className="ml-8">
                        <CardTitle className="text-lg font-regular italic text-accent">
                            Upgrade to {" "}
                            <span className="font-semibold">Premium!</span>
                        </CardTitle>

                        <CardDescription className="text-sm font-light text-foreground">
                            Increase your allocation size.
                        </CardDescription> 
                    </div>
                </>
            )}
        </div>
    </Card>
);

export default UpgradeBanner;
