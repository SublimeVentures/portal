import { ArrowTopRightIcon } from "@radix-ui/react-icons";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";

const UpgradeCard = () => (
    <Card variant="none" border="none" className="py-8 relative flex flex-col items-center grow aspect-[7/12] bg-upgrade-to-premium-pattern bg-cover bg-center bg-no-repeat">
        <IconButton name="Upgrade" shape="circle" variant="accent" icon={ArrowTopRightIcon} className="absolute top-4 right-4" />

        <CardTitle className="mt-auto mb-2 text-6xl font-regular italic text-accent text-center">
          Upgrade to
          <span className="block font-semibold">Premium!</span>
        </CardTitle>

        <CardDescription className="max-w-52 text-sm font-light text-foreground text-center">
          1 Guaranteed Allocation & Increased allocation size by {" "}
          <span className="font-semibold">6!</span>
        </CardDescription>
    </Card>
);

export default UpgradeCard;
