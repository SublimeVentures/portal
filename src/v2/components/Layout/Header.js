import Link from "next/link";
import Logo from "@tenant/components/Logo";
import MobileMenu from "./MobileMenu";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import NotificationMenu from "@/v2/components/Notification/NotificationMenu";
import { Button } from "@/v2/components/ui/button";
import { ChainSwitch } from "@/v2/components/App/Vault";
import { Avatar } from "@/v2/components/ui/avatar";
import { shortenAddress } from "@/v2/lib/helpers";
import PAGE from "@/routes";
import { cn } from "@/lib/cn";

export default function Header({ title, isBlockedAlert, className, session }) {
    const {
        environmentCleanup,
        account: { address },
        networkToggle,
    } = useEnvironmentContext();

    const handleLogout = () => environmentCleanup();
    return (
        <header className={cn("flex justify-between shrink-0", className)}>
            <div className="flex justify-between items-center w-full h-max text-white">
                <div className={cn("lg:hidden", { "w-0 overflow-hidden": networkToggle })}>
                    <Link href={PAGE.App}>
                        <div className="flex items-center">
                            <Logo />
                        </div>
                    </Link>
                </div>
                <div className="hidden items-baseline lg:flex">
                    {title && (
                        <h2 className="text-lg font-semibold lg:text-2xl lg:font-medium text-white select-none font-heading">
                            {title}
                        </h2>
                    )}
                </div>
                <div className="flex items-center gap-4 justify-self-end">
                    <div className="hidden items-center gap-4 md:flex select-none">
                        <p className="text-sm font-light text-white">{shortenAddress(address ?? "")}</p>
                        <Avatar className="size-13 pointer-events-none" session={session} />
                        <div className="mx-2 h-6 w-0.5 bg-white" />
                    </div>
                    <NotificationMenu />
                    <ChainSwitch />
                    <Button className="hidden lg:block" variant="secondary" onClick={handleLogout}>
                        Logout
                    </Button>
                    <MobileMenu isBlockedAlert={isBlockedAlert} session={session} />
                </div>
            </div>
        </header>
    );
}
