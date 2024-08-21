import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import { Content as SheetContent, Close as SheetClose } from "@radix-ui/react-dialog";

import { layoutStyles } from "./AppLayout";
import { Sheet, SheetPortal, SheetTrigger } from "@/v2/components/ui/sheet";
import NotificationMenu from "@/v2/components/Notification/NotificationMenu";
import { ChainSwitch } from "@/v2/components/App/Vault";
import { Button } from "@/v2/components/ui/button";
import { Avatar } from "@/v2/components/ui/avatar";
import { IconButton } from "@/v2/components/ui/icon-button";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { shortenAddress } from "@/v2/lib/helpers";
import { cn } from "@/lib/cn";
import { useTenantSpecificData } from "@/v2/helpers/tenant";
import { useEscapeKey } from "@/v2/hooks";
import tailwindConfig from "@/../tailwind/config.core";
import MenuIcon from "@/v2/assets/svg/menu.svg";
import CrossIcon from "@/v2/assets/svg/cross.svg";
import { mainMenu, profileMenu, socialMenu } from "@/v2/menus";
import PAGE from "@/routes";

const renderLogo = (componentName) => {
    const TenantLogo = dynamic(() => import(`@/v2/components/Tenant/Logo/${componentName}`), { ssr: true });
    return <TenantLogo />;
};

export default function MobileMenu({ isBlockedAlert }) {
    const router = useRouter();
    const { environmentCleanup } = useEnvironmentContext();
    const { components } = useTenantSpecificData();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [walletAddress] = useState("0x1234567890abcdef1234567890abcdef12345678"); // Mock address

    useEscapeKey(() => setIsMobileMenuOpen(false));

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > parseInt(tailwindConfig.theme.extend.screens["2xl"]) && isMobileMenuOpen)
                setIsMobileMenuOpen(false);
        };

        window.addEventListener("resize", debounce(handleResize, 500));
        return () => window.removeEventListener("resize", debounce(handleResize, 500));
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const handleRouteChange = () => setIsMobileMenuOpen(false);

        router.events.on("routeChangeStart", handleRouteChange);

        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, [router.events]);

    const handleExternalLinkOpen = (evt, path) => {
        evt.preventDefault();
        window.open(path, "_blank");
    };

    const handleLogout = () => environmentCleanup();

    const generateMenu = (name, items) => {
        return (
            <>
                <h2 className="p-4 mt-8 text-xs font-normal text-foreground">{name}</h2>
                <ul className="flex flex-col gap-1">
                    {items.map(({ name, path }) => (
                        <li
                            key={name}
                            className={cn(
                                "text-xl leading-8 font-normal text-foreground hover:bg-[#164062] rounded cursor-pointer",
                            )}
                        >
                            <Link href={path} className="block px-8">
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </>
        );
    };

    return (
        <Sheet open={isMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
                <IconButton
                    name="Toggle mobile menu"
                    onClick={() => setIsMobileMenuOpen(true)}
                    icon={isMobileMenuOpen ? CrossIcon : MenuIcon}
                    className="p-3 relative z-10"
                />
            </SheetTrigger>

            <SheetPortal>
                <SheetContent
                    style={{ ...layoutStyles, "--alertHeight": isBlockedAlert ? layoutStyles["--alertHeight"] : "0px" }}
                    className="fixed z-50 right-0 top-0 mt-[var(--alertHeight)] h-[calc(100vh_-_var(--alertHeight))] w-full flex flex-col bg-[#071321] transition ease-in-out overflow-auto mobile-scrollbar data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-300 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
                >
                    <div className="p-4 w-full flex items-center justify-between">
                        <Link href={PAGE.App}>
                            <div className="flex items-center">{renderLogo(components.logo)}</div>
                        </Link>
                        <div className="flex items-center gap-4">
                            <NotificationMenu />
                            <ChainSwitch />
                            <SheetClose
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="rounded transition-opacity outline-none hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-secondary"
                            >
                                <IconButton name="Close" comp="div" icon={CrossIcon} className="p-3.5" />
                            </SheetClose>
                        </div>
                    </div>

                    <div
                        className={cn(
                            "pb-12 flex flex-col h-full w-full items-center transform -translate-x-full transition-transform duration-300 ease-in-out ",
                            {
                                "translate-x-0": isMobileMenuOpen,
                            },
                        )}
                    >
                        <div className="px-4 w-full max-w-72 flex flex-col grow items-center gap-4">
                            <nav className="flex flex-col items-center text-center">
                                {generateMenu("Menu", mainMenu)}
                                {generateMenu("Account", profileMenu)}
                            </nav>
                            <div className="m-6 flex flex-col items-center">
                                <h2 className="text-xs font-normal text-gray-100">Community</h2>
                                <ul className="flex items-center gap-4">
                                    {socialMenu.map(({ icon, name, path }) => (
                                        <li key={name} className="pt-4">
                                            <IconButton
                                                variant="transparent"
                                                shape="circle"
                                                name={name}
                                                icon={icon}
                                                onClick={(evt) => handleExternalLinkOpen(evt, path)}
                                                className="p-2.5"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-auto flex flex-col items-center w-full gap-4">
                                <Avatar size="large" session={null} />
                                <Button className="w-full" variant="secondary" onClick={handleLogout}>
                                    Logout
                                </Button>
                                <p className="text-sm font-light text-foreground">{shortenAddress(walletAddress)}</p>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </SheetPortal>
        </Sheet>
    );
}
