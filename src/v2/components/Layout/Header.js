import Link from "next/link";
import dynamic from "next/dynamic";

import MobileMenu from "./MobileMenu";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { useTenantSpecificData } from "@/v2/helpers/tenant";
import NotificationMenu from "@/v2/components/Notification/NotificationMenu";
import { Button } from "@/v2/components/ui/button";
import { ChainSwitch } from "@/v2/components/App/Vault";
import { Avatar } from "@/v2/components/ui/avatar";
import { shortenAddress } from "@/v2/lib/helpers";
import PAGE from "@/routes";
import { cn } from "@/lib/cn";

const mockedUser = {
    username: "Steady Stacker",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
};

const renderLogo = (componentName) => {
    const TenantLogo = dynamic(() => import(`@/v2/components/Tenant/Logo/${componentName}`), { ssr: true });
    return <TenantLogo />;
};

export default function Header({ title, isBlockedAlert, className, session }) {
    const {
        environmentCleanup,
        account: { address },
        networkToggle,
    } = useEnvironmentContext();
    const { components } = useTenantSpecificData();
    const handleLogout = () => environmentCleanup();
    return (
        <header className={cn("flex justify-between shrink-0", className)}>
            <div className="flex justify-between items-center w-full h-max text-white">
                <div className={cn("lg:hidden", { "w-0 overflow-hidden": networkToggle })}>
                    <Link href={PAGE.App}>
                        <div className="flex items-center">{renderLogo(components.logo)}</div>
                    </Link>
                </div>

                <div className="hidden items-baseline lg:flex">
                    {title && (
                        <h2 className="text-lg font-semibold lg:text-2xl lg:font-medium text-foreground select-none">
                            {title}
                        </h2>
                    )}
                </div>

                <div className="flex items-center gap-4 justify-self-end">
                    <div className="hidden items-center gap-4 md:flex select-none">
                        <p className="text-sm font-light text-foreground">{shortenAddress(address ?? "")}</p>
                        <Avatar className="bg-white size-13 pointer-events-none" session={session} />
                        <div className="mx-2 h-6 w-0.5 bg-foreground" />
                    </div>

                    <NotificationMenu />
                    <ChainSwitch />
                    <Button className="hidden lg:block" variant="secondary" onClick={handleLogout}>
                        Logout
                    </Button>

                    <MobileMenu isBlockedAlert={isBlockedAlert} />
                </div>
            </div>
        </header>
    );
}
