import { useRouter } from "next/router";
import Link from "next/link";

import { IconButton } from "@/v2/components/ui/icon-button";
import { mainMenu } from "@/v2/menus";
import { cn } from "@/lib/cn";

export default function Navbar() {
    const router = useRouter();

    return (
        <nav className="fixed bottom-0 h-24 w-full bg-primary-800 md:hidden z-10">
            <div className="absolute z-10 -top-8 h-8 w-full bg-gradient-to-b from-transparent to-primary-950 flex justify-between">
                <div
                    style={{
                        background: "-webkit-radial-gradient(100% 0, circle, rgba(255,0,0,0) 32px, currentColor 10px)",
                        backgroundPosition: "top right",
                        backgroundRepeat: "no-repeat",
                    }}
                    className="size-8 bg-primary-800 text-primary-800"
                />
                <div
                    style={{
                        background: "-webkit-radial-gradient(0 0, circle, rgba(255,0,0,0) 32px, currentColor 10px)",
                        backgroundPosition: "top left",
                        backgroundRepeat: "no-repeat",
                    }}
                    className="size-8 bg-primary-800 text-primary-800"
                />
            </div>
            <ul className="pt-4 px-4 mx-auto max-w-2xl flex items-center justify-between gap-4 sm:px-16">
                {mainMenu.map(({ name, path, icon }) => {
                    const isSelected = router.pathname === path;

                    return (
                        <li key={name}>
                            <Link href={path} className="flex flex-col items-center">
                                <IconButton
                                    icon={icon}
                                    className="h-12 w-12 p-4"
                                    shape="circle"
                                    variant={isSelected ? "gradient" : "transparent"}
                                />
                                <span
                                    className={cn("mt-1 text-[12px] text-foreground font-medium text-center", {
                                        "text-primary": isSelected,
                                    })}
                                >
                                    {name}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
