import NotificationMenu from "@/v2/components/Notification/NotificationMenu";
import { MobileMenu } from "@/v2/components/Layout";
import { SingleChain } from "@/v2/components/App/Vault";
import DiamondIcon from "@/v2/assets/svg/diamond.svg";

export default function MobileHeader({ isBlockedAlert }) {
    return (
        <header className="pb-8 relative z-30 w-full flex items-center lg:hidden">
            <div className="py-4 mb-8 flex grow items-center justify-between lg:py-0">
                <div className="z-10 flex flex-col lg:hidden">
                    <h1 className="text-8xl font-semibold text-foreground">based.vc</h1>
                    <p className="text-md font-light text-foreground">VC for all</p>
                </div>

                <div className="z-10 ml-auto mr-4 flex items-center gap-4">
                    <NotificationMenu isBlockedAlert={isBlockedAlert} />
                    <SingleChain icon={DiamondIcon} active />
                </div>
                
                <MobileMenu />
            </div>
        </header>
    );
};
