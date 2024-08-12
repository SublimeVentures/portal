import Link from "next/link";
import { useRouter } from "next/router";

import { tabletMenu } from "@/v2/menus";
import { cn } from "@/lib/cn";

export default function TabletNavbar() {
    const router = useRouter();

    return (
        <nav className="py-2 bg-navy-500 rounded">
            <ul className="px-2 flex items-center justify-between">
                {tabletMenu.map(({ name, path }) => (
                    <li key={path} className={cn("py-2 px-4 text-xs text-foreground whitespace-nowrap rounded cursor-pointer hover:bg-primary/[.5]", { "bg-primary-light-gradient font-medium": router.pathname === path } )}>
                        <Link href={path}>{name}</Link>
                    </li>
               ))}
            </ul>
        </nav>
    );
};
