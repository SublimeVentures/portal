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

const mockedUser = {
    username: "Steady Stacker",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
};

const renderLogo = (componentName) => {
    const TenantLogo = dynamic(() => import(`@/v2/components/Tenant/Logo/${componentName}`), { ssr: true });
    return <TenantLogo />;
};

export default function Header({ title, isBlockedAlert }) {
    const { environmentCleanup } = useEnvironmentContext();
    const { components } = useTenantSpecificData();

    const handleLogout = () => environmentCleanup();

    return (
        <header className="flex items-center justify-between text-white p-4 md:p-0">
            <div className="2xl:hidden">
                <Link href={PAGE.App}>
                    <div className="flex items-center">{renderLogo(components.logo)}</div>
                </Link>
            </div>

            <div className="hidden items-baseline 2xl:flex">
                {title && <h2 className="text-lg font-semibold lg:text-2xl lg:font-medium text-foreground">{title}</h2>}
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden items-center gap-4 md:flex">
                    <p className="text-sm font-light text-foreground">{shortenAddress(mockedUser.walletAddress)}</p>
                    <Avatar className="bg-white" />
                    <div className="mx-2 h-6 w-0.5 bg-foreground" />
                </div>
                <div className="flex items-center lg:flex-row-reverse">
                    <NotificationMenu />
                    <ChainSwitch />
                </div>
                <Button className="hidden 2xl:block" variant="secondary" onClick={handleLogout}>
                    Logout
                </Button>

                <MobileMenu isBlockedAlert={isBlockedAlert} />
            </div>
        </header>
    );
}
