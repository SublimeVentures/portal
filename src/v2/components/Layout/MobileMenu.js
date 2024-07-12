import { useState, useEffect } from "react";
import Link from "next/link";
import debounce from "lodash.debounce";

import { Button } from "@/v2/components/ui/button";
import { Avatar } from "@/v2/components/ui/avatar";
import { IconButton } from "@/v2/components/ui/icon-button";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { useOutsideClick, useEscapeKey } from "@/v2/hooks";
import PAGE from "@/routes";
import { cn } from "@/lib/cn";
import { shortenAddress } from "@/v2/lib/helpers";
import tailwindConfig from "@/../tailwind/config.core";

import MenuIcon from "@/v2/assets/svg/menu.svg";
import CrossIcon from "@/v2/assets/svg/cross.svg";
import { socialMenu } from "@/v2/menus";
const MobileMenu = () => {
    const { environmentCleanup } = useEnvironmentContext();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [walletAddress] = useState("0x1234567890abcdef1234567890abcdef12345678"); // Mock address

    const menuRef = useOutsideClick(() => setIsMobileMenuOpen(false));
    useEscapeKey(() => setIsMobileMenuOpen(false));

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > parseInt(tailwindConfig.theme.extend.screens.lg) && isMobileMenuOpen)
                setIsMobileMenuOpen(false);
        };

        window.addEventListener("resize", debounce(handleResize, 500));
        return () => window.removeEventListener("resize", debounce(handleResize, 500));
    }, [isMobileMenuOpen]);

    const handleExternalLinkOpen = (evt, path) => {
        evt.preventDefault();
        window.open(path, "_blank");
    };

    const handleLogout = () => environmentCleanup();

    const generateMenu = (name, items) => {
        return (
            <>
                <h2 className="p-4 mt-8 text-xxs text-foreground">{name}</h2>
                <ul className="flex flex-col gap-2">
                    {items.map(({ name, path }) => (
                        <li
                            key={name}
                            className={cn(
                                "text-xl py-2 font-normal text-foreground hover:bg-[#164062] rounded cursor-pointer",
                            )}
                        >
                            <Link href={path} className="px-8">
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </>
        );
    };

    return (
        <div ref={menuRef} className="lg:hidden">
            <IconButton
                name="Toggle mobile menu"
                onClick={() => setIsMobileMenuOpen((prevState) => !prevState)}
                icon={isMobileMenuOpen ? CrossIcon : MenuIcon}
                className="p-3 relative z-10"
            />

            <div
                className={cn(
                    "fixed inset-0 pt-24 pb-16 flex flex-col grow h-full w-full items-center bg-[#071321] overflow-auto transform -translate-x-full transition-transform duration-300 ease-in-out ",
                    {
                        "translate-x-0": isMobileMenuOpen,
                    },
                )}
            >
                <div className="px-4 w-full max-w-72 flex flex-col grow items-center gap-4">
                    <nav className="flex flex-col items-center text-center">
                        {generateMenu("Menu", menu.groupUser)}
                        {generateMenu("Account", menu.groupProfile)}
                    </nav>
                    <div className="m-6 flex flex-col items-center">
                        <h2 className="text-xxs font-light text-gray-100">Community</h2>
                        <ul className="flex items-center gap-4">
                            {socialMenu.map(({ icon, name, path }) => (
                                <li key={name} className="pt-4">
                                    <IconButton
                                        variant="transparent"
                                        shape="circle"
                                        name={name}
                                        icon={icon}
                                        onClick={(evt) => handleExternalLinkOpen(evt, path)}
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
                        <p className="text-md text-foreground">{shortenAddress(walletAddress)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
const menu = {
    groupUser: [
        {
            name: "Vault",
            path: PAGE.App,
        },
        {
            name: "Opportunities",
            path: PAGE.Opportunities,
        },
        {
            name: "OTC Market",
            path: PAGE.OTC,
        },
        {
            name: "Upgrades",
            path: PAGE.Upgrades,
        },
    ],
    groupProfile: [
        {
            name: "Mystery Box",
            path: "/",
        },
        {
            name: "Settings",
            path: PAGE.Settings,
        },
        {
            name: "History",
            path: "/",
        },
    ],
};

export default MobileMenu;
