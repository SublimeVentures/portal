import { useRouter } from "next/router";
import Link from "next/link";

import PAGE from "@/routes";
import { IconButton } from "@/v2/components/ui/icon-button";
import NounStatisticsIcon from "@/v2/assets/svg/noun-statistics.svg";
import NounVaultIcon from "@/v2/assets/svg/noun-vault.svg";
import CourtIcon from "@/v2/assets/svg/court.svg";
import DiamondIcon from "@/v2/assets/svg/diamond.svg";

const NavigationTabs = () => {
    const router = useRouter();

    return (
        <div className="fixed bottom-0 pt-2 flex flex-col h-[var(--navbarHeight)] w-full bg-[#082536] lg:hidden">
            <ul className="px-9 flex items-center justify-between gap-4">
                {menu.map(({ name, path, icon }) => (
                    <li key={name}>
                        <Link href={path}>
                            <IconButton className="h-12 w-12 p-3" shape="circle" variant={router.pathname === path ? "gradient" : "transparent"} icon={icon} />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
};

const menu = [
    {
        name: "1",
        path: PAGE.App,
        icon: NounStatisticsIcon,
    },
    {
        name: "2",
        path: "/",
        icon: NounVaultIcon,
    },
    {
        name: "3",
        path: "/",
        icon: CourtIcon,
    },
    {
        name: "4",
        path: "/",
        icon: DiamondIcon,
    },
];

export default NavigationTabs;
