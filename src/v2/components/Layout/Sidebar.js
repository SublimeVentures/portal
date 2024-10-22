import { useRouter } from "next/router";
import Link from "next/link";
import Logo from "@tenant/components/Logo";
import { IconButton } from "@/v2/components/ui/icon-button";
import { cn } from "@/lib/cn";
import PAGE from "@/routes";
import { mainMenu, profileMenu, socialMenu } from "@/v2/menus";

export default function Sidebar({ isBlockedAlert = false, className }) {
    const router = useRouter();

    const handleExternalLinkOpen = (evt, path) => {
        evt.preventDefault();
        window.open(path, "_blank");
    };

    const generateMenu = (name, items) => {
        return (
            <>
                <h2 className="px-6 lg:py-2 3xl:py-2.5 lg:mb-2 text-sm font-light text-white/60 mt-16 select-none font-heading">
                    {name}
                </h2>
                <ul className="flex flex-col gap-2">
                    {items.map(({ name, path }) => (
                        <li
                            key={path}
                            className={cn(
                                "text-base font-normal text-white transition-colors hover:bg-primary/30 rounded cursor-pointer",
                                {
                                    "bg-gradient-to-r from-primary to-primary-600 font-medium":
                                        router.pathname.includes(path),
                                },
                            )}
                        >
                            <Link href={path} className="px-6 block lg:py-1.5 3xl:py-2 ">
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </>
        );
    };

    return (
        <aside className={cn("px-6 fixed inset-y-0 left-0 z-10 flex flex-col overflow-y-auto", className)}>
            <div className={cn("lg:py-9 3xl:py-19 flex flex-col grow", { "mt-[var(--alertHeight)]": isBlockedAlert })}>
                <div className="flex justify-between h-32">
                    <Link href={PAGE.App}>
                        <div className="flex items-center pb-12">
                            <Logo />
                        </div>
                    </Link>
                </div>

                <nav>
                    {generateMenu("Menu", mainMenu)}
                    {generateMenu("Account", profileMenu)}
                </nav>

                <div className="mt-auto flex flex-col items-center">
                    <h2 className="text-sm font-light text-white/60 select-none font-heading">Community</h2>

                    <ul className="pt-2 flex items-center">
                        {socialMenu.map(({ icon, name, path }) => (
                            <li key={name}>
                                <IconButton
                                    variant="transparent"
                                    className="p-2.5 size-9"
                                    shape="circle"
                                    name={name}
                                    icon={icon}
                                    onClick={(evt) => handleExternalLinkOpen(evt, path)}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </aside>
    );
}
