import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import ArrowIcon from "@/assets/v2/svg/arrow-2.svg";

const UpgradeCard = ({ isPremium = false }) => (
    <Card variant="none" border="none" className="py-8 relative flex flex-col items-center grow aspect-[7/12] bg-upgrade-to-premium-pattern bg-cover bg-center bg-no-repeat">
      <IconButton name="Upgrade" shape="circle" variant="accent" icon={ArrowIcon} className="p-1 absolute top-4 right-4" />
        {isPremium ? (
          <>
            <CardTitle className="mt-auto mb-2 text-6xl font-regular italic text-accent text-center">
              Upgrade to
              <span className="block font-semibold">Premium!</span>
            </CardTitle>
            <CardDescription className="max-w-52 text-sm font-light text-foreground text-center">
              Increase your allocation size.
            </CardDescription>
          </>
        ) : (
          <div className="mt-auto">
            <div>
                <CardTitle className="mt-auto mb-2 text-6xl font-regular italic text-accent text-center">
                    Acquired
                    <span className="block font-semibold">premium</span>
                </CardTitle>
            </div>
            
            <dl>
                <div className="flex items-center">
                    <dt className="mr-2">Guaranteed Allocation</dt>
                    <dd className="ml-auto h-6 w-6 flex items-center justify-center bg-accent/[.2] text-accent rounded-t">1</dd>
                </div>
                <div className="flex items-center">
                    <dt className="mr-2">Increased Allocation</dt>
                    <dd className="ml-auto h-6 w-6 px-1.5 flex items-center justify-center bg-accent/[.2] text-accent rounded-b">5</dd>
                </div>
            </dl>
          </div>
        )}
    </Card>
);

export default UpgradeCard;
