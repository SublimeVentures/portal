import { useState, useEffect } from 'react';
import Link from "next/link";
import debounce from 'lodash.debounce';
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { useOutsideClick, useEscapeKey } from '@/hooks';
import { cn } from '@/lib/cn';

import { IoBookOutline as IconWiki } from "react-icons/io5";
import { FaDiscord as IconDiscord } from "react-icons/fa";
import PAGE, { ExternalLinks } from "@/routes";

const MobileMenu = () => {
    const { environmentCleanup } = useEnvironmentContext();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuRef = useOutsideClick(() => setIsMobileMenuOpen(false))
    useEscapeKey(() => setIsMobileMenuOpen(false))

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isMobileMenuOpen) setIsMobileMenuOpen(false)
        }

        window.addEventListener('resize', debounce(handleResize, 500))
        return () => window.removeEventListener('resize', debounce(handleResize, 500))
    }, [isMobileMenuOpen])

    const handleExternalLinkOpen = (evt, path) => {
        evt.preventDefault()
        window.open(path, "_blank");
    }

    const handleLogout = () => environmentCleanup();

    const generateMenu = (name, items) => {
        return (
            <>
                <h2 className="p-4 mt-8 text-xxs text-foreground">{name}</h2>
                <ul className="flex flex-col gap-2">
                    {items.map(({ name, path }) => (
                        <li key={path} className={cn("text-xl py-2 font-normal text-foreground hover:bg-[#164062] rounded cursor-pointer" )}>
                            <Link href={path} className="px-8">{name}</Link>
                        </li>
                    ))}
                </ul>
            </>
        )
    };

    return (
        <div ref={menuRef} className="collap:hidden">
            <IconButton
                name="Toggle mobile menu" 
                onClick={() => setIsMobileMenuOpen(prevState => !prevState)}
                icon={isMobileMenuOpen ? Cross1Icon : HamburgerMenuIcon}
                className="relative z-10"
            />

            <div className={cn(
                "fixed inset-0 py-16 flex flex-col grow h-full w-full items-center bg-primary-dark-gradient overflow-auto transform -translate-x-full transition-transform duration-300 ease-in-out",
                {
                    "translate-x-0": isMobileMenuOpen,
                }
            )}>
                <div className='px-4 w-full max-w-72 flex flex-col items-center gap-4'>
                    <nav className='flex flex-col items-center text-center'>
                        {generateMenu("Menu", menu.groupUser)}
                        {generateMenu("Account", menu.groupProfile)}
                    </nav>

                    <div className="m-6 flex flex-col items-center">
                        <h2 className="text-xxs font-light text-[#AEB3B8]">Community</h2>
                        <ul className="flex items-center gap-4">
                            {socialMenu.map(({ icon, name, path }) => (
                                <li key={name} className="pt-4">
                                <IconButton
                                        variant="transparent"
                                        shape="circle"
                                        name={name}
                                        icon={icon}
                                        className="w-[36px] h-[36px]"
                                        onClick={(evt) => handleExternalLinkOpen(evt, path)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <Avatar size="large">
                        <AvatarImage src="" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Button className="w-full" variant="secondary" onClick={handleLogout}>Logout</Button>
                    <p className="text-md text-foreground">123..456</p>
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
    ]
  }
  
  const socialMenu = [
    {
        name: "discord",
        path: ExternalLinks.DISCORD,
        icon: IconDiscord,
    },
    {
        name: "gitbook",
        path: ExternalLinks.WIKI,
        icon: IconWiki,
    },
    {
        name: "twitter-x",
        path: "/",
        icon: IconDiscord,
    },
  ]
  

export default MobileMenu;
