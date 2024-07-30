import Link from "next/link";
import dynamic from "next/dynamic";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { useTenantSpecificData } from "@/v2/helpers/tenant";
import NotificationMenu from "@/v2/components/Notification/NotificationMenu";
import { Button } from "@/v2/components/ui/button";
import { ChainSwitch } from "@/v2/components/App/Vault";
import { Avatar } from "@/v2/components/ui/avatar";
import { shortenAddress } from "@/v2/lib/helpers";
import PAGE from "@/routes";
import MobileMenu from "./MobileMenu";

const mockedUser = {
    username: "Steady Stacker",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
};

const renderLogo = (componentName) => {
    const TenantLogo = dynamic(() => import(`@/v2/components/Tenant/Logo/${componentName}`), { ssr: true })
    return <TenantLogo />;
};

export default function Header({ title, isBlockedAlert }) {
    const { environmentCleanup } = useEnvironmentContext();
    const { components } = useTenantSpecificData();
    
    const handleLogout = () => environmentCleanup();

    return (
        <header className="flex items-center justify-between text-white">
            <div className="2xl:hidden">
                <Link href={PAGE.App}>
                    <div className="flex items-center">{renderLogo(components.logo)}</div>
                </Link>
            </div>

            <div className="hidden items-baseline 2xl:flex">
                {title && <h2 className="text-7xl font-bold text-foreground">{title}</h2>}
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden items-center gap-4 md:flex">
                    <p className="text-md text-foreground">{shortenAddress(mockedUser.walletAddress)}</p>
                    <Avatar className="bg-white" />
                    <div className="mx-2 h-6 w-0.5 bg-foreground" />
                    <p>+4</p>
                </div>

                <NotificationMenu />
                <ChainSwitch />
                <Button className="hidden 2xl:block" variant="secondary" onClick={handleLogout}>
                    Logout
                </Button>

                <MobileMenu isBlockedAlert={isBlockedAlert} />
            </div>
        </header>
    );
};
