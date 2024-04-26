import { ArrowTopRightIcon } from "@radix-ui/react-icons";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";

const UpgradeBanner = () => (
    <Card variant="none" border="none" className="p-0 min-w-[480px] bg-upgrade-to-premium-banner-pattern bg-cover bg-center bg-no-repeat">
        <div className="py-4 px-8 relative w-full flex items-center justify-end bg-banner-gradient">
            <IconButton name="Upgrade" shape="circle" variant="accent" icon={ArrowTopRightIcon} />

            <div className="ml-8">
                <CardTitle className="text-lg font-regular italic text-accent">
                    Upgrade to {" "}
                    <span className="font-semibold">Premium!</span>
                </CardTitle>

                <CardDescription className="text-sm font-light text-foreground">
                    Increase your allocation size.
                </CardDescription> 
            </div>
        </div>
    </Card>
);

export default UpgradeBanner;
