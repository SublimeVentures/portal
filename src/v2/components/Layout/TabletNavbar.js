import Link from "next/link";
import { useRouter } from "next/router";

import { tabletMenu } from "@/v2/menus";
import { cn } from "@/lib/cn";

export default function TabletNavbar() {
    const router = useRouter();

    return (
        <nav className="py-1 bg-primary-700 rounded hidden sm:block md:py-1.5">
            <ul className="px-1 flex items-center justify-between md:px-2">
                {tabletMenu.map(({ name, path }) => (
                    <li key={path}>
                        <Link
                            href={path}
                            className={cn(
                                "block p-2 text-xs text-white whitespace-nowrap rounded cursor-pointer hover:bg-primary/50 md:px-4",
                                {
                                    "bg-gradient-to-r from-primary to-primary-600 font-medium":
                                        router.pathname.substring(4) === path,
                                },
                            )}
                        >
                            {name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
