import { useRouter } from "next/router";
import Link from "next/link";

import { IconButton } from "@/v2/components/ui/icon-button";
import { mainMenu } from "@/v2/menus";
import { cn } from "@/lib/cn";

export default function Navbar() {
    const router = useRouter();

    return (
        <nav className="fixed bottom-0 h-[var(--navbarHeight)] w-full bg-[#082536] md:hidden">
            <ul className="pt-4 px-4 mx-auto max-w-2xl flex items-center justify-between gap-4 sm:px-16">
                {mainMenu.map(({ name, path, icon }) => {
                    const isSelected = router.pathname === path;

                    return (
                        <li key={name}>
                            <Link href={path} className="flex flex-col items-center">
                                <IconButton icon={icon} className="h-12 w-12 p-4" shape="circle" variant={isSelected ? "gradient" : "transparent"} />
                                <span className={cn("mt-1 text-[12px] text-foreground font-medium text-center", { "text-primary": isSelected })}>
                                    {name}
                                </span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    );
};
