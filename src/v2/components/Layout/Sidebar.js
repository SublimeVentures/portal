import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";

import ChangeNetwork from "@/components/Navigation/ChangeNetwork";
import { IconButton } from "@/v2/components/ui/icon-button";
import { cn } from "@/lib/cn";
import PAGE from "@/routes";
import { mainMenu, profileMenu, socialMenu } from "@/v2/menus";
import { useTenantSpecificData } from "@/v2/helpers/tenant";

const renderLogo = (componentName) => {
    const TenantLogo = dynamic(() => import(`@/v2/components/Tenant/Logo/${componentName}`), { ssr: true });
    return <TenantLogo />;
};

export default function Sidebar({ isBlockedAlert = false, className }) {
    const router = useRouter();
    const { components } = useTenantSpecificData();

    const handleExternalLinkOpen = (evt, path) => {
        evt.preventDefault();
        window.open(path, "_blank");
    };

    const generateMenu = (name, items) => {
        return (
            <>
                <h2 className="px-6 lg:py-2 3xl:py-2.5 lg:mb-2 text-sm font-light text-foreground mt-16 select-none">
                    {name}
                </h2>
                <ul className="flex flex-col gap-2">
                    {items.map(({ name, path }) => (
                        <li
                            key={path}
                            className={cn(
                                "text-base font-normal text-foreground transition-colors hover:bg-primary/30 rounded cursor-pointer",
                                {
                                    "bg-gradient-to-r from-primary to-primary-600 font-medium":
                                        router.pathname === path,
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
                <div className="flex justify-between">
                    <Link href={PAGE.App}>
                        <div className="flex items-center pb-12">{renderLogo(components.logo)}</div>
                    </Link>
                </div>

                <nav>
                    {generateMenu("Menu", mainMenu)}
                    {generateMenu("Account", profileMenu)}
                </nav>

                <div className="mt-auto flex flex-col items-center">
                    <h2 className="text-sm font-light text-white/60 select-none">Community</h2>
                    
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
