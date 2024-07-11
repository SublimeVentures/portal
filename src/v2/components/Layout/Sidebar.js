import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";

import ChangeNetwork from "@/components/Navigation/ChangeNetwork";
import ChangeAddress from "@/components/Navigation/ChangeAddress";
import { IconButton } from "@/v2/components/ui/icon-button";
import { cn } from "@/lib/cn";
import PAGE from "@/routes";
import { mainMenu, socialMenu } from "@/v2/menus";
import { useTenantSpecificData } from "@/v2/helpers/tenant";

const renderLogo = (componentName) => {
    const TenantLogo = dynamic(() => import(`@/v2/components/Tenant/Logo/${componentName}`), { ssr: true })
    return <TenantLogo />;
};

export default function({ session, isBlockedAlert = false }) {
    const router = useRouter();
    const { components } = useTenantSpecificData()

    const handleExternalLinkOpen = (evt, path) => {
        evt.preventDefault();
        window.open(path, "_blank");
    }

    const generateMenu = (name, items) => {
        return (
            <>
                <h2 className="p-8 text-xxs text-foreground">{name}</h2>
                <ul className="flex flex-col gap-2">
                    {items.map(({ name, path }) => (
                        <li key={path} className={cn("text-xl py-2 font-light text-foreground hover:bg-primary/[.5] rounded cursor-pointer", { "bg-primary-light-gradient": router.pathname === path } )}>
                            <Link href={path} className="px-8">{name}</Link>
                        </li>
                    ))}
                </ul>
            </>
        )
    };

    return (
        <aside className="p-6 fixed w-[var(--sidebarWidth)] inset-y-0 left-0 z-10 flex flex-col overflow-y-auto">
            <div className={cn("py-16 flex flex-col grow", { "mt-[var(--alertHeight)]": isBlockedAlert })}>
                <div className="flex justify-between">
                    <Link href={PAGE.App}>
                        <div className="flex items-center">{renderLogo(components.logo)}</div>
                    </Link>

                    <ChangeNetwork />
                    <ChangeAddress session={session} />
                </div>

                <nav>
                    {generateMenu("Menu", mainMenu.groupUser)}
                    {generateMenu("Account", mainMenu.groupProfile)}
                </nav>

                <div className="mt-auto flex flex-col items-center">
                    <h2 className="text-xxs font-light text-gray-100">Community</h2>
                    <ul className="flex items-center gap-2">
                        {socialMenu.map(({ icon, name, path }) => (
                            <li key={name} className="pt-4">
                                <IconButton
                                    variant="transparent"
                                    className="p-3"
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
    )
}
